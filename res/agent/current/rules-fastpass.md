# `lib-agent`: Coding Style, Rules & Architectural Reference (`rules-fastpass.md`)

#### status: canonical reference & human-readable companion
#### fast-pass (AI agent `.txt`): [`res/agent/current/rules-fastpass.txt`](rules-fastpass.txt)
#### origin spec: [`res/auto/antigravity/search.md`](../../auto/antigravity/search.md)

This document is the human-readable Markdown equivalent of [`rules-fastpass.txt`](rules-fastpass.txt), capturing the complete coding style, repository organization, naming conventions, security hardening, and execution architecture for `lib-*` GitHub libraries (specifically tailored for `lib-agent` / namespace prefix `libag_`).

---

## Meta & Documentation Map

| Key | Value |
| :--- | :--- |
| **Project** | `lib-agent` |
| **Namespace Prefix** | `libag_` |
| **AI Fast-Pass Spec** | [`res/agent/current/rules-fastpass.txt`](rules-fastpass.txt) |
| **Human Companion Spec** | [`res/agent/current/rules-fastpass.md`](rules-fastpass.md) |
| **Origin Search Spec** | [`res/auto/antigravity/search.md`](../../auto/antigravity/search.md) |
| **Core Style Doc** | `doc/CODE_STYLE.md` |
| **Repository Structure Doc** | `doc/LIB_STRUCTURE.md` |
| **Security & Lockdown Doc** | `doc/security.md` |
| **Testing Philosophy Doc** | `doc/TESTING.md` |
| **Bitwise Safety Doc** | `doc/mjs_bitwise_quirks.md` |
| **Canonical Module Template** | `doc/template/libag_module_template.mjs` |

---

## 1. Core Syntax & Formatting (`doc/CODE_STYLE.md`)

- **Asymmetric Assignment Spacing (`var x= val`):**
  - Make the left-hand target of a declaration or assignment visually distinct by placing **no space before `=`** and **one space after `=`**:
    ```javascript
    var x= true
    let count= 0
    function foo(a= 1, b= null) {
        var next_state= a + 1
        return next_state
    }
    ```
- **No Semicolons:**
  - Omit semicolons everywhere (`semi: ["error", "never"]`).
- **4-Space Indentation:**
  - Strictly `4 spaces` across all `.mjs`, `.zig`, `.md`, and config files (`indent: ["error", 4]`). Never use 2 spaces or tabs.
- **Intelligent `var` vs. `const` / `let` Usage:**
  - Prefer `var` in low-level hot paths where JS engine hoisting/function-scoping avoids unnecessary block-binding overhead in pure `.mjs`.
  - Use `const` and `let` where execution semantics or immutability boundaries require explicit lexical scoping.
- **Ternary Formatting:**
  - Prefer formatted multiline or chained ternaries over verbose `if / else` blocks when the expression is non-trivial. Align `?` and `:` at a 4-space indent:
    ```javascript
    var x= (cond)
        ? .5+(Math.cos(x*pi)*.5)*.5
        : 1-(Math.cos(x*pi)*.2)*Math.sin(x*pi)*(x*.22)+.22
    ```
- **Column Alignment in Configs & Tables:**
  - When authoring `.conf` files or tabular definitions (e.g., `# item, param1, param2`), align fields into clean vertical columns.
- **Relative Markdown Links:**
  - Every Markdown link across `README.md`, `GEMINI.md`, and `doc/` must use **relative repository paths** (e.g., `[doc/CODE_STYLE.md](doc/CODE_STYLE.md)`), never local machine `file:///` paths.

---

## 2. Naming & API Surface Conventions

| Target Kind | Pattern | Examples |
| :--- | :--- | :--- |
| **Standard Module / Utility File** | `libag_<snake_case>.mjs` | `libag_lifecycle.mjs`, `libag_worker_op.mjs`, `libag_arg.mjs` |
| **Primary Class Definition File** | `libag_<PascalCase>.mjs` | `libag_AgentWorkerClient.mjs`, `libag_AgentWorkerRuntime.mjs`, `libag_AbstractNode.mjs` |
| **Seeded / Release / Entry Test File** | `libag_<name>.0.mjs` | `libag_config.0.mjs`, `libag_filter.0.mjs`, `libag_self_check.0.mjs` |
| **Exported Function Identifier** | `<topic>_<action_snake_case>` | `volume_imprint()`, `volume_has_mask()`, `descenthash_compute_single()` |

### Space-Prefixed `snake_case` Functions (Backwards/Topic Form)
- **C/Python `snake_case` everywhere:** Never use `camelCase` for library functions or methods. Using `snake_case` makes it immediately obvious what is a JS runtime built-in (`postMessage`, `Atomics.load`) versus library code (`agent_dispatch_op`).
- **Topic/Space Prefixing (~3 words):** Prefix exported functions with their module/topic coordinate so `grep` locates an entire functional group at once:
  - Prefer `volume_imprint()`, `volume_has_mask()`, `descenthash_compute_single()`
  - Avoid generic names like `imprint()`, `clear_mask()`, or `compute_single_hash()`

### Go-Style Unified Accessors (No `get_` / `set_`)
- Do not write separate `get_foo()` and `set_foo(val)` methods.
- Expose a single unified accessor `foo(val)`:
  - If `val !== undefined`, mutate/store the state and return `val` (or `this`).
  - If `val === undefined`, read and return the current state.
  ```javascript
  export function session_flag(ctx, val) {
      if (val !== undefined) {
          ctx.flag= val
          return val
      }
      return ctx.flag
  }
  ```

### Dual Surface API (Functional Primitives + Thin Class Wrappers)
- **Stateless Functional Primitives:** Write canonical operational logic as standalone exported functions accepting explicit context (`ctx`) or bound via `thisArg` (`step.call(ctx, opts)`). This guarantees 100% tree-shaking and minimal execution overhead per operation.
- **Thin OOP Class Wrappers:** For stateful lifetimes (such as Worker clients/runtimes or high-level handles), provide ES `class` wrappers that delegate directly to the functional primitives without duplicating implementation logic.

---

## 3. Dependency Discipline (`1p` / `2p` / `3p`)

All imports at the top of every `.mjs` file must be grouped and explicitly marked with `// 1p`, `// 2p`, and `// 3p` comments:

```javascript
// 1p
import { timingSafeEqual } from 'node:crypto'
import * as fs from 'node:fs/promises'

// 2p
import { invariant } from '../internal/libag_invariant.mjs'
import { arg_get_opt } from '../arg/libag_arg.mjs'

// 3p
// Statically vendored dependencies under src-mjs.dev/3p/<pkg>/ (avoid npm deps in prod)
```

- **`1p` (First-Party):** Core language/runtime built-ins (`node:*` modules, Web APIs).
- **`2p` (Second-Party):** Internal modules from this repository or your own sibling `lib-*` libraries.
- **`3p` (Third-Party):** External code. Avoid external `node_modules` dependencies in production; when a third-party artifact (e.g., a WASM binary) is required, vendor it statically into `src-mjs.dev/3p/` to eliminate supply-chain attack vectors.

---

## 4. Repository & Channel Structure (`doc/LIB_STRUCTURE.md`)

Source code is strictly separated by **language** and **stability channel** rather than placed in a generic `src/` directory:

```text
lib-agent/
├── GEMINI.md                        # Minimal root AI Jump Table (relative links to doc/.ai/)
├── AGENTS.md                        # Directs agents to read GEMINI.md
├── README.md                        # Project overview, status, constraints, and architecture
├── eslint.config.mjs                # Root flat config importing custom style rules
├── .editorconfig                    # 4-space indent rules for .mjs, .zig, .md
├── src-mjs.dev/                     # Active JS/MJS development channel
│   ├── 3p/                          # Statically vendored external/WASM modules
│   ├── ctor/                        # Core library constructors (libag_LibAgent.0.mjs)
│   ├── etc/                         # Release-level static config (libag_config.0.mjs)
│   ├── lib/                         # Core library modules grouped by space/topic
│   │   ├── arg/                     # CLI/options parsing & constant-time comparators
│   │   ├── config/                  # Base constants & magic numbers (libag_constants.mjs)
│   │   ├── host/                    # Runtime fingerprinting (Node, Bun, Deno)
│   │   ├── internal/                # Invariants, self_check, op runner, ctx, stamp
│   │   ├── os/                      # OS abstraction (os_fs, os_executor, win/, nix/)
│   │   ├── session/                 # Lifecycle context sessions
│   │   └── worker/                  # Isolate-split Worker IPC (Client, Runtime, Op)
│   └── main/                        # Entry orchestrators (libag_main.mjs)
├── src-mjs.main/                    # Hardened, production-ready MJS channel
├── src-mjs.testing/                 # Behavioral test suites & self-check harnesses
├── src-zig.dev/                     # Native Zig development channel (high-speed streams/IPC)
├── src-zig.main/                    # Production Zig channel
├── src-zig.testing/                 # Zig verification suites
├── local/
│   ├── sh/                          # CLI scripts (always with explicit .sh or .cmd extensions)
│   └── tool/                        # Local lockdown, gate PIN, and release promotion tools
├── var/
│   └── build/                       # Compiled binaries & bundles (strictly .gitignored)
├── res/
│   ├── agent/current/               # Fast-pass AI & human rule specs (rules-fastpass.txt / .md)
│   └── auto/antigravity/            # Reference search & style specification (search.md)
└── doc/
    ├── .ai/                         # AI memory, DESIGN_MOMENTUM.md, roadmaps (.gitignored)
    ├── .graveyard/                  # Archived ideas & deferred designs for historical context
    ├── maintainer/                  # Maintainer guides, guard & promotion docs
    ├── template/                    # Canonical module template (libag_module_template.mjs)
    ├── CODE_STYLE.md                # Formatting, naming, and defensive coding rules
    ├── LIB_STRUCTURE.md             # Channels, logging tiers, and naming rules
    ├── TESTING.md                   # Behavioral & invariant testing philosophy
    ├── mjs_bitwise_quirks.md        # 32-bit bitwise coercion & SharedArrayBuffer safety
    └── security.md                  # Resident process hardening & lockdown specs
```

- **Empty Stub Files:** Empty files in `.dev` are intentional architectural placeholders for future code—do not delete them during cleanup passes unless explicitly instructed.

---

## 5. Execution Architecture & Runtime Rules

### Invariants vs. Operation-Controlled Code
1. **Non-Operation Code (Setup, Memory Accessors, Structural Checks):**
   - Must use `invariant(cond, msg)` (`libag_invariant.mjs`).
   - If `cond` fails, execution halts immediately (`throw new Error`).
2. **Operation-Controlled Code (`run_operation(ctx, steps)`):**
   - Runs composed step functions via `thisArg` (`step.call(ctx, options)`) inside `try { ... } catch (err) { ... }`.
   - Transient failures invoke `retry(ctx, err, attempt)` with `micro_pause.retry_backoff(attempt, ctx)`.
   - Steps yield cooperatively via `micro_pause.yield(ctx, reason)` based on active profile modifiers (`+bg`: 10ms, `+fg`: 1ms, `-nolimits`: 0ms).
   - Automatically runs `run_pre_op_check(ctx)` before execution and `run_self_check(ctx)` upon completion.

### Zero-GC Mechanical Sympathy & Bitwise Safety
- **Binary-First Layouts:** Avoid object/string "slop" in hot loops. Pack node records and state flags into flat `SharedArrayBuffer` / `Uint8Array` / `Int32Array` strides with `Atomics` accessors.
- **JS Bitwise Quirks (`doc/mjs_bitwise_quirks.md`):** JavaScript coerces bitwise operands (`|`, `&`, `^`, `<<`, `>>`) to 32-bit signed integers. Restrict bitwise operations strictly to `Uint8Array` / `Int32Array` views (`Atomics.or`, `Atomics.and`). For 64-bit float fields (`mtime`, `size`), use `BigUint64Array` with `Atomics.load` / `Atomics.store` bit reinterpretation.
- **Referrer vs. Referent Parlance:** When modeling links, pointers, or mounted resources, use formal parlance (`referrer` for the pointer node, `referent` for the backing target) and encode state bits directly into the node's `Flags` byte rather than allocating separate state strings.

### V8 / SpiderMonkey Worker Isolate Splitting
Never mix main-thread and worker-thread imports in a single file. Split worker IPC across three files in `lib/worker/`:
1. `libag_worker_op.mjs` — Pure frozen constants (`PROTOCOL_OP`) and shared binary schemas.
2. `libag_AgentWorkerClient.mjs` — Main-thread isolate only (`class AgentWorkerClient` + dispatch functions).
3. `libag_AgentWorkerRuntime.mjs` — Worker-thread isolate only (`class AgentWorkerRuntime` + receive handlers).

### Two-Tier Logging (`imut_log` vs. User Log)
1. **Immutable Manifest (`imut_log` / `stamp`):**
   - Non-negotiable, always-on low-level audit log.
   - Records core lifecycle operations, OS-level commands (`os_executor`), and runtime/host fingerprints (`host_fingerprint()`). Never clutter `imut_log` with high-frequency timing loops.
2. **User / CLI Log:**
   - Streamed console / `chalkpack` output controlled by runtime flags (`+trace`, `+debug`, `+verbose`, `+send_debug`).

---

## 6. Resident Process Security & Hardening (`doc/security.md`)

Long-running resident processes must defend against prototype pollution and unauthorized runtime mutation:
1. **Null-Prototype Dictionaries:** Never use plain `{}` for dynamic key/path caches. Always use `Object.create(null)` or `new Map()`.
2. **Frozen Constant Tables:** Wrap all exported enums, flag masks, and OS command maps in `Object.freeze({...})`.
3. **Safe Option Extraction:** Never use `options.foo || default` on user/driver input. Use `Object.hasOwn(options, 'foo')` or `arg_get_opt(options, 'foo', default)`.
4. **Profile Modifiers & Gating:** Support `+` / `-` CLI/runtime profile modifiers (`+bg`, `+fg`, `+session`, `+gate`, `+send_debug`) with constant-time token/PIN verification (`timingSafeEqual`) when gated.

---

## 7. Behavioral & Invariant Testing (`doc/TESTING.md`)

- **Zero Expected Runtime Errors:** Do not write mock-heavy unit tests that assert whether functions throw errors ("if low-level code throws, it is borked").
- **Behavioral Verification:** Tests run via native `node --test` (`npm test`) against real or simulated workflows, verifying that `SharedArrayBuffer` strides, `0xAA` canary bytes, state transitions, and manifests remain 100% intact.

---

## 8. Reference Templates

### A. Canonical Module Template (`doc/template/libag_module_template.mjs`)

```javascript
/**
 * canonical module template (`libag_module_template.mjs`)
 * demonstrates strict project coding conventions, resident process prototype pollution defenses,
 * zero-GC mechanical sympathy, Go-style accessors, and the Dual Surface API (`1p/2p` pure).
 */

// 1p
import { timingSafeEqual } from 'node:crypto'

// 2p
import { invariant } from '../internal/libag_invariant.mjs'
import { arg_get_opt } from '../arg/libag_arg.mjs'

// 3p
// (none - zero external npm dependencies in resident core)

export const MODULE_TEMPLATE_FLAGS= Object.freeze({
    cold: 0x01,
    active: 0x02,
    dirty: 0x04,
    resident: 0x08
})

export function template_init_registry(options= {}) {
    var opts= options || {}
    var max_entries= arg_get_opt(opts, 'max_entries', 1024)
    var profile= arg_get_opt(opts, 'profile', '+bg')

    return {
        cache: Object.create(null),
        registry: new Map(),
        state_flags: MODULE_TEMPLATE_FLAGS.cold,
        max_entries: max_entries,
        profile: profile
    }
}

export function template_state_flags(ctx, val) {
    invariant(ctx && typeof ctx === 'object', 'template_state_flags: valid ctx required')
    if (val !== undefined) {
        ctx.state_flags= val
        return val
    }
    return ctx.state_flags
}

export class libag_ModuleTemplate {
    #ctx

    constructor(options= {}) {
        this.#ctx= template_init_registry(options)
    }

    state_flags(val) {
        return template_state_flags(this.#ctx, val)
    }
}
```

### B. Custom ESLint Style Rule (`libag-custom_eslint.mjs`)

```javascript
const no_space_before_assignment_rule= {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        messages: {
            noSpaceBefore: "Expected no space before '{{operator}}'.",
            spaceAfter: "Expected space after '{{operator}}'."
        }
    },
    create(context) {
        var source_code= context.sourceCode
        function check(node, left, operator= '=') {
            var token= source_code.getTokenAfter(left, (t) => t.value === operator)
            if (!token) return

            var prev_token= source_code.getTokenBefore(token)
            var next_token= source_code.getTokenAfter(token)

            var text_before= source_code.text.slice(prev_token.range[1], token.range[0])
            if (text_before.length > 0) {
                context.report({
                    node: token,
                    data: { operator },
                    messageId: 'noSpaceBefore',
                    fix(fixer) {
                        return fixer.removeRange([prev_token.range[1], token.range[0]])
                    }
                })
            }

            var text_after= source_code.text.slice(token.range[1], next_token.range[0])
            if (next_token && !text_after.includes('\n') && text_after.length === 0) {
                context.report({
                    node: token,
                    data: { operator },
                    messageId: 'spaceAfter',
                    fix(fixer) {
                        return fixer.insertTextAfter(token, ' ')
                    }
                })
            }
        }
        return {
            VariableDeclarator(node) {
                if (node.init) check(node, node.id)
            },
            AssignmentExpression(node) {
                check(node, node.left, node.operator)
            }
        }
    }
}

export default [
    {
        files: ['**/*.mjs'],
        plugins: {
            local: {
                rules: {
                    'no-space-before-assignment': no_space_before_assignment_rule
                }
            }
        },
        rules: {
            'indent': ['error', 4],
            'semi': ['error', 'never'],
            'camelcase': 'off',
            'no-multi-spaces': 'error',
            'local/no-space-before-assignment': 'error'
        }
    }
]
```
