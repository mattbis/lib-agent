# `lib-agent` (`src-cpp`): C++ Coding Style, Rules & Fast-Pass Specification (`res/src-cpp/rules-fastpass.md`)

#### status: canonical C++ language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-cpp/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/cpp-style.md`](../../doc/suggested/cpp-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-cpp`)

- **Primary Domain (`doc/TODO.md`):** Cross-the-board systems, native engines, and performance-critical components—kept strictly bounded in small modules so C++ never turns into an unreadable multi-paradigm nightmare.
- **Channels:** `src-cpp/` (base/headers), `src-cpp.dev/` (active development), `src-cpp.main/` (hardened production mainline), `src-cpp.testing/` (behavioral verification suites).
- **Build & Artifact Output:** All CMake/Ninja/compiler outputs go strictly to `var/build/cpp/` (`cmake -B var/build/cpp`), distributions to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-cpp`)

1. **Free Software (`GPLv3`):**
    - Every `.cpp` and `.hpp` file begins with `// SPDX-License-Identifier: GPL-3.0-or-later` ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Orthodox C++ Subset (Anti-Insanity Discipline):**
    - C++ offers 50 ways to do anything; we pick **one predictable, Google-C++-inspired orthodox subset** (C++20/C++23):
    - **No Exceptions (`-fno-exceptions`) & No RTTI (`-fno-rtti`):** Use explicit status codes / `std::expected<T, Err>` and hard `libag_invariant(cond, msg)` assertions.
    - **No Template Metaprogramming Gymnastics:** Use simple `constexpr` and flat structs/functions (`snake_case` with topic prefix, matching `libag_` C/MJS conventions).
    - **Explicit Ownership:** Prefer arena/slab allocation or `std::span` / fixed buffers over scattered `std::shared_ptr` reference-counting graphs.
3. **Include Grouping (`1p` / `2p` / `3p`):**
    - Every file groups `#include` directives under `// 1p` (C/C++ standard library `<cstdint>`, `<array>`, `<atomic>`), `// 2p` (project headers `"libag_..."`), and `// 3p` (statically vendored headers under `src-cpp.dev/3p/`).
4. **Formatting & Naming:**
    - 4-space indentation everywhere (`.clang-format`: `IndentWidth: 4`, `UseTab: Never`).
    - Files prefixed with `libag_` (`libag_<topic>.hpp`, `libag_<topic>.cpp`).
    - Functions in `snake_case` (`<topic>_<action>()`), types in `PascalCase` or `libag_<name>_t`, constants in `SCREAMING_SNAKE_CASE`.
