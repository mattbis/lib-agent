# `lib-agent`: Universal Agent & Human Jump Table (`doc/agent-jump-table.md`)

#### status: canonical multi-language jump table
#### universal ai fast-pass index: [`res/agent/current/rules-fastpass.agent.txt`](../res/agent/current/rules-fastpass.agent.txt)
#### universal human index: [`res/agent/current/rules-fastpass.md`](../res/agent/current/rules-fastpass.md)
#### architectural roadmap: [`doc/TODO.md`](TODO.md)
#### suggested language guides: [`doc/suggested/README.md`](suggested/README.md)
#### behavioral prompts: [`doc/prompts/README.md`](prompts/README.md)
#### license: GNU General Public License Version 3 (`GPLv3` — Free Software)

---

## 1. Universal Language-Agnostic Concerns (`res/agent/current/`)

| # | Slot | Agnostic Concern | AI Fast-Pass (`.agent.txt`) | Human Spec (`.md`) | Target Reference | Core Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `LIC` | **Free Software & Licensing (`GPLv3`)** | [`01-license-freesoftware.agent.txt`](../res/agent/current/01-license-freesoftware.agent.txt) | [`01-license-freesoftware.md`](../res/agent/current/01-license-freesoftware.md) | [`LICENSE`](../LICENSE) | Always release all code across every language under **GNU GPLv3** (`GPL-3.0-or-later`); `3p` code must be GPLv3-compatible Free Software. |
| `02` | `ETH` | **Forever-Code & Static Dependency Ethos** | [`02-architecture-ethos.agent.txt`](../res/agent/current/02-architecture-ethos.agent.txt) | [`02-architecture-ethos.md`](../res/agent/current/02-architecture-ethos.md) | [`doc/TODO.md`](TODO.md) | Zero supply-chain roulette; static `3p/` vendoring; `1p/2p/3p` import tiers; tight scope; never a "big ball of mud". |
| `03` | `TOP` | **Multi-Language Channels & `var/` Outputs** | [`03-topology-var.agent.txt`](../res/agent/current/03-topology-var.agent.txt) | [`03-topology-var.md`](../res/agent/current/03-topology-var.md) | [`doc/TODO.md`](TODO.md) | Isolate code into `src-<lang>.{dev,main,testing}`; route all outputs to `var/build`, `var/dist`, and `var/release`. |
| `04` | `CRT` | **Epistemic Critique & Pre-Action Gate** | [`04-epistemic-critique.agent.txt`](../res/agent/current/04-epistemic-critique.agent.txt) | [`04-epistemic-critique.md`](../res/agent/current/04-epistemic-critique.md) | [`doc/prompts/self-critical-agent.md`](prompts/self-critical-agent.md) | Evaluate whether a request is a good idea before acting; reject sycophancy; falsify own draft & expose sharp trade-offs. |

---

## 2. Multi-Language Fast-Pass & Suggested Style Matrix (`res/src-<lang>/` & `doc/suggested/`)

| # | Slot | Language & Channels | AI Fast-Pass (`.agent.txt`) | Human Spec (`.md`) | Google-Inspired & Anti-LLM Guide | Universal License Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `10` | `MJS` | **MJS (`src-mjs`, `.dev`, `.main`, `.testing`)** | [`res/src-mjs/rules-fastpass.agent.txt`](../res/src-mjs/rules-fastpass.agent.txt) | [`res/src-mjs/rules-fastpass.md`](../res/src-mjs/rules-fastpass.md) | [`doc/suggested/llm-guardrails.md`](suggested/llm-guardrails.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `11` | `GO` | **Go (`src-go`, `.dev`, `.main`, `.testing`)** | [`res/src-go/rules-fastpass.agent.txt`](../res/src-go/rules-fastpass.agent.txt) | [`res/src-go/rules-fastpass.md`](../res/src-go/rules-fastpass.md) | [`doc/suggested/go-style.md`](suggested/go-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `12` | `RS` | **Rust (`src-rs`, `.dev`, `.main`, `.testing`)** | [`res/src-rs/rules-fastpass.agent.txt`](../res/src-rs/rules-fastpass.agent.txt) | [`res/src-rs/rules-fastpass.md`](../res/src-rs/rules-fastpass.md) | [`doc/suggested/rust-style.md`](suggested/rust-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `13` | `CPP` | **C++ (`src-cpp`, `.dev`, `.main`, `.testing`)** | [`res/src-cpp/rules-fastpass.agent.txt`](../res/src-cpp/rules-fastpass.agent.txt) | [`res/src-cpp/rules-fastpass.md`](../res/src-cpp/rules-fastpass.md) | [`doc/suggested/cpp-style.md`](suggested/cpp-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `14` | `ZIG` | **Zig (`src-zig`, `.dev`, `.main`, `.testing`)** | [`res/src-zig/rules-fastpass.agent.txt`](../res/src-zig/rules-fastpass.agent.txt) | [`res/src-zig/rules-fastpass.md`](../res/src-zig/rules-fastpass.md) | [`doc/suggested/zig-style.md`](suggested/zig-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `15` | `JAVA` | **Java (`src-java`, `.dev`, `.main`, `.testing`)** | [`res/src-java/rules-fastpass.agent.txt`](../res/src-java/rules-fastpass.agent.txt) | [`res/src-java/rules-fastpass.md`](../res/src-java/rules-fastpass.md) | [`doc/suggested/java-style.md`](suggested/java-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `16` | `PY3` | **Python 3 (`src-py3`, `.dev`, `.main`, `.testing`)** | [`res/src-py3/rules-fastpass.agent.txt`](../res/src-py3/rules-fastpass.agent.txt) | [`res/src-py3/rules-fastpass.md`](../res/src-py3/rules-fastpass.md) | [`doc/suggested/py3-style.md`](suggested/py3-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `17` | `CS` | **C# / .NET (`src-cs`, `.dev`, `.main`, `.testing`)** | [`res/src-cs/rules-fastpass.agent.txt`](../res/src-cs/rules-fastpass.agent.txt) | [`res/src-cs/rules-fastpass.md`](../res/src-cs/rules-fastpass.md) | [`doc/suggested/cs-style.md`](suggested/cs-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |
| `18` | `KT` | **Kotlin (`src-kt`, `.dev`, `.main`, `.testing`)** | [`res/src-kt/rules-fastpass.agent.txt`](../res/src-kt/rules-fastpass.agent.txt) | [`res/src-kt/rules-fastpass.md`](../res/src-kt/rules-fastpass.md) | [`doc/suggested/kt-style.md`](suggested/kt-style.md) | [`01-license-freesoftware`](../res/agent/current/01-license-freesoftware.md) |

---

## 3. Detailed `src-mjs` Concern Jump Table (`res/src-mjs/`)

| # | Slot | MJS Concern | AI Fast-Pass (`.agent.txt`) | Human Spec (`.md`) | Target `doc/` Reference | Core Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `LIC` | **Free Software & Licensing (`GPLv3`)** | [`01-license-freesoftware.agent.txt`](../res/src-mjs/01-license-freesoftware.agent.txt) | [`01-license-freesoftware.md`](../res/src-mjs/01-license-freesoftware.md) | [`LICENSE`](../LICENSE) | Always release all code under **GNU GPLv3** (`GPL-3.0-or-later`); `3p` code must be GPLv3-compatible Free Software. |
| `02` | `SYN` | **Core Syntax & Formatting** | [`02-syntax-style.agent.txt`](../res/src-mjs/02-syntax-style.agent.txt) | [`02-syntax-style.md`](../res/src-mjs/02-syntax-style.md) | `doc/CODE_STYLE.md` | Asymmetric `= ` (`var x= val`), no semicolons, strict 4-space indent, aligned multiline ternaries, relative links. |
| `03` | `API` | **Naming & API Surface** | [`03-naming-api.agent.txt`](../res/src-mjs/03-naming-api.agent.txt) | [`03-naming-api.md`](../res/src-mjs/03-naming-api.md) | `doc/CODE_STYLE.md` | `libag_` file prefix, `snake_case` topic-prefixed fns, Go-style `foo(val)` accessors, Dual Surface API (Fn + Class). |
| `04` | `DEP` | **Dependency Discipline (`1p`/`2p`/`3p`)** | [`04-dependencies.agent.txt`](../res/src-mjs/04-dependencies.agent.txt) | [`04-dependencies.md`](../res/src-mjs/04-dependencies.md) | `doc/LIB_STRUCTURE.md` | Explicit `// 1p`, `// 2p`, `// 3p` header tiers; zero prod `node_modules`; static GPLv3-compatible `3p` vendoring. |
| `05` | `TOP` | **Repository & Channel Structure** | [`05-topology.agent.txt`](../res/src-mjs/05-topology.agent.txt) | [`05-topology.md`](../res/src-mjs/05-topology.md) | `doc/LIB_STRUCTURE.md` | Split by language & stability (`src-mjs.dev`, `.main`, `.testing`); outputs in `var/{build,dist,release}`. |
| `06` | `EXE` | **Execution Architecture & Runtime** | [`06-execution-runtime.agent.txt`](../res/src-mjs/06-execution-runtime.agent.txt) | [`06-execution-runtime.md`](../res/src-mjs/06-execution-runtime.md) | `doc/mjs_bitwise_quirks.md` | `invariant()` vs `run_operation()`, zero-GC `SharedArrayBuffer` strides, 3-file Worker split, two-tier logging. |
| `07` | `SEC` | **Resident Process Security & Hardening** | [`07-security.agent.txt`](../res/src-mjs/07-security.agent.txt) | [`07-security.md`](../res/src-mjs/07-security.md) | `doc/security.md` | `Object.create(null)` / `Map`, `Object.freeze()` constants, `Object.hasOwn` / `arg_get_opt`, `timingSafeEqual` gating. |
| `08` | `TST` | **Behavioral & Invariant Testing** | [`08-testing.agent.txt`](../res/src-mjs/08-testing.agent.txt) | [`08-testing.md`](../res/src-mjs/08-testing.md) | `doc/TESTING.md` | Zero expected runtime throws; native `node --test` behavioral & `0xAA` canary verification. |
| `09` | `TPL` | **Reference Templates & ESLint Rules** | [`09-templates.agent.txt`](../res/src-mjs/09-templates.agent.txt) | [`09-templates.md`](../res/src-mjs/09-templates.md) | `doc/template/libag_module_template.mjs` | Copy-ready GPLv3 canonical `.mjs` module template and custom ESLint rule (`no-space-before-assignment`). |
