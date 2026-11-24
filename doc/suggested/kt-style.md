# Suggested Kotlin Style Guide: Zero-Overhead K2, Structured Concurrency & JVM/Native Clarity (`doc/suggested/kt-style.md`)

#### status: suggested language rules (`src-kt`, `src-kt.dev`, `src-kt.main`, `src-kt.testing`)
#### fast-pass spec: [`res/src-kt/rules-fastpass.md`](../../res/src-kt/rules-fastpass.md) | [`res/src-kt/rules-fastpass.agent.txt`](../../res/src-kt/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Orthodox Data-Oriented Kotlin (Zero DSL Soup)

Kotlin 2.x (K2 compiler across JVM, Native, and Multiplatform) offers null safety, algebraic `sealed interface` hierarchies, zero-cost `@JvmInline value class` types, structured coroutines, and 100% seamless interoperability with `src-java`.

However, unguided developers and LLMs (GPT, DeepSeek, local open-weights models) routinely abuse Kotlin's expressiveness—turning codebases into unreadable "cleverness": nested `.let { .run { .also { } } }` puzzles, implicit `this` receiver DSLs where nobody knows what scope a method comes from, global extension-function pollution, and 30 transitive Maven/Gradle plugins.

Inspired by **Google's Kotlin Style Guide** and `lib-agent`'s forever-code ethos, our Kotlin subset enforces **explicit, predictable, zero-magic engineering**:
1. **Explicit Public Types (`explicitApi()`):** Every public function and property declares its exact visibility (`public` / `internal` / `private`) and return type—never inferred public types that silently break downstream callers.
2. **Ban Scope-Function Gymnastics & `!!`:** Use plain `val` locals and early `if (x == null) return ...` guards instead of chaining `.let` / `.run` / `.takeIf`. Never write `!!`; validate invariants explicitly (`require(...)` / `check(...)`).
3. **Zero Unaudited Maven/Gradle Sprawl:** Prefer the Kotlin & JDK standard library (`kotlin.*`, `java.nio.*`, `java.math.*`, `java.security.*`) and audited static `3p/` sources under `src-kt.dev/3p/`.

---

## 2. Hard Rules for Memory, Financial Precision & Concurrency

1. **Zero-Cost Domain Wrappers & Unboxed Primitives:**
    - Wrap primitive identifiers, sequence numbers, and fixed-point currency micros in `@JvmInline value class` so invalid argument swaps are compile-time errors with **zero heap boxing** at runtime.
    - Use `ByteArray`, `IntArray`, and `LongArray` for binary frames, ring buffers, and codecs—never boxed `Array<Byte>` or `List<Byte>`.
    - Avoid eager collection chains (`.map { ... }.filter { ... }`) inside hot loops; use indexed `while` / `for` loops over primitive arrays so the JIT / Native backend emits tight unboxed machine code.
2. **Monetary & Financial Arithmetic Invariant:**
    - **Never use `Float` or `Double` for currency, prices, fees, or ledger balances.**
    - Use either `@JvmInline value class Micros(val raw: Long)` with `Math.addExact` / `Math.multiplyExact` overflow checks, or `java.math.BigDecimal` initialized from `String` or `BigDecimal.valueOf(unscaled, scale)` with an explicit `MathContext` and `RoundingMode.HALF_EVEN`.
3. **Structured Concurrency (Zero `GlobalScope` Leaks):**
    - If coroutines are used, every task must run inside an owned `CoroutineScope` with explicit cancellation propagation and `withTimeout(...)` deadlines.
    - Never use `GlobalScope.launch`, unbounded `Channel(Channel.UNLIMITED)` queues, or blocking I/O on `Dispatchers.Default`.
    - Rethrow `CancellationException` immediately if catching broad `Throwable` / `Exception`.
4. **Clean `src-java` Interoperability:**
    - Keep binary and source compatibility clean when sharing modules with `src-java`: avoid naming clashes, expose deterministic factory/static entry points with `@JvmStatic`, and defensively copy mutable collections crossing module boundaries.

---

## 3. Canonical File Layout & `1p` / `2p` / `3p` Imports

```kotlin
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

package org.libagent.ledger

// 1p
import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.atomic.AtomicInteger

// 2p
// import org.libagent.internal.LibagInvariant

// 3p
// (none - pure Kotlin/JDK stdlib core)

public object LibagStateFlags {
    public const val COLD: Int     = 0x01
    public const val ACTIVE: Int   = 0x02
    public const val DIRTY: Int    = 0x04
    public const val RESIDENT: Int = 0x08
}

@JvmInline
public value class LibagMicros(public val raw: Long) {
    init {
        require(raw >= 0L) { "fastpass_invariant_halt: negative micros ($raw)" }
    }

    public fun addExact(other: LibagMicros): LibagMicros =
        LibagMicros(Math.addExact(raw, other.raw))
}

public sealed interface LibagLedgerEvent {
    public data class Cleared(
        public val txId: String,
        public val amount: LibagMicros,
        public val feeRate: BigDecimal
    ) : LibagLedgerEvent {
        init {
            require(txId.isNotBlank()) { "fastpass_invariant_halt: blank txId" }
        }
    }

    public data class Rejected(
        public val txId: String,
        public val reasonCode: Int
    ) : LibagLedgerEvent
}

public class LibagLedgerCtx(public val maxEntries: Int = 1024) {
    private val stateBits: AtomicInteger = AtomicInteger(LibagStateFlags.COLD)

    init {
        require(maxEntries > 0) { "fastpass_invariant_halt: maxEntries <= 0" }
    }

    // Unified Go-style accessor pattern in Kotlin: overload for read vs write
    public fun stateFlags(): Int = stateBits.get()

    public fun stateFlags(nextFlags: Int): Int {
        stateBits.set(nextFlags)
        return nextFlags
    }

    public companion object {
        @JvmField
        public val FINANCIAL_MC: MathContext = MathContext(18, RoundingMode.HALF_EVEN)

        @JvmStatic
        public fun decodeMagicLe(frame: ByteArray): Int {
            require(frame.size >= 4) { "fastpass_invariant_halt: frame.size < 4" }
            return ByteBuffer.wrap(frame, 0, 4).order(ByteOrder.LITTLE_ENDIAN).int
        }
    }
}
```

---

## 4. Build & Artifact Hygiene (`var/build/kt`)

By default, `kotlinc` and Gradle KTS create `build/`, `.gradle/`, and `.kotlin/` directories in the project root. Route every compiler artifact, incremental cache, JAR, and KLIB strictly into `var/build/kt/`:

- **Direct `kotlinc` (Zero-Gradle Fast Builds):**
    ```sh
    kotlinc src-kt.dev/ -include-runtime -Werror -Xexplicit-api=strict -d var/build/kt/libag-dev.jar
    ```
- **Gradle Kotlin DSL (`build.gradle.kts`, if used):**
    ```kotlin
    // SPDX-License-Identifier: GPL-3.0-or-later
    layout.buildDirectory.set(rootDir.resolve("var/build/kt/${project.name}"))

    kotlin {
        explicitApi()
        jvmToolchain(21)
        compilerOptions {
            allWarningsAsErrors.set(true)
            progressiveMode.set(true)
        }
    }
    ```
    And run Gradle with `--project-cache-dir var/build/kt/gradle-cache` so zero caches leak into the repository root.
