# Concern 06: Execution Architecture & Runtime Rules (`doc/mjs_bitwise_quirks.md`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`06-execution-runtime.agent.txt`](06-execution-runtime.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. Invariants vs. Operation-Controlled Code

1. **Non-Operation Code (Setup, Memory Accessors, Structural Checks):**
    - Must use `invariant(cond, msg)` (`libag_invariant.mjs`).
    - If `cond` fails, execution halts immediately (`throw new Error`).
2. **Operation-Controlled Code (`run_operation(ctx, steps)`):**
    - Runs composed step functions via `thisArg` (`step.call(ctx, options)`) inside `try { ... } catch (err) { ... }`.
    - Transient failures invoke `retry(ctx, err, attempt)` with `micro_pause.retry_backoff(attempt, ctx)`.
    - Steps yield cooperatively via `micro_pause.yield(ctx, reason)` based on active profile modifiers (`+bg`: 10ms, `+fg`: 1ms, `-nolimits`: 0ms).
    - Automatically runs `run_pre_op_check(ctx)` before execution and `run_self_check(ctx)` upon completion.

---

## 2. Zero-GC Mechanical Sympathy & Bitwise Safety

- **Binary-First Layouts:** Avoid object/string "slop" in hot loops. Pack node records and state flags into flat `SharedArrayBuffer` / `Uint8Array` / `Int32Array` strides with `Atomics` accessors.
- **JS Bitwise Quirks (`doc/mjs_bitwise_quirks.md`):** JavaScript coerces bitwise operands (`|`, `&`, `^`, `<<`, `>>`) to 32-bit signed integers. Restrict bitwise operations strictly to `Uint8Array` / `Int32Array` views (`Atomics.or`, `Atomics.and`). For 64-bit float fields (`mtime`, `size`), use `BigUint64Array` with `Atomics.load` / `Atomics.store` bit reinterpretation.
- **Referrer vs. Referent Parlance:** When modeling links, pointers, or mounted resources, use formal parlance (`referrer` for the pointer node, `referent` for the backing target) and encode state bits directly into the node's `Flags` byte rather than allocating separate state strings.

---

## 3. V8 / SpiderMonkey Worker Isolate Splitting

Never mix main-thread and worker-thread imports in a single file. Split worker IPC across three files in `lib/worker/`:
1. `libag_worker_op.mjs` — Pure frozen constants (`PROTOCOL_OP`) and shared binary schemas.
2. `libag_AgentWorkerClient.mjs` — Main-thread isolate only (`class AgentWorkerClient` + dispatch functions).
3. `libag_AgentWorkerRuntime.mjs` — Worker-thread isolate only (`class AgentWorkerRuntime` + receive handlers).

---

## 4. Two-Tier Logging (`imut_log` vs. User Log)

1. **Immutable Manifest (`imut_log` / `stamp`):**
    - Non-negotiable, always-on low-level audit log.
    - Records core lifecycle operations, OS-level commands (`os_executor`), and runtime/host fingerprints (`host_fingerprint()`). Never clutter `imut_log` with high-frequency timing loops.
2. **User / CLI Log:**
    - Streamed console / `chalkpack` output controlled by runtime flags (`+trace`, `+debug`, `+verbose`, `+send_debug`).
