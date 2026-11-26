# Common Concern 03: Universal Multi-Language Channels & `var/` Artifact Topology

#### status: canonical language-agnostic concern specification
#### fast-pass (AI agent `.agent.txt`): [`03-topology-var.agent.txt`](03-topology-var.agent.txt)
#### master index: [`rules-fastpass.md`](rules-fastpass.md) | [`rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### jump table: [`doc/agent-jump-table.md`](../../../doc/agent-jump-table.md)

---

## 1. Multi-Language Source Channels (`src-<lang>.<channel>`)

Never dump source files into a generic `src/` folder. Every language is isolated by its canonical prefix and split across stability channels:

| Language | Base / Spec Key | Active Dev Channel | Hardened Mainline | Behavioral Testing | Primary Domain & Role (`doc/TODO.md`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MJS (Node/V8)** | `src-mjs` | `src-mjs.dev/` | `src-mjs.main/` | `src-mjs.testing/` | Agent orchestration, zero-GC SAB workers, fast-pass tooling. |
| **Go** | `src-go` | `src-go.dev/` | `src-go.main/` | `src-go.testing/` | High-efficiency CLI, networking, daemons, music governor. |
| **Rust** | `src-rs` | `src-rs.dev/` | `src-rs.main/` | `src-rs.testing/` | Memory-controlled applications & runtimes, CLAP audio plugins. |
| **C++** | `src-cpp` | `src-cpp.dev/` | `src-cpp.main/` | `src-cpp.testing/` | Cross-board systems & audio/engine core (strict orthodox subset). |
| **Zig** | `src-zig` | `src-zig.dev/` | `src-zig.main/` | `src-zig.testing/` | Small high-speed components needing C-level power & performance. |
| **Java** | `src-java` | `src-java.dev/` | `src-java.main/` | `src-java.testing/` | Financial systems, messaging buses, AI & enterprise integrations. |
| **Python 3** | `src-py3` | `src-py3.dev/` | `src-py3.main/` | `src-py3.testing/` | Strictly bounded glue scripts & automation (never giant monoliths). |
| **C# / .NET** | `src-cs` | `src-cs.dev/` | `src-cs.main/` | `src-cs.testing/` | Modern .NET 8/9+ & NativeAOT, `Span<T>`, tooling, financial & services. |
| **Kotlin** | `src-kt` | `src-kt.dev/` | `src-kt.main/` | `src-kt.testing/` | Kotlin 2.x K2 (JVM, Native & KMP), `@JvmInline value class`, coroutines & `src-java` interop. |

---

## 2. Unified Variable Output Topology (`var/`)

Compilers, bundlers, and package managers must **never** splatter build artifacts (`target/`, `build/`, `dist/`, `__pycache__/`, `.gradle/`, `.kotlin/`, `zig-cache/`) across the repository root or source directories. All variable/generated outputs live strictly under `var/` (which is globally `.gitignore`d):

```text
var/
├── build/                           # All compiler, bundler & cache outputs (multiple sub-targets allowed)
│   ├── mjs/                         # Bundled/transpiled MJS outputs
│   ├── go/                          # Go compiled binaries (`go build -o var/build/go/`)
│   ├── rs/                          # Cargo target dir (`CARGO_TARGET_DIR=var/build/rs`)
│   ├── cpp/                         # CMake/Ninja build tree (`cmake -B var/build/cpp`)
│   ├── zig/                         # Zig cache & out (`--cache-dir var/build/zig/cache --prefix var/build/zig/out`)
│   ├── java/                        # Javac/Gradle/Maven classes & jars (`var/build/java`)
│   ├── py3/                         # Python bytecode/wheels (`PYTHONPYCACHEPREFIX=var/build/py3`)
│   ├── cs/                          # .NET / MSBuild bin & obj outputs (`var/build/cs`)
│   └── kt/                          # Kotlin / K2 classes, jars & KLIBs (`var/build/kt`)
├── dist/                            # Distribution packages formatted for package managers (.deb, .rpm, .tar.zst, wheels)
└── release/                         # Cryptographically signed release artifacts & checksum manifests
```

---

## 3. Repository Root Layout

```text
lib-agent/
├── LICENSE                          # GNU General Public License v3 (Free Software)
├── README.md                        # Project overview, architecture, and status
├── GEMINI.md / AGENTS.md            # Root AI jump entry points -> doc/agent-jump-table.md
├── src-<lang>.dev/                  # Active development channel per language (preserve empty stub files!)
├── src-<lang>.main/                 # Hardened production channel per language
├── src-<lang>.testing/              # Behavioral verification suites per language
├── local/
│   ├── sh/                          # CLI wrapper scripts (always explicit .sh or .cmd extensions)
│   └── tool/                        # Local developer, audit, lockdown & promotion tools
├── var/
│   ├── build/                       # Ephemeral build targets & caches (strictly .gitignored)
│   ├── dist/                        # Package manager distribution forms (strictly .gitignored)
│   └── release/                     # Signed release artifacts (strictly .gitignored)
├── res/
│   ├── agent/current/               # Language-agnostic empire rules & master fast-pass index
│   ├── src-mjs/                     # MJS coding rules & fast-pass concern specs
│   ├── src-go/                      # Go coding rules & fast-pass specs
│   ├── src-rs/                      # Rust coding rules & fast-pass specs
│   ├── src-cpp/                     # C++ coding rules & fast-pass specs
│   ├── src-zig/                     # Zig coding rules & fast-pass specs
│   ├── src-java/                    # Java coding rules & fast-pass specs
│   ├── src-py3/                     # Python 3 coding rules & fast-pass specs
│   ├── src-cs/                      # C# / .NET coding rules & fast-pass specs
│   └── src-kt/                      # Kotlin coding rules & fast-pass specs
└── doc/
    ├── agent-jump-table.md          # Master concern & multi-language jump table
    ├── TODO.md                      # Architectural roadmap & language notes
    ├── prompts/                     # Reusable epistemic & behavioral agent prompts
    └── suggested/                   # Google-inspired & anti-LLM-mess rules for each language
```
