# Anti-LLM-Mess & Underwyrt Readiness Guardrails (`doc/suggested/llm-guardrails.md`)

#### status: canonical cross-language AI guardrail specification
#### applies to: Claude, Gemini, GPT, DeepSeek, Qwen, Llama, and all local open-weights LLMs
#### fast-pass index: [`res/agent/current/rules-fastpass.agent.txt`](../../res/agent/current/rules-fastpass.agent.txt)
#### jump table: [`doc/agent-jump-table.md`](../agent-jump-table.md)

---

## 1. Why Local & Frontier LLMs Make a Mess of Systems Projects

When moving from single-file scripts to multi-language systems architectures (`lib-agent`, `underwyrt`, native audio/IPC bridges), frontier models (GPT, DeepSeek) and especially smaller local models (7B–32B quantizations) exhibit five destructive failure modes:

1. **Dependency Reflex:** Adding an external package (`Cargo.toml`, `package.json`, `requirements.txt`, `go.mod`) instead of writing 25 lines of deterministic first/second-party code.
2. **Borrow-Checker / Lifetime Capitulation:** Wrapping everything in `Arc<Mutex<T>>`, `std::shared_ptr<T>`, or `.clone()` to silence compiler errors—destroying cache locality and real-time audio/network determinism.
3. **Architecture Hallucination:** Inventing deep OOP class hierarchies, traits with a single implementation, or "Enterprise Factory" wrappers when a flat struct and three `snake_case` functions (`<topic>_<action>`) solve the problem completely.
4. **Silent Collateral Damage:** Deleting intentional empty stub files in `src-<lang>.dev/`, reformatting untouched lines, or dropping `SPDX-License-Identifier: GPL-3.0-or-later` headers.
5. **Artifact Splatter:** Running default `cargo build`, `cmake .`, or `zig build` commands that dump gigabytes of build artifacts into the repository root instead of `var/build/<lang>/`.

---

## 2. Hard Rules for Every AI Agent & Local LLM

### Rule 1: Never Add a Dependency Without Explicit Human Approval
- Assume the network is **permanently disconnected (`--offline`)**.
- You may only import from `// 1p` (language standard library), `// 2p` (existing repository modules), or `// 3p` (files *already* statically vendored inside `src-<lang>.dev/3p/`).
- If you believe an external library is needed, **stop and ask**—never edit `Cargo.toml`, `package.json`, `go.mod`, or `pyproject.toml` autonomously.

### Rule 2: Mirror the `libag_` Dual Surface & Topic-Prefixed Naming Across Languages
- Keep functions flat, stateless where possible, and prefixed with their domain coordinate (`<topic>_<action_snake_case>`):
    - **MJS / C++ / Zig / Python 3 / Rust:** `volume_imprint()`, `ipc_ring_push()`, `governor_budget_check()`
    - **Go / Java:** Keep package/class methods directly mapped to the same topic coordinates (`GovernorBudgetCheck`, `IpcRingPush`).
- Pass explicit context or arena/allocator handles as the first argument (`ctx`, `allocator`) rather than mutating hidden globals.

### Rule 3: Respect the Three-Header Contract on Every File
Every source file you create or edit in any language must start with:
1. The **GNU GPLv3 SPDX header** (`SPDX-License-Identifier: GPL-3.0-or-later`).
2. Explicit **`1p` / `2p` / `3p` import comment markers** in exact order.
3. Zero unused or wildcard imports.

### Rule 4: Enforce Strict File & Complexity Budgets (Prompt-Window Sympathy)
Local LLMs degrade rapidly when a single source file exceeds ~400–500 lines (lost-in-the-middle attention decay).
- **Hard Cap:** Keep individual source files under **400 lines** and individual functions under **60 lines**.
- **One Responsibility per File:** Split data definitions/constants (`_op` / `_types`), client dispatch (`Client`), and worker/runtime execution (`Runtime`) into separate files.

### Rule 5: Route Every Build, Cache, and Test Output to `var/`
Never run a bare build tool that writes to the working directory. Always pass the `var/build/<lang>` target explicitly:
- **Rust:** `CARGO_TARGET_DIR=var/build/rs cargo check --offline`
- **C++:** `cmake -B var/build/cpp && cmake --build var/build/cpp`
- **Go:** `go build -o var/build/go/ ./...`
- **Zig:** `zig build --cache-dir var/build/zig/cache --prefix var/build/zig/out`
- **Java:** `javac -d var/build/java/classes ...`
- **Python 3:** `PYTHONPYCACHEPREFIX=var/build/py3/pycache python3 ...`
- **C# / .NET:** `dotnet build --artifacts-path var/build/cs` (or via root `Directory.Build.props`)
