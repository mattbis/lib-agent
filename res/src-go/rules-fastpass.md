# `lib-agent` (`src-go`): Go Coding Style, Rules & Fast-Pass Specification (`res/src-go/rules-fastpass.md`)

#### status: canonical Go language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-go/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/go-style.md`](../../doc/suggested/go-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-go`)

- **Primary Domain (`doc/TODO.md`):** High-efficiency CLI utilities, low-latency networking daemons, systems services, and applications such as music governor.
- **Channels:** `src-go/` (base/shared), `src-go.dev/` (active development), `src-go.main/` (hardened production mainline), `src-go.testing/` (behavioral & integration harnesses).
- **Build & Artifact Output:** All compiled binaries and test caches route to `var/build/go/` (`go build -o var/build/go/`), package bundles to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-go`)

1. **Free Software (`GPLv3`):**
    - Every `.go` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later` and is released under GNU GPLv3 ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Formatting & Layout:**
    - Enforced automatically via `gofmt -s`. Never fight `gofmt`.
3. **Import Grouping (`1p` / `2p` / `3p`):**
    - Group `import (...)` into three blank-line-separated blocks marked with `// 1p` (Go standard library), `// 2p` (internal repository & sibling `lib-*` modules), and `// 3p` (statically vendored GPLv3-compatible packages under `src-go.dev/3p/` or `-mod=vendor`).
    - Prefer Go's rich standard library (`net/http`, `crypto`, `encoding`, `context`, `sync/atomic`) over external modules.
4. **Naming & API Surface:**
    - Prefix file names with `libag_` (e.g., `libag_governor.go`, `libag_net_op.go`) for instant global searchability.
    - Follow Go's unified accessor philosophy: `Foo()` reads, `SetFoo(v)` or option structs configure; keep exported package surfaces minimal.
5. **Concurrency & Error Discipline:**
    - Always pass `ctx context.Context` as the first parameter of any blocking, I/O, or long-running function.
    - Never spawn "fire-and-forget" goroutines without an explicit lifetime owner (`errgroup` / `sync.WaitGroup` + cancellation channel).
    - Wrap errors with context (`fmt.Errorf("governor_tick: %w", err)`); never discard errors with `_` in operational code.
    - No `init()` magic or runtime reflection (`reflect`) in hot paths.
