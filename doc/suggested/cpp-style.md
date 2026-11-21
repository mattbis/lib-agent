# Suggested C++ Style Guide: Google-Inspired Orthodox C++ (`doc/suggested/cpp-style.md`)

#### status: suggested language rules (`src-cpp`, `src-cpp.dev`, `src-cpp.main`, `src-cpp.testing`)
#### fast-pass spec: [`res/src-cpp/rules-fastpass.md`](../../res/src-cpp/rules-fastpass.md) | [`res/src-cpp/rules-fastpass.agent.txt`](../../res/src-cpp/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Taming the Insanity of C++

As noted in [`doc/TODO.md`](../TODO.md), C++ is powerful across the board, but huge C++ projects easily become a nightmare because the language provides 50 incompatible ways to express the same thing.

Google's C++ Style Guide solved this by **aggressively forbidding features** that harm readability, predictability, or binary footprint. For `lib-agent` and `underwyrt`, we use an **Orthodox C++20/23 Subset** ("C with strong types, `constexpr`, `std::span`, and explicit arenas").

---

## 2. The Forbidden List (What We Never Use)

1. **No Exceptions (`-fno-exceptions`):**
    - Exceptions introduce hidden control-flow edges, bloat binary unwind tables, and break across ABI/FFI boundaries (Zig/Rust/C).
    - Use explicit return status enums (`libag_status_t`), `std::expected<T, libag_err_t>`, or hard `libag_invariant(cond, "msg")` checks.
2. **No Run-Time Type Information (`-fno-rtti`):**
    - Never use `dynamic_cast` or `typeid`. If polymorphism is required, use an explicit tagged union / `enum class` dispatch or a flat C-style function-pointer vtable.
3. **No `std::shared_ptr` Ownership Graphs:**
    - Reference-counted pointer webs hide object lifetimes and cause atomic cache-line bouncing across cores.
    - Every allocation must have a **single deterministic owner** (an arena/slab allocator, a stack frame, or a single `std::unique_ptr`).
4. **No Heavy Template Metaprogramming or Boost:**
    - Never use SFINAE puzzles, deep variadic recursion, or external `Boost` headers. Keep templates limited to simple container/span element types and `constexpr` math.
5. **No Global Static Constructors (`<iostream>` etc.):**
    - Static initialization order fiascos ruin startup determinism. All global tables must be `constexpr` frozen structs/arrays.

---

## 3. Canonical File Structure & `1p` / `2p` / `3p` Includes

Every `.hpp` and `.cpp` file uses 4-space indentation, `libag_` file prefixing, and strict three-tier includes:

```cpp
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

#pragma once

// 1p
#include <atomic>
#include <cstddef>
#include <cstdint>
#include <span>

// 2p
#include "internal/libag_invariant.hpp"

// 3p
// (statically vendored GPLv3-compatible headers under src-cpp.dev/3p/ only)

namespace libag {

enum class ring_status_t : uint8_t {
    ok          = 0x00,
    buffer_full = 0x01,
    empty       = 0x02,
};

struct ring_ctx_t {
    std::span<uint8_t> storage;
    uint32_t           capacity;
    uint32_t           flags;
};

// Go-style unified accessor in C++: overload foo(ctx) for read, foo(ctx, val) for write
inline uint32_t ring_state_flags(const ring_ctx_t& ctx) noexcept {
    return ctx.flags;
}

inline uint32_t ring_state_flags(ring_ctx_t& ctx, uint32_t val) noexcept {
    ctx.flags = val;
    return val;
}

ring_status_t ring_push_frame(ring_ctx_t& ctx, std::span<const uint8_t> payload) noexcept;

} // namespace libag
```

---

## 4. Build & Tooling Hygiene (`var/build/cpp`)

- **Out-of-Source Builds Only:**
    - Always invoke CMake with `-B var/build/cpp` so `CMakeFiles/`, `compile_commands.json`, and binaries stay inside `var/build/cpp/`.
- **Recommended `.clang-format` Baseline:**
    ```yaml
    # SPDX-License-Identifier: GPL-3.0-or-later
    BasedOnStyle: Google
    IndentWidth: 4
    TabWidth: 4
    UseTab: Never
    ColumnLimit: 100
    AllowShortFunctionsOnASingleLine: Inline
    SortIncludes: Never # preserve explicit // 1p, // 2p, // 3p ordering
    ```
