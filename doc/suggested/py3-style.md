# Suggested Python 3 Style Guide: Strictly Bounded Glue (`doc/suggested/py3-style.md`)

#### status: suggested language rules (`src-py3`, `src-py3.dev`, `src-py3.main`, `src-py3.testing`)
#### fast-pass spec: [`res/src-py3/rules-fastpass.md`](../../res/src-py3/rules-fastpass.md) | [`res/src-py3/rules-fastpass.agent.txt`](../../res/src-py3/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Glue Only — Never a Giant Python Monolith

As noted in [`doc/TODO.md`](../TODO.md), Python 3 is at its best as **original glue** (orchestrating builds, transforming local data, driving CLI workflows)—and at its worst when allowed to balloon into a sprawling multi-package monolith with fragile `pip` virtual environments.

Following **Google's Python Style Guide** tailored for our anti-bloat ethos:
1. **Hard Complexity Ceiling:** If a Python component requires more than ~3–4 flat files or >400 lines per file, **it is no longer glue**—promote it to **Go (`src-go`)**, **MJS (`src-mjs`)**, or **Rust (`src-rs`)**.
2. **Standard Library First (`1p` Pure):** Python 3.11+ includes `pathlib`, `tomllib`, `json`, `sqlite3`, `urllib.request`, `subprocess`, `hashlib`, `dataclasses`, `typing`, and `unittest`. Do not add `requests`, `click`, `pydantic`, or `rich` when stdlib handles the job cleanly in 15 lines.
3. **Zero Packaging Clutter:** Avoid sprawling `setup.py` / `MANIFEST.in` / multi-layer nested package directories. If an isolated runner like `uv` is ever used for a tool script, use PEP 723 inline `# /// script` metadata with pinned hashes rather than polluting the repo with config files.

---

## 2. Hard Rules for Readability & Type Safety

1. **Mandatory Type Annotations Everywhere:**
    - Untyped Python becomes unreadable after two weeks. Every function parameter and return value must carry explicit type annotations (`from __future__ import annotations`).
2. **Frozen Slotted Dataclasses Over Ad-Hoc Dicts:**
    - Use `@dataclass(frozen=True, slots=True)` for structured state or configuration rather than untyped mutable dictionaries.
3. **Topic-Prefixed `snake_case` Functions (No OOP Hierarchy Soup):**
    - Write flat, stateless functions prefixed with their topic (`glue_run_step()`, `manifest_verify_hash()`), mirroring the `libag_` MJS/C convention. Never use metaclasses, multiple inheritance, or dynamic `getattr` monkey-patching.
4. **Subprocess Safety:**
    - Always call `subprocess.run([...], check=True, shell=False, timeout=...)` with an explicit argument list—never `shell=True` with interpolated strings.

---

## 3. Canonical Module Layout & `1p` / `2p` / `3p` Imports

```python
#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

from __future__ import annotations

# 1p
from dataclasses import dataclass, replace
from pathlib import Path
import subprocess
import sys

# 2p
# from libag_invariant import libag_invariant

# 3p
# (none - stdlib-only glue script)

FLAG_COLD: int = 0x01
FLAG_ACTIVE: int = 0x02


@dataclass(frozen=True, slots=True)
class GlueCtx:
    root_dir: Path
    state_flags: int = FLAG_COLD


def glue_invariant(cond: bool, msg: str) -> None:
    if not cond:
        raise RuntimeError(f"fastpass_invariant_halt: {msg}")


def glue_state_flags(ctx: GlueCtx, next_val: int | None = None) -> tuple[GlueCtx, int]:
    glue_invariant(isinstance(ctx, GlueCtx), "glue_state_flags: valid GlueCtx required")
    if next_val is not None:
        updated = replace(ctx, state_flags=next_val)
        return updated, next_val
    return ctx, ctx.state_flags
```

---

## 4. Bytecode & Cache Hygiene (`var/build/py3`)

Never allow Python to scatter `__pycache__/` or `.pytest_cache/` folders across `src-py3.*`:
- Set `PYTHONPYCACHEPREFIX=var/build/py3/pycache` (or pass `python3 -B` in CLI wrappers).
