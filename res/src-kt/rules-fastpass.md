# `lib-agent` (`src-kt`): Kotlin Coding Style, Rules & Fast-Pass Specification (`res/src-kt/rules-fastpass.md`)

#### status: canonical Kotlin language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-kt/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/kt-style.md`](../../doc/suggested/kt-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-kt`)

- **Primary Domain (`doc/TODO.md`):** High-clarity Kotlin 2.x (K2 JVM, Native & Multiplatform) services, financial/messaging pipelines, Android/desktop UI & tooling clients, and seamless `src-java` interoperability using zero-cost `@JvmInline value class` wrappers and structured concurrency.
- **Channels:** `src-kt/` (base / shared Gradle KTS conventions), `src-kt.dev/` (active development), `src-kt.main/` (hardened production mainline), `src-kt.testing/` (behavioral verification suites).
- **Build & Artifact Output:** Never allow `kotlinc` or Gradle to scatter `build/`, `.gradle/`, or `.kotlin/` directories inside source trees. Route all `.class` files, JARs, KLIBs, and incremental caches strictly to `var/build/kt/`, distribution artifacts to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-kt`)

1. **Free Software (`GPLv3`):**
    - Every `.kt` and `.kts` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Orthodox Systems Kotlin (Zero DSL Magic or Boxing Bloat):**
    - Restrict Kotlin to its clearest, zero-overhead subset: `data class` for immutable messages, `sealed interface` + exhaustive `when` for closed domain states, and `@JvmInline value class` for zero-allocation strong IDs and units.
    - Forbid custom implicit receiver DSLs, cute `infix` / operator overloading (outside genuine math types), deep scope-function nesting (`?.let { it.run { apply { ... } } }`), and the unsafe non-null assertion operator (`!!`).
    - On hot paths, use unboxed primitive arrays (`ByteArray`, `IntArray`, `LongArray`) rather than `Array<Byte>` or chained `.map { ... }.filter { ... }` list allocations.
    - For financial/monetary math, always use `java.math.BigDecimal` with an explicit `MathContext` / `RoundingMode` or fixed-point `Long` minor-unit micros (`Math.addExact`)—never `Float` or `Double`.
3. **Structured Concurrency & JVM Interop:**
    - Never launch fire-and-forget work on `GlobalScope`; bind all `suspend` tasks to an explicit `CoroutineScope` with bounded channels and explicit timeouts.
    - Annotate public APIs crossing into `src-java` with `@JvmStatic` / `@JvmOverloads` where appropriate, and enable `-Xexplicit-api=strict` (or explicit visibility and return types on all public declarations).
4. **Import Grouping (`1p` / `2p` / `3p`):**
    - Explicitly group `import` directives at the top of every `.kt` file under `// 1p` (`kotlin.*`, `java.*`), `// 2p` (`org.libagent.*` / internal sibling modules), and `// 3p` (statically vendored GPLv3-compatible libraries under `src-kt.dev/3p/`). Zero wildcard (`import foo.*`) imports.
5. **Formatting & Naming:**
    - 4-space indentation everywhere (`ktlint` / Google/Kotlin official 4-space style, `allWarningsAsErrors = true`).
    - Prefix primary types and files with `Libag` (`LibagLedgerCodec.kt`, `LibagChannelRouter.kt`), with explicit return types on every public function and property.
