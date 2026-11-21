# `lib-agent` (`src-zig`): Zig Coding Style, Rules & Fast-Pass Specification (`res/src-zig/rules-fastpass.md`)

#### status: canonical Zig language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-zig/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/zig-style.md`](../../doc/suggested/zig-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-zig`)

- **Primary Domain (`doc/TODO.md`):** Small, ultra-fast components that require C-level hardware control, zero hidden allocations, and deterministic performance.
- **Channels:** `src-zig/` (base), `src-zig.dev/` (active development), `src-zig.main/` (hardened production mainline), `src-zig.testing/` (behavioral & memory verification).
- **Build & Artifact Output:** Never allow `.zig-cache/` or `zig-out/` to pollute the repo root. Route all builds to `var/build/zig/` (`zig build --cache-dir var/build/zig/cache --prefix var/build/zig/out`), distributions to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-zig`)

1. **Free Software (`GPLv3`):**
    - Every `.zig` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Formatting & Naming:**
    - Formatted via `zig fmt` (4-space indentation).
    - Files prefixed with `libag_` (`libag_stream.zig`, `libag_ipc.zig`).
    - Functions in `snake_case` with topic prefix (`stream_read_frame`, `ipc_ring_push`), types in `PascalCase`, variables in `snake_case`.
3. **Import Grouping (`1p` / `2p` / `3p`):**
    - Top of file groups `@import` declarations under `// 1p` (`const std = @import("std");`, `const builtin = @import("builtin");`), `// 2p` (local `libag_*.zig` modules), and `// 3p` (statically vendored `.zig` / C sources under `src-zig.dev/3p/`).
4. **Explicit Allocator & Error Discipline:**
    - Never use a hidden global allocator. Every function that allocates accepts `allocator: std.mem.Allocator` explicitly (or operates on caller-supplied fixed slices `[]u8`).
    - Pair resource acquisition immediately with `defer` or `errdefer`.
    - Define explicit error sets (`pub const StreamError = error{ BufferFull, CorruptFrame };`) rather than `anyerror` on public APIs.
