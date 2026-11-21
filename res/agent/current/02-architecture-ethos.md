# Common Concern 02: Forever-Code, Anti-Ball-of-Mud & Static Dependency Ethos

#### status: canonical language-agnostic concern specification
#### fast-pass (AI agent `.agent.txt`): [`02-architecture-ethos.agent.txt`](02-architecture-ethos.agent.txt)
#### master index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### jump table: [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. Forever-Code & Zero Supply-Chain Roulette

- **Built to Work Forever:**
    - We write durable software engineered to compile and run decades from now without bit-rot. We do not chase ephemeral framework churn or care if a battle-tested algorithm is "old"—stability and predictability always win.
- **Anti-Dependency-Bloat (`1p` -> `2p` -> `3p`):**
    - Know what every single line of code in the repository does.
    - Never pull trivial micro-packages from `npm`, `crates.io`, `PyPI`, or Maven Central that belong in the standard library or a 30-line helper.
    - When external code is genuinely needed, vendor it as an **old-school static dependency** under `src-<lang>.dev/3p/<pkg>/`, audit it, strip unnecessary bloat, and optimize it in-tree.
    - CI and local builds must never pull unverified remote packages dynamically—eliminating supply-chain malware vectors completely.

---

## 2. Anti-Ball-of-Mud & FOSS Mainline Resilience

- **Strict Scope Boundaries:**
    - Every library (`lib-*`) and component has a tightly bounded domain. Never let a project sprawl into an unreadable "big ball of mud" (especially in C++, Python, or Java).
- **Resilient Against Vibe-Coding & Unmaintained Forks:**
    - Modern "vibe coders" and unguided LLMs frequently fork stale snapshots, bolt on unverified dependencies, and introduce subtle state corruption instead of maintaining a clean upstream mainline.
    - By keeping modules small, interfaces explicit, dependencies static/minimal, and invariants self-checking (`invariant()`), the mainline remains rock-solid—and even downstream forks inherit a verifiable foundation.

---

## 3. Universal `1p` / `2p` / `3p` Import Discipline

Across every language (`MJS`, `Go`, `Rust`, `C++`, `Zig`, `Java`, `Python 3`), imports/includes at the top of every source file are strictly grouped into three explicit tiers:
1. **`1p` (First-Party / Standard Library):** Core language & OS runtime standard library (`node:*`, Go stdlib, Rust `core::`/`std::`, C++ `<cstdint>`/STL, Zig `@import("std")`, Java `java.*`, Python stdlib).
2. **`2p` (Second-Party / Internal & Sibling `lib-*`):** Modules within this repository or sibling `lib-*` / `underwyrt` Free Software libraries.
3. **`3p` (Third-Party / Statically Vendored):** Audited, GPLv3-compatible static dependencies vendored under `src-<lang>.dev/3p/`.
