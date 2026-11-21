# `lib-agent`: Coding Style, Rules & Architectural Index (`rules-fastpass.md`)

#### status: canonical index & jump table (split by concern)
#### fast-pass (AI agent `.agent.txt`): [`res/agent/current/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### jump table doc: [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)
#### origin spec: [`res/auto/antigravity/search.md`](../../auto/antigravity/search.md)
#### license: GNU General Public License Version 3 (`GPLv3` — Free Software)

This document is the master human-readable index and jump table for `lib-agent` (namespace prefix `libag_`), paired with [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt). All rules are modularized by concern inside `res/agent/current/` as paired `.md` (human) and `.agent.txt` (compressed AI fast-pass DSL) specifications.

---

## 1. Meta & Project Identity

| Key | Value |
| :--- | :--- |
| **Project** | `lib-agent` |
| **Namespace Prefix** | `libag_` |
| **License & Ethos** | **GNU GPLv3 (`GPL-3.0-or-later`)** — Always released as Free Software ([`LICENSE`](../../../LICENSE)) |
| **AI Fast-Pass Index** | [`res/agent/current/rules-fastpass.agent.txt`](rules-fastpass.agent.txt) |
| **Human Companion Index** | [`res/agent/current/rules-fastpass.md`](rules-fastpass.md) |
| **Canonical Jump Table** | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md) |
| **Origin Search Spec** | [`res/auto/antigravity/search.md`](../../auto/antigravity/search.md) |

---

## 2. Concern Jump Table (`res/agent/current/`)

| # | Slot | Concern | Human Spec (`.md`) | AI Fast-Pass (`.agent.txt`) | Target `doc/` Reference | Core Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `01` | `LIC` | **Free Software & Licensing** | [`01-license-freesoftware.md`](01-license-freesoftware.md) | [`01-license-freesoftware.agent.txt`](01-license-freesoftware.agent.txt) | [`LICENSE`](../../../LICENSE) | Always release all code under **GNU GPLv3** (`GPL-3.0-or-later`); `3p` code must be GPLv3-compatible Free Software. |
| `02` | `SYN` | **Core Syntax & Formatting** | [`02-syntax-style.md`](02-syntax-style.md) | [`02-syntax-style.agent.txt`](02-syntax-style.agent.txt) | `doc/CODE_STYLE.md` | Asymmetric `= ` (`var x= val`), no semicolons, strict 4-space indent, aligned multiline ternaries, relative links. |
| `03` | `API` | **Naming & API Surface** | [`03-naming-api.md`](03-naming-api.md) | [`03-naming-api.agent.txt`](03-naming-api.agent.txt) | `doc/CODE_STYLE.md` | `libag_` file prefix, `snake_case` topic-prefixed fns, Go-style `foo(val)` accessors, Dual Surface API (Fn + Class). |
| `04` | `DEP` | **Dependency Discipline** | [`04-dependencies.md`](04-dependencies.md) | [`04-dependencies.agent.txt`](04-dependencies.agent.txt) | `doc/LIB_STRUCTURE.md` | Explicit `// 1p`, `// 2p`, `// 3p` header tiers; zero prod `node_modules`; static GPLv3-compatible `3p` vendoring. |
| `05` | `TOP` | **Repository & Channels** | [`05-topology.md`](05-topology.md) | [`05-topology.agent.txt`](05-topology.agent.txt) | `doc/LIB_STRUCTURE.md` | Split by language & stability (`src-mjs.dev`, `.main`, `.testing`, `src-zig.*`); preserve empty `.dev` stubs. |
| `06` | `EXE` | **Execution & Runtime** | [`06-execution-runtime.md`](06-execution-runtime.md) | [`06-execution-runtime.agent.txt`](06-execution-runtime.agent.txt) | `doc/mjs_bitwise_quirks.md` | `invariant()` vs `run_operation()`, zero-GC `SharedArrayBuffer` strides, 3-file Worker split, two-tier logging. |
| `07` | `SEC` | **Resident Security** | [`07-security.md`](07-security.md) | [`07-security.agent.txt`](07-security.agent.txt) | `doc/security.md` | `Object.create(null)` / `Map`, `Object.freeze()` constants, `Object.hasOwn` / `arg_get_opt`, `timingSafeEqual` gating. |
| `08` | `TST` | **Behavioral Testing** | [`08-testing.md`](08-testing.md) | [`08-testing.agent.txt`](08-testing.agent.txt) | `doc/TESTING.md` | Zero expected runtime throws; native `node --test` behavioral & `0xAA` canary verification. |
| `09` | `TPL` | **Reference Templates** | [`09-templates.md`](09-templates.md) | [`09-templates.agent.txt`](09-templates.agent.txt) | `doc/template/libag_module_template.mjs` | Copy-ready GPLv3 canonical `.mjs` module template and custom ESLint rule (`no-space-before-assignment`). |

---

## 3. Fast-Pass Executive Summary

1. **Free Software (`01`):** All code is always released under **GNU GPLv3** (`SPDX-License-Identifier: GPL-3.0-or-later`). Non-free or GPLv3-incompatible dependencies are forbidden.
2. **Syntax (`02`):** `var x= val` (no space before `=`, one space after `=`), never use semicolons, strictly 4-space indentation, relative Markdown links only.
3. **Naming (`03`):** Prefix files with `libag_`, functions with `<topic>_<action_snake_case>`, never use `camelCase` for library functions, use Go-style `foo(val)` unified accessors, and expose stateless primitives + thin class wrappers.
4. **Dependencies (`04`):** Group imports under `// 1p`, `// 2p`, `// 3p`. Zero external npm packages in resident core.
5. **Topology (`05`):** Separate channels (`src-mjs.dev/`, `src-mjs.main/`, `src-mjs.testing/`, `src-zig.*`). Keep intentional empty stub files in `.dev`.
6. **Execution (`06`):** Halting `invariant()` for non-op code; `run_operation(ctx, steps)` with `micro_pause.yield` for ops; flat `SharedArrayBuffer` / `Atomics` layouts; isolate-split Workers (`op`, `Client`, `Runtime`); `imut_log` + CLI log.
7. **Security (`07`):** `Object.create(null)` dictionaries, `Object.freeze({...})` tables, `arg_get_opt()` option extraction, `timingSafeEqual` gate checks.
8. **Testing (`08`):** Zero expected runtime errors; test real workflows and memory strides via `node --test`.
9. **Templates (`09`):** Follow [`09-templates.md`](09-templates.md) for new modules and ESLint enforcement.
