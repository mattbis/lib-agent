# Concern 01: Free Software & Licensing (`GPLv3`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`01-license-freesoftware.agent.txt`](01-license-freesoftware.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. Free Software Mandate (`GPLv3`)

- **Always Released as GPL Version 3:**
    - We are Free Software ("free as in freedom"). All code, libraries, tools, scripts, and templates authored across `lib-agent` and sibling `lib-*` repositories are **always released under the GNU General Public License Version 3 (`GPL-3.0`)**.
    - Every user and downstream recipient is guaranteed the four essential software freedoms: to run, study, redistribute, and distribute modified versions of the program under the same copyleft terms.
- **Root `LICENSE` File:**
    - Every repository must maintain a root [`LICENSE`](../../../LICENSE) file containing the full GNU GPLv3 text.
    - Never remove, weaken, or replace the copyleft license in any channel (`.dev`, `.main`, `.testing`) or build artifact.

---

## 2. Source Headers & Package Metadata

- **SPDX License Identifier in Source Files:**
    - Include the SPDX identifier at the top of every `.mjs`, `.zig`, and shell script file:
    ```javascript
    // SPDX-License-Identifier: GPL-3.0-or-later
    // Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)
    ```
- **Package & Manifest Declarations:**
    - In `package.json` and distribution manifests, always set the license field explicitly:
    ```json
    {
        "license": "GPL-3.0-or-later"
    }
    ```

---

## 3. Third-Party (`3p`) License Compatibility

- **Strict GPLv3 Compatibility:**
    - Any statically vendored third-party (`3p`) module or WASM artifact placed under `src-mjs.dev/3p/` must be Free Software under a license that is strictly compatible with **GNU GPLv3** (e.g., `GPL-3.0`, `LGPL-3.0`, `AGPL-3.0`, `Apache-2.0`, `MIT`, `BSD-2-Clause`, `BSD-3-Clause`, `ISC`, `MPL-2.0`).
    - Proprietary, source-available, non-commercial-only, or GPLv3-incompatible dependencies are **strictly forbidden**.
    - Preserve upstream `LICENSE` / `COPYING` notices alongside any vendored `3p` artifact in `src-mjs.dev/3p/<pkg>/`.
