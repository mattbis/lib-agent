# `lib-agent` (`src-rs`): Rust Coding Style, Rules & Fast-Pass Specification (`res/src-rs/rules-fastpass.md`)

#### status: canonical Rust language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-rs/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/rust-style.md`](../../doc/suggested/rust-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-rs`)

- **Primary Domain (`doc/TODO.md`):** Highly memory-controlled applications, deterministic runtimes, and real-time audio plugins (e.g., CLAP plugins rather than bloated VST3 SDK trees).
- **Channels:** `src-rs/` (base/workspace), `src-rs.dev/` (active development), `src-rs.main/` (hardened production mainline), `src-rs.testing/` (behavioral & property verification).
- **Build & Artifact Output:** Never allow Cargo to create a root `target/` directory. Always route builds via `CARGO_TARGET_DIR=var/build/rs` (or `.cargo/config.toml` `target-dir = "var/build/rs"`), distributions to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-rs`)

1. **Free Software (`GPLv3`):**
    - Every `.rs` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later`, and `Cargo.toml` sets `license = "GPL-3.0-or-later"` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Supply-Chain Lockdown (Anti-Crates.io-Sprawl):**
    - Rust's ecosystem suffers from npm-style transitive crate explosion. We enforce **strict static dependency minimalism**:
    - Default to `core` / `std`. Do not pull macro-heavy or deep dependency trees (`syn`/`quote` bloat) unless strictly necessary.
    - All permitted third-party crates must be statically vendored under `src-rs.dev/3p/` (`cargo vendor`) and audited for GPLv3 compatibility; builds run with `--offline` / `--frozen`.
3. **Import Grouping (`1p` / `2p` / `3p`):**
    - Group `use` declarations at the top of every module under `// 1p` (`core::`, `alloc::`, `std::`), `// 2p` (`crate::`, sibling `libag_*` crates), and `// 3p` (statically vendored crates).
4. **Memory, Realtime & Safety Discipline:**
    - Format via `rustfmt` (`indent_style = "Block"`, `tab_spaces = 4`).
    - Prefix module files with `libag_` where standalone or namespace cleanly inside the crate.
    - **Zero `.unwrap()` / `.expect()` in production runtime or audio threads:** Return explicit `Result<T, LibagError>` or check invariants cleanly.
    - **Realtime / Audio Paths (CLAP):** Zero heap allocation (`Box`, `Vec::push`, `String`), zero locks (`Mutex::lock`), and zero syscalls inside `process()` callbacks—use pre-allocated fixed buffers and lock-free atomic ring buffers.
    - Every `unsafe` block must be minimal, encapsulated in a safe primitive function, and preceded by a `// SAFETY:` invariant proof comment.
