# Suggested Multi-Language Engineering Rules (`doc/suggested/`)

#### status: Google-inspired & Underwyrt-ready engineering guidelines
#### master jump table: [`doc/agent-jump-table.md`](../agent-jump-table.md)
#### architectural roadmap: [`doc/TODO.md`](../TODO.md)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## Why These Rules Exist

Most modern languages (`Go`, `Rust`, `Zig`) already ship deterministic auto-formatters (`gofmt`, `rustfmt`, `zig fmt`). **Formatting is not what ruins projects.**

Projects turn into a "Big Ball of Mud"—especially when assisted by GPT, DeepSeek, or smaller local open-weights LLMs, or when preparing for deeply complex systems work like **`underwyrt`**—because of **semantic drift**:
1. **Supply-Chain Bloat:** Pulling 150 transitive packages from `crates.io`, `npm`, `PyPI`, or Maven for a 30-line problem.
2. **Feature-Subset Insanity:** Using 12 different dialects of C++ or Rust in the same directory.
3. **Hidden Allocations & Locks:** Destroying deterministic latency in audio (CLAP), networking (music governor), or IPC runtimes.
4. **Build Artifact Splatter:** Polluting the repo root with `target/`, `build/`, `zig-cache/`, and `__pycache__/` instead of routing everything to `var/build/`, `var/dist/`, and `var/release/`.

Inspired by **Google's internal language style guides** (which succeed by *restricting* language subsets, banning footguns, enforcing explicit ownership, and prioritizing 20-year maintainability over cleverness), these guides define the suggested semantic rules for each language in the empire.

---

## Suggested Guides Index

| Guide | Language / Scope | Channels |Fast-Pass Spec (`res/`) | Key Focus |
| :--- | :--- | :--- | :--- | :--- |
| [`llm-guardrails.md`](llm-guardrails.md) | **All Languages (AI Guardrails)** | `src-*.*` | [`rules-fastpass.agent.txt`](../../res/agent/current/rules-fastpass.agent.txt) | Preventing GPT, DeepSeek & local LLMs from hallucinating deps, deleting `.dev` stubs, or drifting architecture. |
| [`cpp-style.md`](cpp-style.md) | **C++ (`src-cpp`)** | `src-cpp.{dev,main,testing}` | [`res/src-cpp/`](../../res/src-cpp/rules-fastpass.md) | Google C++-inspired Orthodox C++20 subset: `-fno-exceptions`, `-fno-rtti`, arena ownership, `var/build/cpp`. |
| [`rust-style.md`](rust-style.md) | **Rust (`src-rs`)** | `src-rs.{dev,main,testing}` | [`res/src-rs/`](../../res/src-rs/rules-fastpass.md) | Memory-controlled runtimes & CLAP audio plugins: offline vendored `3p/`, zero-alloc audio threads, no `.unwrap()`. |
| [`go-style.md`](go-style.md) | **Go (`src-go`)** | `src-go.{dev,main,testing}` | [`res/src-go/`](../../res/src-go/rules-fastpass.md) | Google Go-inspired CLI, networking & music governor: explicit goroutine lifetimes, `context.Context`, stdlib-first. |
| [`zig-style.md`](zig-style.md) | **Zig (`src-zig`)** | `src-zig.{dev,main,testing}` | [`res/src-zig/`](../../res/src-zig/rules-fastpass.md) | C-power high-speed components: explicit `std.mem.Allocator`, caller slices, explicit error sets, `var/build/zig`. |
| [`java-style.md`](java-style.md) | **Java (`src-java`)** | `src-java.{dev,main,testing}` | [`res/src-java/`](../../res/src-java/rules-fastpass.md) | Google Java-inspired financial, messaging & AI: `BigDecimal`/fixed-point money, Java 21 `record` & `sealed`, zero reflection. |
| [`py3-style.md`](py3-style.md) | **Python 3 (`src-py3`)** | `src-py3.{dev,main,testing}` | [`res/src-py3/`](../../res/src-py3/rules-fastpass.md) | Google Python-inspired bounded glue: <400-line flat modules, stdlib-first, mandatory typing, never a giant monolith. |
