# Concern 04: Dependency Discipline (`1p` / `2p` / `3p`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`04-dependencies.agent.txt`](04-dependencies.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## Import Grouping & Supply-Chain Discipline

All imports at the top of every `.mjs` file must be grouped and explicitly marked with `// 1p`, `// 2p`, and `// 3p` comments:

```javascript
// SPDX-License-Identifier: GPL-3.0-or-later

// 1p
import { timingSafeEqual } from 'node:crypto'
import * as fs from 'node:fs/promises'

// 2p
import { invariant } from '../internal/libag_invariant.mjs'
import { arg_get_opt } from '../arg/libag_arg.mjs'

// 3p
// Statically vendored GPLv3-compatible dependencies under src-mjs.dev/3p/<pkg>/ (avoid npm deps in prod)
```

### Dependency Tiers

- **`1p` (First-Party):** Core language/runtime built-ins (`node:*` modules, Web APIs).
- **`2p` (Second-Party):** Internal modules from this repository or sibling `lib-*` Free Software libraries.
- **`3p` (Third-Party):** External code. Avoid external `node_modules` dependencies in production; when a third-party artifact (e.g., a WASM binary) is required, vendor it statically into `src-mjs.dev/3p/` to eliminate supply-chain attack vectors. Any `3p` dependency must be Free Software under a license compatible with **GNU GPLv3** (see [`01-license-freesoftware.md`](01-license-freesoftware.md)).
