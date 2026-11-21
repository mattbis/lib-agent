# Suggested C# & .NET Style Guide: Low-Allocation Modern .NET & NativeAOT (`doc/suggested/cs-style.md`)

#### status: suggested language rules (`src-cs`, `src-cs.dev`, `src-cs.main`, `src-cs.testing`)
#### fast-pass spec: [`res/src-cs/rules-fastpass.md`](../../res/src-cs/rules-fastpass.md) | [`res/src-cs/rules-fastpass.agent.txt`](../../res/src-cs/rules-fastpass.agent.txt)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## 1. Philosophy: Modern Systems C# (Zero Enterprise Bloat)

Modern C# (.NET 8/9+ LTS) has evolved into a genuine systems-capable language with `Span<T>`, `ref struct`, `readonly record struct`, SIMD intrinsics, and single-binary **NativeAOT** compilation.

However, GPT, DeepSeek, and local LLMs trained on legacy C# corpora default to 2012-era "Enterprise .NET" habits: pulling 40 NuGet packages (`AutoMapper`, `MediatR`, `FluentAssertions`), creating `IFooServiceFactoryProvider` interfaces for every class, and allocating closures on every loop iteration.

Our C# rules enforce **high-performance, zero-magic, NativeAOT-ready .NET**:
1. **Explicit Imports (`<ImplicitUsings>disable</ImplicitUsings>`):** Every file shows its exact `// 1p`, `// 2p`, `// 3p` dependencies at the top.
2. **File-Scoped Namespaces:** Always use `namespace LibAgent.Module;` to eliminate a wasted level of indentation.
3. **Zero Unaudited NuGet Sprawl:** The .NET Base Class Library (`System.Text.Json`, `System.IO.Pipelines`, `System.Threading.Channels`, `System.Buffers`, `System.Security.Cryptography`) replaces 95% of third-party NuGet packages.

---

## 2. Hard Rules for Memory, Financial Safety & AOT

1. **Zero-Allocation Hot Paths (`Span<T>` & `readonly record struct`):**
    - Use `ReadOnlySpan<byte>` / `Span<byte>` and `ArrayPool<T>.Shared` for buffer processing, parsers, and IPC frames.
    - Mark value-type DTOs and events as `public readonly record struct` so they live on the stack or inline in arrays without GC pressure.
    - Avoid LINQ chains (`.Where(...).Select(...).ToList()`) inside hot loops.
2. **NativeAOT & Trimming Compatibility:**
    - Always write code that compiles cleanly under `<PublishAot>true</PublishAot>` and `<IsAotCompatible>true</IsAotCompatible>`.
    - Never use unbounded runtime `System.Reflection` or `dynamic`; if JSON serialization is needed, use C# source-generated `JsonSerializerContext`.
3. **Financial & Monetary Precision:**
    - Use `decimal` (128-bit base-10 floating point) or `long` minor-unit micros (`checked { ... }`) for currency and ledger calculations—never `float` or `double`.
4. **Structured Async & Cancellation:**
    - Never use `async void`, `.Result`, or `.Wait()` (sync-over-async deadlocks).
    - Pass `CancellationToken ct = default` to every async/blocking method.

---

## 3. Canonical File Layout & `1p` / `2p` / `3p` Imports

```csharp
// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) Matthew & Contributors — Free Software (GNU GPLv3)

namespace LibAgent.Core;

// 1p
using System;
using System.Buffers.Binary;
using System.Threading;

// 2p
// using LibAgent.Internal;

// 3p
// (none - pure BCL resident core)

[Flags]
public enum LibagStateFlags : uint
{
    Cold     = 0x01,
    Active   = 0x02,
    Dirty    = 0x04,
    Resident = 0x08,
}

public readonly record struct LibagFrameHeader(uint Magic, uint PayloadLength, LibagStateFlags Flags);

public sealed class LibagRingCtx
{
    private uint _stateFlags = (uint)LibagStateFlags.Cold;

    public int MaxEntries { get; }

    public LibagRingCtx(int maxEntries = 1024)
    {
        if (maxEntries <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(maxEntries), "fastpass_invariant_halt: maxEntries <= 0");
        }
        MaxEntries = maxEntries;
    }

    // Unified Go-style accessor pattern in C#: overload for read vs write
    public LibagStateFlags StateFlags() =>
        (LibagStateFlags)Volatile.Read(ref _stateFlags);

    public LibagStateFlags StateFlags(LibagStateFlags nextVal)
    {
        Volatile.Write(ref _stateFlags, (uint)nextVal);
        return nextVal;
    }

    public static bool TryReadHeader(ReadOnlySpan<byte> src, out LibagFrameHeader header)
    {
        if (src.Length < 12)
        {
            header = default;
            return false;
        }
        uint magic = BinaryPrimitives.ReadUInt32LittleEndian(src[..4]);
        uint len   = BinaryPrimitives.ReadUInt32LittleEndian(src[4..8]);
        uint flags = BinaryPrimitives.ReadUInt32LittleEndian(src[8..12]);
        header = new LibagFrameHeader(magic, len, (LibagStateFlags)flags);
        return true;
    }
}
```

---

## 4. Build & Artifact Hygiene (`var/build/cs`)

By default, MSBuild and `dotnet build` pollute every project directory with `bin/` and `obj/` folders. Prevent this completely with a root `Directory.Build.props` that routes all intermediate and final outputs into `var/build/cs/`:

```xml
<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<Project>
    <PropertyGroup>
        <TargetFramework>net8.0</TargetFramework>
        <LangVersion>latest</LangVersion>
        <Nullable>enable</Nullable>
        <ImplicitUsings>disable</ImplicitUsings>
        <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
        <IsAotCompatible>true</IsAotCompatible>
        <PackageLicenseExpression>GPL-3.0-or-later</PackageLicenseExpression>

        <!-- Route all bin/ and obj/ outputs strictly to var/build/cs/ -->
        <ArtifactsPath>$(MSBuildThisFileDirectory)var/build/cs</ArtifactsPath>
        <BaseOutputPath>$(MSBuildThisFileDirectory)var/build/cs/bin/$(MSBuildProjectName)/</BaseOutputPath>
        <BaseIntermediateOutputPath>$(MSBuildThisFileDirectory)var/build/cs/obj/$(MSBuildProjectName)/</BaseIntermediateOutputPath>
    </PropertyGroup>
</Project>
```
