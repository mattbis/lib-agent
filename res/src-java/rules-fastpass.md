# `lib-agent` (`src-java`): Java Coding Style, Rules & Fast-Pass Specification (`res/src-java/rules-fastpass.md`)

#### status: canonical Java language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-java/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/java-style.md`](../../doc/suggested/java-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-java`)

- **Primary Domain (`doc/TODO.md`):** Financial engines, high-reliability messaging buses, AI integrations, and durable enterprise/legacy-to-new interoperability.
- **Channels:** `src-java/` (base), `src-java.dev/` (active development), `src-java.main/` (hardened production mainline), `src-java.testing/` (behavioral verification suites).
- **Build & Artifact Output:** All compiled `.class` files, JARs, and build caches route strictly to `var/build/java/`, distribution packages to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-java`)

1. **Free Software (`GPLv3`):**
    - Every `.java` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Modern Data-Oriented Java (Java 21 LTS+):**
    - Avoid 2005-era "Enterprise AbstractSingletonProxyFactoryBean" bloat.
    - Use `record` types for immutable financial events and wire messages, `sealed interface` hierarchies for closed domain states, and Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`) for high-throughput I/O.
3. **Financial & Messaging Precision:**
    - **Never use `float` or `double` for currency or financial calculations.** Always use `BigDecimal` with an explicit `MathContext` / `RoundingMode` or fixed-point `long` minor-unit (micros/cents) representations.
4. **Import Grouping (`1p` / `2p` / `3p`):**
    - Group imports at the top of every file under `// 1p` (`java.*`, `javax.*`), `// 2p` (internal `libag` packages), and `// 3p` (statically vendored JARs/sources under `src-java.dev/3p/`). No wildcard (`import foo.*;`) imports.
5. **Formatting & Naming:**
    - 4-space indentation everywhere (`UseTab: Never`).
    - Prefix primary classes with `Libag` (e.g., `LibagLedgerNode.java`, `LibagMessageCodec.java`) or keep inside `org.libagent.*` package with explicit static functional helpers.
