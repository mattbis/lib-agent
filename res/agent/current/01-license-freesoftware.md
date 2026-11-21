# Common Concern 01: Free Software & Licensing (`GPLv3`)

#### status: canonical language-agnostic concern specification
#### fast-pass (AI agent `.agent.txt`): [`01-license-freesoftware.agent.txt`](01-license-freesoftware.agent.txt)
#### master index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### jump table: [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. Universal Free Software Mandate (`GPLv3`)

- **Always Released as GNU GPL Version 3:**
    - We are Free Software ("free as in freedom"). All code, libraries, tools, scripts, and templates authored across `lib-agent`, `underwyrt`, and sibling `lib-*` repositories—across **every language** (`src-mjs`, `src-go`, `src-rs`, `src-cpp`, `src-zig`, `src-java`, `src-py3`)—are **always released under the GNU General Public License Version 3 (`GPL-3.0-or-later`)**.
    - Every user and downstream recipient is guaranteed the four essential software freedoms: to run, study, redistribute, and distribute modified versions of the program under the same copyleft terms.
- **Root `LICENSE` File:**
    - Every repository must maintain a root [`LICENSE`](../../../LICENSE) file containing the full GNU GPLv3 text.
    - Never remove, weaken, or replace the copyleft license in any language channel (`.dev`, `.main`, `.testing`) or build/distribution artifact (`var/build`, `var/dist`, `var/release`).

---

## 2. Source Headers & Package Metadata Across Languages

- **C-Style Comment Languages (`.mjs`, `.go`, `.rs`, `.cpp`, `.hpp`, `.zig`, `.java`):**
    ```text
    // SPDX-License-Identifier: GPL-3.0-or-later
    // Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)
    ```
- **Hash Comment Languages (`.py`, `.sh`, `CMakeLists.txt`, `.toml`, `.yaml`):**
    ```text
    # SPDX-License-Identifier: GPL-3.0-or-later
    # Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)
    ```
- **Windows Batch Scripts (`.cmd`):**
    ```bat
    REM SPDX-License-Identifier: GPL-3.0-or-later
    REM Copyright (C) Matthew and Contributors - Free Software (GNU GPLv3)
    ```
- **Package & Manifest Declarations (`package.json`, `Cargo.toml`, `pyproject.toml`):**
    - Always declare `"license": "GPL-3.0-or-later"` (or `license = "GPL-3.0-or-later"`).

---

## 3. Third-Party (`3p`) Static Dependency Compatibility

- **Strict GPLv3 Compatibility:**
    - Any statically vendored third-party (`3p`) source, archive, or binary artifact placed under `src-<lang>.dev/3p/` must be Free Software under a license strictly compatible with **GNU GPLv3** (`GPL-3.0`, `LGPL-3.0`, `AGPL-3.0`, `Apache-2.0`, `MIT`, `BSD-2-Clause`, `BSD-3-Clause`, `ISC`, `MPL-2.0`, `Zlib`, `0BSD`).
    - Proprietary, source-available, non-commercial-only, or GPLv3-incompatible dependencies are **strictly forbidden**.
    - Preserve upstream `LICENSE` / `COPYING` notices alongside every vendored `3p` artifact in `src-<lang>.dev/3p/<pkg>/`.
