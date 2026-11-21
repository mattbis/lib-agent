# Concern 08: Behavioral & Invariant Testing (`doc/TESTING.md`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`08-testing.agent.txt`](08-testing.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## Behavioral & Invariant Verification Philosophy

- **Zero Expected Runtime Errors:**
    - Do not write mock-heavy unit tests that assert whether functions throw errors ("if low-level code throws, it is borked").
- **Behavioral Verification:**
    - Tests run via native `node --test` (`npm test`) against real or simulated workflows, verifying that `SharedArrayBuffer` strides, `0xAA` canary bytes, state transitions, and manifests remain 100% intact.
