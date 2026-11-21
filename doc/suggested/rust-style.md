# Suggested Rust Style Guide: Memory-Controlled Runtimes & CLAP Plugins (`doc/suggested/rust-style.md`)

#### status: suggested language rules (`src-rs`, `src-rs.dev`, `src-rs.main`, `src-rs.testing`)
#### fast-pass spec: [`res/src-rs/rules-fastpass.md`](../../res/src-rs/rules-fastpass.md) | [`res/src-rs/rules-fastpass.agent.txt`](../../res/src-rs/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Defeating Cargo Dependency Sprawl

As noted in [`doc/TODO.md`](../TODO.md), Rust is outstanding for memory-controlled applications, deterministic runtimes, and CLAP audio plugins—but the standard Rust ecosystem suffers from the exact same supply-chain disease as `npm`: pulling a single crate often drags in 200 transitive dependencies that are impossible to audit.

Our Rust style adopts **Google's Crubit/Android Rust discipline**:
1. **Zero Unaudited Crates:** Default to `core` and `std`. Write simple parsers, binary codecs, and CLI flag readers in-tree (`2p`) rather than pulling `serde`, `clap`, or `anyhow` macro trees.
2. **Static `3p/` Vendoring (`--offline --frozen`):** When a third-party crate (such as thin CLAP C-ABI bindings) is genuinely required, vendor its source statically into `src-rs.dev/3p/` via `cargo vendor`, strip unused features (`default-features = false`), verify GPLv3 compatibility, and build offline.

---

## 2. Hard Rules for Memory Control & Real-Time Audio (CLAP)

1. **Zero Heap Allocations in Real-Time / Audio Callbacks:**
    - Inside audio `process()` threads or hot runtime loops:
        - **Forbidden:** `Vec::push`, `Box::new`, `String` formatting, `HashMap` resizing, `Mutex::lock`, `RwLock`, or OS syscalls (logging/file I/O).
        - **Required:** Pre-allocate all buffers during `activate()` / `init()`. Communicate between the UI/main thread and the audio/worker thread exclusively via lock-free SPSC ring buffers and `core::sync::atomic` primitives.
2. **No `.unwrap()` or `.expect()` in Production Code:**
    - Deny panicking shortcuts in library and runtime code (`#![deny(clippy::unwrap_used)]`).
    - Propagate errors explicitly via `Result<T, LibagError>` with a compact, zero-allocation `#[repr(u8)]` or flat enum error type.
3. **No `.clone()` or `Arc<Mutex<T>>` Slop to Appease the Borrow Checker:**
    - LLMs frequently paper over lifetime errors by wrapping structs in `Arc<Mutex<T>>` or cloning buffers.
    - Prefer flat array indices (arena/handle pattern: `NodeId(u32)` indexing into a pre-allocated slice) over self-referential pointer graphs.
4. **Strict `unsafe` Encapsulation:**
    - Every crate sets `#![deny(unsafe_op_in_unsafe_fn)]`.
    - Every `unsafe { ... }` block must be preceded by a `// SAFETY:` comment proving why pointer alignment, lifetime, and aliasing invariants hold.

---

## 3. Canonical Module Layout & `1p` / `2p` / `3p` Imports

```rust
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

#![deny(unsafe_op_in_unsafe_fn)]

// 1p
use core::sync::atomic::{AtomicU32, Ordering};

// 2p
use crate::internal::libag_invariant;

// 3p
// (statically vendored GPLv3-compatible crates under src-rs.dev/3p/ only)

#[repr(u32)]
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub enum EngineFlags {
    Cold     = 0x01,
    Active   = 0x02,
    Realtime = 0x04,
}

pub struct EngineCtx {
    flags: AtomicU32,
    sample_rate: u32,
}

pub fn engine_init_ctx(sample_rate: u32) -> EngineCtx {
    libag_invariant(sample_rate > 0, "engine_init_ctx: sample_rate must be > 0");
    EngineCtx {
        flags: AtomicU32::new(EngineFlags::Cold as u32),
        sample_rate,
    }
}

pub fn engine_state_flags(ctx: &EngineCtx, next_val: Option<u32>) -> u32 {
    if let Some(val) = next_val {
        ctx.flags.store(val, Ordering::Release);
        return val;
    }
    ctx.flags.load(Ordering::Acquire)
}
```

---

## 4. Build & Cargo Output Redirection (`var/build/rs`)

Always configure `.cargo/config.toml` so Cargo never creates a root `target/` folder:

```toml
# SPDX-License-Identifier: GPL-3.0-or-later
[build]
target-dir = "var/build/rs"

[net]
offline = true
```
