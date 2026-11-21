# Concern 05: Repository & Channel Structure (`doc/LIB_STRUCTURE.md`)

#### status: canonical concern specification
#### fast-pass (AI agent `.agent.txt`): [`05-topology.agent.txt`](05-topology.agent.txt)
#### index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt) | [`doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## Language & Stability Channel Topology

Source code is strictly separated by **language** and **stability channel** rather than placed in a generic `src/` directory:

```text
lib-agent/
├── LICENSE                          # GNU General Public License v3 (Free Software)
├── GEMINI.md                        # Minimal root AI Jump Table (relative links to doc/.ai/)
├── AGENTS.md                        # Directs agents to read GEMINI.md
├── README.md                        # Project overview, status, constraints, and architecture
├── eslint.config.mjs                # Root flat config importing custom style rules
├── .editorconfig                    # 4-space indent rules for .mjs, .zig, .md
├── src-mjs.dev/                     # Active JS/MJS development channel
│   ├── 3p/                          # Statically vendored external/WASM modules (GPLv3-compatible)
│   ├── ctor/                        # Core library constructors (libag_LibAgent.0.mjs)
│   ├── etc/                         # Release-level static config (libag_config.0.mjs)
│   ├── lib/                         # Core library modules grouped by space/topic
│   │   ├── arg/                     # CLI/options parsing & constant-time comparators
│   │   ├── config/                  # Base constants & magic numbers (libag_constants.mjs)
│   │   ├── host/                    # Runtime fingerprinting (Node, Bun, Deno)
│   │   ├── internal/                # Invariants, self_check, op runner, ctx, stamp
│   │   ├── os/                      # OS abstraction (os_fs, os_executor, win/, nix/)
│   │   ├── session/                 # Lifecycle context sessions
│   │   └── worker/                  # Isolate-split Worker IPC (Client, Runtime, Op)
│   └── main/                        # Entry orchestrators (libag_main.mjs)
├── src-mjs.main/                    # Hardened, production-ready MJS channel
├── src-mjs.testing/                 # Behavioral test suites & self-check harnesses
├── src-zig.dev/                     # Native Zig development channel (high-speed streams/IPC)
├── src-zig.main/                    # Production Zig channel
├── src-zig.testing/                 # Zig verification suites
├── local/
│   ├── sh/                          # CLI scripts (always with explicit .sh or .cmd extensions)
│   └── tool/                        # Local lockdown, gate PIN, and release promotion tools
├── var/
│   ├── build/                       # Compiled binaries & bundles (strictly .gitignored)
│   ├── dist/                        # Package manager distribution forms (strictly .gitignored)
│   └── release/                     # Signed release artifacts (strictly .gitignored)
├── res/
│   ├── agent/current/               # Universal language-agnostic rules & empire master index
│   └── src-<lang>/                  # Language-specific fast-pass specs (src-mjs, src-go, src-rs, src-cpp, src-zig, src-java, src-py3)
└── doc/
    ├── .ai/                         # AI memory, DESIGN_MOMENTUM.md, roadmaps (.gitignored)
    ├── .graveyard/                  # Archived ideas & deferred designs for historical context
    ├── maintainer/                  # Maintainer guides, guard & promotion docs
    ├── suggested/                   # Google-inspired & anti-LLM-mess rules per language
    ├── template/                    # Canonical module template (libag_module_template.mjs)
    ├── TODO.md                      # Architectural roadmap & language notes
    ├── agent-jump-table.md          # Canonical AI & human concern jump table
    ├── CODE_STYLE.md                # Formatting, naming, and defensive coding rules
    ├── LIB_STRUCTURE.md             # Channels, logging tiers, and naming rules
    ├── TESTING.md                   # Behavioral & invariant testing philosophy
    ├── mjs_bitwise_quirks.md        # 32-bit bitwise coercion & SharedArrayBuffer safety
    └── security.md                  # Resident process hardening & lockdown specs
```

### Structural Invariants

- **Empty Stub Files:** Empty files in `.dev` are intentional architectural placeholders for future code—do not delete them during cleanup passes unless explicitly instructed.
- **Explicit Script Extensions:** Scripts under `local/sh/` must always carry explicit `.sh` or `.cmd` extensions.
