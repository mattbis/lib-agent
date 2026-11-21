# Suggested Go Style Guide: High-Efficiency CLI, Networking & Governors (`doc/suggested/go-style.md`)

#### status: suggested language rules (`src-go`, `src-go.dev`, `src-go.main`, `src-go.testing`)
#### fast-pass spec: [`res/src-go/rules-fastpass.md`](../../res/src-go/rules-fastpass.md) | [`res/src-go/rules-fastpass.agent.txt`](../../res/src-go/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Google Go Clarity & Zero Magic

Go is our primary choice for high-efficiency CLI tooling, low-latency networking services, and resident daemons such as **music governor** ([`doc/TODO.md`](../TODO.md)).

Following **Google's Go Style Decisions**:
- **Clarity over cleverness:** Code should read top-to-bottom like plain systems prose.
- **Stdlib supremacy:** Go's standard library (`net`, `net/http`, `context`, `os/exec`, `sync/atomic`, `crypto`, `flag`) covers 95% of networking and CLI requirements without a single external dependency.
- **No hidden startup or reflection:** Never use `init()` functions with side effects or runtime `reflect` in hot paths.

---

## 2. Hard Rules for Concurrency, Memory & Error Handling

1. **No Orphan Goroutines:**
    - Every `go func()` must have a clear parent owner that waits for its termination and a clear cancellation signal (`ctx.Done()`).
    - If a function spawns background goroutines, it must expose a `Close()` or `Shutdown(ctx)` method that blocks until all worker goroutines exit cleanly.
2. **`context.Context` First:**
    - Any function performing I/O, IPC, network calls, or cooperative sleeps takes `ctx context.Context` as its **first parameter**. Never store a `Context` inside a struct.
3. **Zero-Allocation Hot Loops:**
    - In high-frequency networking or governor loops, reuse fixed byte slices (`[]byte`) or `sync.Pool` buffers rather than allocating new slices per packet/tick. Verify with `go test -bench=. -benchmem`.
4. **Structured Error Wrapping:**
    - Prefix wrapped errors with the module/operation coordinate (`fmt.Errorf("governor_apply_limit: %w", err)`).
    - Use sentinel errors (`var ErrBudgetExhausted = errors.New(...)`) checked via `errors.Is()`, never string matching.

---

## 3. Canonical File Layout & `1p` / `2p` / `3p` Imports

```go
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

package governor

// 1p
import (
	"context"
	"errors"
	"fmt"
	"sync/atomic"
)

// 2p
// import "libagent/internal/invariant"

// 3p
// (none — stdlib-first resident daemon core)

const (
	FlagCold   uint32 = 0x01
	FlagActive uint32 = 0x02
	FlagGated  uint32 = 0x04
)

var ErrGovernorHalted = errors.New("governor_halted")

type GovernorCtx struct {
	flags     atomic.Uint32
	maxBudget int64
}

func NewGovernorCtx(maxBudget int64) *GovernorCtx {
	if maxBudget <= 0 {
		panic("fastpass_invariant_halt: NewGovernorCtx requires maxBudget > 0")
	}
	ctx := &GovernorCtx{maxBudget: maxBudget}
	ctx.flags.Store(FlagCold)
	return ctx
}

func (g *GovernorCtx) StateFlags(nextVal ...uint32) uint32 {
	if len(nextVal) > 0 {
		g.flags.Store(nextVal[0])
		return nextVal[0]
	}
	return g.flags.Load()
}

func (g *GovernorCtx) RunTick(ctx context.Context) error {
	if err := ctx.Err(); err != nil {
		return fmt.Errorf("governor_run_tick: %w", err)
	}
	if g.flags.Load()&FlagActive == 0 {
		return ErrGovernorHalted
	}
	return nil
}
```

---

## 4. Build & Artifact Hygiene (`var/build/go`)

- Always compile binaries directly into `var/build/go/`:
    ```sh
    go build -trimpath -ldflags="-s -w" -o var/build/go/ ./...
    ```
- If any `3p` module is vendored, commit it statically and build with `-mod=vendor`.
