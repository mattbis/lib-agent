# Suggested Zig Style Guide: C-Power High-Performance Components (`doc/suggested/zig-style.md`)

#### status: suggested language rules (`src-zig`, `src-zig.dev`, `src-zig.main`, `src-zig.testing`)
#### fast-pass spec: [`res/src-zig/rules-fastpass.md`](../../res/src-zig/rules-fastpass.md) | [`res/src-zig/rules-fastpass.agent.txt`](../../res/src-zig/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Explicit Control & Zero Hidden Flow

As noted in [`doc/TODO.md`](../TODO.md), Zig is used for small, focused components that need the raw power of C with uncompromising performance and a clean ethos:
- **No hidden control flow:** No operator overloading, no hidden exceptions, no hidden destructor calls.
- **No hidden memory allocations:** If a function does not take a `std.mem.Allocator`, it **cannot allocate heap memory**.
- **Seamless C ABI export:** Ideal for hot-path micro-kernels called from MJS (WASM/N-API), Rust, Go, or C++.

---

## 2. Hard Rules & Anti-LLM-Hallucination Guardrails

1. **Explicit Allocator or Caller-Owned Slices (`[]u8`):**
    - Prefer functions that operate on caller-provided buffers (`out_buf: []u8`) so zero heap allocation occurs at runtime.
    - When dynamic allocation is necessary, pass `allocator: std.mem.Allocator` as the first parameter and use `std.ArrayListUnmanaged(T)` / `std.StringHashMapUnmanaged(T)` to avoid storing redundant allocator pointers inside every struct.
2. **Immediate `defer` / `errdefer` Pairing:**
    - Every allocation or resource open must be followed on the very next line by its `defer` or `errdefer` release.
3. **Explicit Error Sets on Public Functions:**
    - Never use inferred `!T` or `anyerror!T` on exported module boundaries. Declare a concrete error set (`pub const FrameError = error{ OutOfBounds, InvalidMagic };`).
4. **Preventing LLM Zig-Version Hallucinations:**
    - LLMs trained on mixed Zig 0.10–0.13 corpora frequently invent deprecated APIs. Keep these modern Zig 0.13/0.14+ conventions strict:
        - Use `for (slice, 0..) |item, idx|` (never the removed `for (slice) |item, idx|`).
        - Use `@ptrCast(@alignCast(ptr))` separately (never the old 2-arg `@ptrCast(Type, ptr)`).
        - Use `std.Random` (never `std.rand`).
        - Use `b.path("...")` in `build.zig` (never `.{ .path = "..." }`).

---

## 3. Canonical Module Layout & `1p` / `2p` / `3p` Imports

```zig
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

// 1p
const std = @import("std");
const testing = std.testing;

// 2p
// const invariant = @import("libag_invariant.zig");

// 3p
// (none - zero external dependencies)

pub const FrameError = error{
    BufferTooSmall,
    CorruptCanary,
};

pub const CANARY_BYTE: u8 = 0xAA;

pub const RingCtx = struct {
    flags: u32 = 0x01,
    stride: u32 = 64,
};

pub fn ring_state_flags(ctx: *RingCtx, next_val: ?u32) u32 {
    if (next_val) |val| {
        ctx.flags = val;
        return val;
    }
    return ctx.flags;
}

pub fn ring_stamp_canary(buf: []u8) FrameError!usize {
    if (buf.len < 4) {
        return FrameError.BufferTooSmall;
    }
    buf[0] = CANARY_BYTE;
    return 1;
}

test "ring_stamp_canary writes 0xAA canary byte" {
    var storage: [16]u8 = [_]u8{0} ** 16;
    const written = try ring_stamp_canary(storage[0..]);
    try testing.expectEqual(@as(usize, 1), written);
    try testing.expectEqual(CANARY_BYTE, storage[0]);
}
```

---

## 4. Build & Artifact Hygiene (`var/build/zig`)

Always invoke `zig build` or `zig test` with explicit cache and output redirection to `var/build/zig/`:

```sh
zig build --cache-dir var/build/zig/cache --global-cache-dir var/build/zig/global-cache --prefix var/build/zig/out
```
