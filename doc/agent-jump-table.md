# `lib-agent`: Agent & Human Concern Jump Table (`doc/agent-jump-table.md`)

#### status: canonical jump table
#### ai fast-pass index: [`res/agent/current/rules-fastpass.agent.txt`](../res/agent/current/rules-fastpass.agent.txt)
#### human index: [`res/agent/current/rules-fastpass.md`](../res/agent/current/rules-fastpass.md)
#### origin spec: [`res/auto/antigravity/search.md`](../res/auto/antigravity/search.md)
#### license: GNU General Public License Version 3 (`GPLv3` — Free Software)

---

## 1. Split Concerns Jump Table (`res/agent/current/`)

| # | Slot | Concern | AI Fast-Pass (`.agent.txt`) | Human Spec (`.md`) | Target `doc/` Reference | Core Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `LIC` | **Free Software & Licensing (`GPLv3`)** | [`01-license-freesoftware.agent.txt`](../res/agent/current/01-license-freesoftware.agent.txt) | [`01-license-freesoftware.md`](../res/agent/current/01-license-freesoftware.md) | [`LICENSE`](../LICENSE) | Always release all code under **GNU GPLv3** (`GPL-3.0-or-later`); `3p` code must be GPLv3-compatible Free Software. |
| `02` | `SYN` | **Core Syntax & Formatting** | [`02-syntax-style.agent.txt`](../res/agent/current/02-syntax-style.agent.txt) | [`02-syntax-style.md`](../res/agent/current/02-syntax-style.md) | `doc/CODE_STYLE.md` | Asymmetric `= ` (`var x= val`), no semicolons, strict 4-space indent, aligned multiline ternaries, relative links. |
| `03` | `API` | **Naming & API Surface** | [`03-naming-api.agent.txt`](../res/agent/current/03-naming-api.agent.txt) | [`03-naming-api.md`](../res/agent/current/03-naming-api.md) | `doc/CODE_STYLE.md` | `libag_` file prefix, `snake_case` topic-prefixed fns, Go-style `foo(val)` accessors, Dual Surface API (Fn + Class). |
| `04` | `DEP` | **Dependency Discipline (`1p`/`2p`/`3p`)** | [`04-dependencies.agent.txt`](../res/agent/current/04-dependencies.agent.txt) | [`04-dependencies.md`](../res/agent/current/04-dependencies.md) | `doc/LIB_STRUCTURE.md` | Explicit `// 1p`, `// 2p`, `// 3p` header tiers; zero prod `node_modules`; static GPLv3-compatible `3p` vendoring. |
| `05` | `TOP` | **Repository & Channel Structure** | [`05-topology.agent.txt`](../res/agent/current/05-topology.agent.txt) | [`05-topology.md`](../res/agent/current/05-topology.md) | `doc/LIB_STRUCTURE.md` | Split by language & stability (`src-mjs.dev`, `.main`, `.testing`, `src-zig.*`); preserve empty `.dev` stubs. |
| `06` | `EXE` | **Execution Architecture & Runtime** | [`06-execution-runtime.agent.txt`](../res/agent/current/06-execution-runtime.agent.txt) | [`06-execution-runtime.md`](../res/agent/current/06-execution-runtime.md) | `doc/mjs_bitwise_quirks.md` | `invariant()` vs `run_operation()`, zero-GC `SharedArrayBuffer` strides, 3-file Worker split, two-tier logging. |
| `07` | `SEC` | **Resident Process Security & Hardening** | [`07-security.agent.txt`](../res/agent/current/07-security.agent.txt) | [`07-security.md`](../res/agent/current/07-security.md) | `doc/security.md` | `Object.create(null)` / `Map`, `Object.freeze()` constants, `Object.hasOwn` / `arg_get_opt`, `timingSafeEqual` gating. |
| `08` | `TST` | **Behavioral & Invariant Testing** | [`08-testing.agent.txt`](../res/agent/current/08-testing.agent.txt) | [`08-testing.md`](../res/agent/current/08-testing.md) | `doc/TESTING.md` | Zero expected runtime throws; native `node --test` behavioral & `0xAA` canary verification. |
| `09` | `TPL` | **Reference Templates & ESLint Rules** | [`09-templates.agent.txt`](../res/agent/current/09-templates.agent.txt) | [`09-templates.md`](../res/agent/current/09-templates.md) | `doc/template/libag_module_template.mjs` | Copy-ready GPLv3 canonical `.mjs` module template and custom ESLint rule (`no-space-before-assignment`). |

---

## 2. Master Entry Points

| Role | Path |
| :--- | :--- |
| **AI Fast-Pass Master Index (`.agent.txt`)** | [`res/agent/current/rules-fastpass.agent.txt`](../res/agent/current/rules-fastpass.agent.txt) |
| **Human Companion Master Index (`.md`)** | [`res/agent/current/rules-fastpass.md`](../res/agent/current/rules-fastpass.md) |
| **Origin Full Specification (`.md`)** | [`res/auto/antigravity/search.md`](../res/auto/antigravity/search.md) |
| **Root License (`GPLv3`)** | [`LICENSE`](../LICENSE) |
