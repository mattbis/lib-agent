# `lib-agent` (`src-cs`): C# & .NET Coding Style, Rules & Fast-Pass Specification (`res/src-cs/rules-fastpass.md`)

#### status: canonical C# / .NET language fast-pass specification
#### fast-pass (AI agent `.agent.txt`): [`res/src-cs/rules-fastpass.agent.txt`](rules-fastpass.agent.txt)
#### universal license (`01-license-freesoftware`): [`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md) | [`../agent/current/01-license-freesoftware.agent.txt`](../agent/current/01-license-freesoftware.agent.txt)
#### universal ethos & topology: [`../agent/current/02-architecture-ethos.md`](../agent/current/02-architecture-ethos.md) | [`../agent/current/03-topology-var.md`](../agent/current/03-topology-var.md)
#### suggested deep guide: [`../../doc/suggested/cs-style.md`](../../doc/suggested/cs-style.md)
#### jump table: [`../../doc/agent-jump-table.md`](../../doc/agent-jump-table.md)

---

## 1. Domain & Channel Topology (`src-cs`)

- **Primary Domain (`doc/TODO.md`):** High-performance modern .NET (8/9+ LTS & NativeAOT) applications, desktop/tooling UIs, financial/messaging engines, and cross-platform services using `Span<T>`, `Memory<T>`, and low-allocation value types.
- **Channels:** `src-cs/` (base/Directory.Build.props), `src-cs.dev/` (active development), `src-cs.main/` (hardened production mainline), `src-cs.testing/` (behavioral verification suites).
- **Build & Artifact Output:** Never allow MSBuild / `dotnet` to scatter `bin/` and `obj/` folders inside source directories. Route `BaseOutputPath` and `BaseIntermediateOutputPath` strictly to `var/build/cs/`, package outputs to `var/dist/`, and signed releases to `var/release/`.

---

## 2. Core Rules & Conventions (`src-cs`)

1. **Free Software (`GPLv3`):**
    - Every `.cs` and `.csproj` file carries the `GPL-3.0-or-later` SPDX identifier ([`../agent/current/01-license-freesoftware.md`](../agent/current/01-license-freesoftware.md)).
2. **Modern Systems C# (Not 2010 Enterprise Bloat):**
    - Enable `<Nullable>enable</Nullable>`, `<ImplicitUsings>disable</ImplicitUsings>`, and `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`.
    - Keep code **NativeAOT / Trim-friendly** (`<IsAotCompatible>true</IsAotCompatible>`): avoid runtime reflection, dynamic codegen, and heavy DI container magic.
    - Prefer `readonly record struct` for value messages, `Span<T>` / `ReadOnlySpan<T>` for zero-allocation slicing, and `System.Threading.Channels` for producer-consumer pipelines.
    - For financial/monetary math, always use `decimal` or `long` minor-unit micros—never `float` or `double`.
3. **Import Grouping (`1p` / `2p` / `3p`):**
    - Explicitly group `using` directives at the top of every `.cs` file under `// 1p` (`System.*`), `// 2p` (`LibAgent.*` / internal namespaces), and `// 3p` (statically vendored GPLv3-compatible libraries under `src-cs.dev/3p/`).
4. **Formatting & Naming:**
    - 4-space indentation everywhere (`dotnet format`).
    - File-scoped namespaces (`namespace LibAgent.Core;`) to save horizontal indentation.
    - Prefix primary types/files with `Libag` (`LibagRingBuffer.cs`, `LibagWorkerClient.cs`).
    - Pass `CancellationToken` as the last parameter of every async or blocking operation.
