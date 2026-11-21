# Concern 03: Naming & API Surface Conventions

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`03-naming-api.agent.txt`](03-naming-api.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. File & Identifier Naming (`libag_` Prefix)

Every file in the library is prefixed with the short library namespace (`libag_` for `lib-agent`, `libcd_` for `lib-change-descent`) so files are globally identifiable and searchable:

| Target Kind | Pattern | Examples |
| :--- | :--- | :--- |
| **Standard Module / Utility File** | `libag_<snake_case>.mjs` | `libag_lifecycle.mjs`, `libag_worker_op.mjs`, `libag_arg.mjs` |
| **Primary Class Definition File** | `libag_<PascalCase>.mjs` | `libag_AgentWorkerClient.mjs`, `libag_AgentWorkerRuntime.mjs`, `libag_AbstractNode.mjs` |
| **Seeded / Release / Entry Test File** | `libag_<name>.0.mjs` | `libag_config.0.mjs`, `libag_filter.0.mjs`, `libag_self_check.0.mjs` |
| **Exported Function Identifier** | `<topic>_<action_snake_case>` | `volume_imprint()`, `volume_has_mask()`, `descenthash_compute_single()` |

---

## 2. Space-Prefixed `snake_case` Functions (Backwards/Topic Form)

- **C/Python `snake_case` everywhere:** Never use `camelCase` for library functions or methods. Using `snake_case` makes it immediately obvious what is a JS runtime built-in (`postMessage`, `Atomics.load`) versus library code (`agent_dispatch_op`).
- **Topic/Space Prefixing (~3 words):** Prefix exported functions with their module/topic coordinate so `grep` locates an entire functional group at once:
    - Prefer `volume_imprint()`, `volume_has_mask()`, `descenthash_compute_single()`
    - Avoid generic names like `imprint()`, `clear_mask()`, or `compute_single_hash()`

---

## 3. Go-Style Unified Accessors (No `get_` / `set_`)

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

---

## 4. Dual Surface API (Functional Primitives + Thin Class Wrappers)

- **Stateless Functional Primitives:** Write canonical operational logic as standalone exported functions accepting explicit context (`ctx`) or bound via `thisArg` (`step.call(ctx, opts)`). This guarantees 100% tree-shaking and minimal execution overhead per operation.
- **Thin OOP Class Wrappers:** For stateful lifetimes (such as Worker clients/runtimes or high-level handles), provide ES `class` wrappers that delegate directly to the functional primitives without duplicating implementation logic.
