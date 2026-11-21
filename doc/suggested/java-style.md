# Suggested Java Style Guide: Financial Precision, Messaging & AI (`doc/suggested/java-style.md`)

#### status: suggested language rules (`src-java`, `src-java.dev`, `src-java.main`, `src-java.testing`)
#### fast-pass spec: [`res/src-java/rules-fastpass.md`](../../res/src-java/rules-fastpass.md) | [`res/src-java/rules-fastpass.agent.txt`](../../res/src-java/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Modern Data-Oriented Java (Not 2005 Enterprise Soup)

As noted in [`doc/TODO.md`](../TODO.md), Java powers financial systems, high-throughput messaging, AI pipelines, and legacy-to-modern interoperability.

However, unguided developers and LLMs often write Java as a maze of deep inheritance, reflection-heavy DI containers (Spring/Hibernate magic), and mutable getters/setters. Following **Google's Java Style Guide + Java 21 LTS Data-Oriented Programming**:
- **Records & Sealed Interfaces:** Model messages, ledger events, and AI payloads as immutable `record` types and `sealed interface` variants.
- **Explicit Wiring (No Classpath Scanning Magic):** Construct dependencies explicitly in code (`new LibagRouter(clock, store)`), so startup is instant, stack traces are 5 lines long, and GraalVM/static analysis works effortlessly.
- **4-Space Indentation & Zero Wildcard Imports:** Strictly 4 spaces (never `import foo.*;`).

---

## 2. Hard Rules for Financial & Messaging Systems

1. **Monetary & Financial Arithmetic Invariant:**
    - **Never use `float` or `double` for money, prices, rates, or balances.** IEEE-754 binary floating-point cannot represent `0.10` exactly.
    - Use either:
        - `long` integer minor units / micros (e.g., `1_000_000L` micros = `1.000000` currency unit) with `Math.addExact` / `Math.multiplyExact` overflow protection, OR
        - `java.math.BigDecimal` initialized from `String` or `long` (`BigDecimal.valueOf(unscaled, scale)`) with an explicit `MathContext` and `RoundingMode` (never `new BigDecimal(double)`).
2. **Immutable Wire Messages & Defensive Copies:**
    - Every `record` holding a collection or byte array must defensively copy or wrap with `List.copyOf()` in its compact constructor.
3. **Virtual Threads & Explicit Timeouts:**
    - Use Java 21+ Virtual Threads for blocking I/O and messaging consumers, paired with explicit deadlines/timeouts on every network call.
4. **Null Safety:**
    - Reject `null` immediately at public boundaries using `Objects.requireNonNull(arg, "arg")`. Never return `null` collections (return `List.of()`).

---

## 3. Canonical File Layout & `1p` / `2p` / `3p` Imports

```java
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

package org.libagent.ledger;

// 1p
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.Objects;

// 2p
// import org.libagent.internal.LibagInvariant;

// 3p
// (none - zero external dependencies in core ledger)

public final class LibagLedgerOp {
    public static final MathContext FINANCIAL_MC = new MathContext(18, RoundingMode.HALF_EVEN);

    public sealed interface LedgerEvent permits TransferCleared, TransferRejected {}

    public record TransferCleared(
        String txId,
        long amountMicros,
        BigDecimal feeRate
    ) implements LedgerEvent {
        public TransferCleared {
            Objects.requireNonNull(txId, "txId");
            Objects.requireNonNull(feeRate, "feeRate");
            if (amountMicros < 0L) {
                throw new IllegalArgumentException("fastpass_invariant_halt: amountMicros < 0");
            }
        }
    }

    public record TransferRejected(String txId, int reasonCode) implements LedgerEvent {}

    private LibagLedgerOp() {}
}
```

---

## 4. Build & Artifact Hygiene (`var/build/java`)

Route all `.class` files, test reports, and packaged JARs to `var/build/java/` (and final distributable JARs to `var/dist/`):
- **Direct `javac`:** `javac -d var/build/java/classes ...`
- **Gradle / Maven (if used):** Set `layout.buildDirectory.set(file("var/build/java"))` or `<build><directory>var/build/java</directory></build>`.
