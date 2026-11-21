# `lib-agent` (`src-py3`): Python 3 Coding Style, Rules & Fast-Pass Specification (`res/src-py3/rules-fastpass.md`)

#### status: canonical Python 3 language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-py3/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/py3-style.md`](../../doc/suggested/py3-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-py3`)

- **Primary Domain (`doc/TODO.md`):** Original glue scripts, build/automation orchestration, and data bridges. **Strictly bounded:** never allow Python to grow into a giant, unreadable multi-package project or a fragile `pip` dependency tree.
- **Channels:** `src-py3/` (base), `src-py3.dev/` (active development), `src-py3.main/` (hardened production mainline), `src-py3.testing/` (behavioral verification suites).
- **Build & Artifact Output:** Route bytecode caches (`PYTHONPYCACHEPREFIX=var/build/py3/pycache`) and any packaged artifacts to `var/build/py3/`, `var/dist/`, and `var/release/`—never scatter `__pycache__/` or `.venv/` across source folders.

---

## 2. Core Rules & Conventions (`src-py3`)

1. **Free Software (`GPLv3`):**
    - Every `.py` file begins with `# SPDX-License-Identifier: GPL-3.0-or-later` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Anti-Monolith Glue Discipline:**
    - Keep Python modules flat, small (<400 lines per file), and self-contained (`libag_<topic>.py`).
    - Default to the **Python 3 Standard Library (`1p`)** (`pathlib`, `subprocess`, `json`, `hashlib`, `urllib`, `dataclasses`, `typing`). Avoid `pip` dependencies unless unavoidable; if required, vendor pure-Python modules statically into `src-py3.dev/3p/` or lock via single minimal `uv` script metadata.
3. **Import Grouping (`1p` / `2p` / `3p`):**
    - Group imports at the top of every file under `# 1p` (Python stdlib), `# 2p` (local `libag_*` modules), and `# 3p` (statically vendored `src-py3.dev/3p/` modules).
4. **Syntax, Typing & Naming:**
    - 4-space indentation everywhere.
    - Mandatory type annotations on all function signatures (`def op_dispatch(ctx: dict[str, Any], timeout_ms: int = 1000) -> bool:`).
    - Space-prefixed `snake_case` function names (`<topic>_<action>()`), `@dataclass(frozen=True, slots=True)` for structured records, and explicit `libag_invariant(cond, msg)` assertions.
