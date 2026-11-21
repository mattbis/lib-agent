# Concern 07: Resident Process Security & Hardening (`doc/security.md`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`07-security.agent.txt`](07-security.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## Resident Process Security & Lockdown Rules

Long-running resident processes must defend against prototype pollution and unauthorized runtime mutation:

1. **Null-Prototype Dictionaries:**
    - Never use plain `{}` for dynamic key/path caches.
    - Always use `Object.create(null)` or `new Map()`.
2. **Frozen Constant Tables:**
    - Wrap all exported enums, flag masks, and OS command maps in `Object.freeze({...})`.
3. **Safe Option Extraction:**
    - Never use `options.foo || default` on user/driver input.
    - Use `Object.hasOwn(options, 'foo')` or `arg_get_opt(options, 'foo', default)`.
4. **Profile Modifiers & Gating:**
    - Support `+` / `-` CLI/runtime profile modifiers (`+bg`, `+fg`, `+session`, `+gate`, `+send_debug`) with constant-time token/PIN verification (`timingSafeEqual`) when gated.
