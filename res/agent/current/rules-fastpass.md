# `lib-agent`: Universal Language-Agnostic & Multi-Language Master Index (`res/agent/current/rules-fastpass.md`)

#### status: canonical empire master index (language-agnostic + language jump table)
#### fast-pass (AI agent `.agent.txt`): [`res/agent/current/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### jump table doc: [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)
#### architectural roadmap: [`doc/TODO.md`](../../../doc/TODO.md)
#### license: GNU General Public License Version 3 (`GPLv3` — Free Software)

This document is the top-level **language-agnostic** master index for `lib-agent`, `underwyrt`, and sibling `lib-*` repositories. It defines the universal laws shared across every programming language in the ecosystem and links to each language's dedicated fast-pass directory under `res/src-<lang>/` and Google-inspired style suggestions under `doc/suggested/`.

---

## 1. Universal Language-Agnostic Concerns (`res/agent/current/`)

| # | Slot | Agnostic Concern | Human Spec (`.md`) | AI Fast-Pass (`.agent.txt`) | Target Reference | Core Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `LIC` | **Free Software & Licensing (`GPLv3`)** | [`01-license-freesoftware.md`](01-license-freesoftware.md) | [`01-license-freesoftware.agent.txt`](01-license-freesoftware.agent.txt) | [`LICENSE`](../../../LICENSE) | Always release all code in every language under **GNU GPLv3** (`GPL-3.0-or-later`); `3p` deps must be GPLv3-compatible Free Software. |
| `02` | `ETH` | **Forever-Code & Static Dependency Ethos** | [`02-architecture-ethos.md`](02-architecture-ethos.md) | [`02-architecture-ethos.agent.txt`](02-architecture-ethos.agent.txt) | [`doc/TODO.md`](../../../doc/TODO.md) | Zero supply-chain roulette; static `3p/` vendoring; `1p/2p/3p` import tiers; small modules; never a "big ball of mud". |
| `03` | `TOP` | **Multi-Language Channels & `var/` Outputs** | [`03-topology-var.md`](03-topology-var.md) | [`03-topology-var.agent.txt`](03-topology-var.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md) | Isolate code into `src-<lang>.{dev,main,testing}`; route all compiler/package outputs to `var/build`, `var/dist`, and `var/release`. |
| `04` | `CRT` | **Epistemic Critique & Pre-Action Gate** | [`04-epistemic-critique.md`](04-epistemic-critique.md) | [`04-epistemic-critique.agent.txt`](04-epistemic-critique.agent.txt) | [`doc/prompts/self-critical-agent.md`](../../../doc/prompts/self-critical-agent.md) | Evaluate whether an action is a good idea before executing; truth over user appeasement; falsify own drafts and surface trade-offs. |

---

## 2. Per-Language Fast-Pass Specs (`res/src-<lang>/`)

| # | Slot | Language & Channels | AI Fast-Pass (`.agent.txt`) | Human Spec (`.md`) | Suggested Deep Guide (`doc/suggested/`) | Primary Domain |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `10` | `MJS` | **MJS (`src-mjs.*`)** | [`../../src-mjs/rules-fastpass.agent.txt`](../../src-mjs/rules-fastpass.agent.txt) | [`../../src-mjs/rules-fastpass.md`](../../src-mjs/rules-fastpass.md) | [`doc/suggested/llm-guardrails.md`](../../../doc/suggested/llm-guardrails.md) | Canonical 9-concern MJS spec (`lhs= rhs`, 0 semi, 4-space, SAB workers). |
| `11` | `GO` | **Go (`src-go.*`)** | [`../../src-go/rules-fastpass.agent.txt`](../../src-go/rules-fastpass.agent.txt) | [`../../src-go/rules-fastpass.md`](../../src-go/rules-fastpass.md) | [`doc/suggested/go-style.md`](../../../doc/suggested/go-style.md) | High-efficiency CLI, networking, daemons, music governor. |
| `12` | `RS` | **Rust (`src-rs.*`)** | [`../../src-rs/rules-fastpass.agent.txt`](../../src-rs/rules-fastpass.agent.txt) | [`../../src-rs/rules-fastpass.md`](../../src-rs/rules-fastpass.md) | [`doc/suggested/rust-style.md`](../../../doc/suggested/rust-style.md) | Memory-controlled apps/runtimes, CLAP audio plugins, static `3p/` crates. |
| `13` | `CPP` | **C++ (`src-cpp.*`)** | [`../../src-cpp/rules-fastpass.agent.txt`](../../src-cpp/rules-fastpass.agent.txt) | [`../../src-cpp/rules-fastpass.md`](../../src-cpp/rules-fastpass.md) | [`doc/suggested/cpp-style.md`](../../../doc/suggested/cpp-style.md) | Cross-board systems & engines; strict orthodox C++ subset (`-fno-exceptions`). |
| `14` | `ZIG` | **Zig (`src-zig.*`)** | [`../../src-zig/rules-fastpass.agent.txt`](../../src-zig/rules-fastpass.agent.txt) | [`../../src-zig/rules-fastpass.md`](../../src-zig/rules-fastpass.md) | [`doc/suggested/zig-style.md`](../../../doc/suggested/zig-style.md) | Small C-power high-performance components & explicit allocators. |
| `15` | `JAVA` | **Java (`src-java.*`)** | [`../../src-java/rules-fastpass.agent.txt`](../../src-java/rules-fastpass.agent.txt) | [`../../src-java/rules-fastpass.md`](../../src-java/rules-fastpass.md) | [`doc/suggested/java-style.md`](../../../doc/suggested/java-style.md) | Financial precision, messaging, AI, and durable enterprise interop. |
| `16` | `PY3` | **Python 3 (`src-py3.*`)** | [`../../src-py3/rules-fastpass.agent.txt`](../../src-py3/rules-fastpass.agent.txt) | [`../../src-py3/rules-fastpass.md`](../../src-py3/rules-fastpass.md) | [`doc/suggested/py3-style.md`](../../../doc/suggested/py3-style.md) | Strictly bounded glue scripts (stdlib-first, never giant Python monoliths). |
| `17` | `CS` | **C# / .NET (`src-cs.*`)** | [`../../src-cs/rules-fastpass.agent.txt`](../../src-cs/rules-fastpass.agent.txt) | [`../../src-cs/rules-fastpass.md`](../../src-cs/rules-fastpass.md) | [`doc/suggested/cs-style.md`](../../../doc/suggested/cs-style.md) | Modern .NET 8/9+ & NativeAOT, `Span<T>`, `readonly record struct`, `decimal` math. |
| `18` | `KT` | **Kotlin (`src-kt.*`)** | [`../../src-kt/rules-fastpass.agent.txt`](../../src-kt/rules-fastpass.agent.txt) | [`../../src-kt/rules-fastpass.md`](../../src-kt/rules-fastpass.md) | [`doc/suggested/kt-style.md`](../../../doc/suggested/kt-style.md) | Kotlin 2.x K2 (JVM/Native/KMP), `@JvmInline value class`, `sealed interface`, structured coroutines. |
