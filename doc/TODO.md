# Architectural TODO & Multi-Language Philosophy (`doc/TODO.md`)

1. now we need to generalise into the languages I like working with:-

Here are some rough guidelines on how these fit into my projects, both completed, and not completed, many are architected but need a lot of work. Note these guidelines are subject to change depending on how much I come to love each __way__ of doing things.... 

- Java
    - we will use for financial and messages; AI and other stuff, since its used for endless things old and new
    - `src-java` `src-java.dev` `src-java.main`
- Python3
    - we use as original glue - not giant projects that end up a mess - I really dislike huge python projects they are hard to read and a mess. I also dislike the packaging system and the way pip works :D, UV has made that better, but its so clunky so many files.. I will probably change my mind evventualllly.
    - `src-py3`  `src-py3.dev` `src-py3.main`
- Go
    - we will use mostly for applications that are highly efficient cli, networking and stuff like music governor
    - `src-go` `src-go.dev` `src-go.main`
- Rust
    - we will use for highly memory controlled applications and runtimes. I am undecided about plugins but its easier doing clap with it than SDK Vst3. its suffering from the problem of npm / node so many packages, its almost impossible verify a supply chain that big, thats something i really don't like...
    - `src-rs`  `src-rs.dev` `src-rs.main`
- Cplusplus
    - we will use across the board... but again we dislike huge projects since it can be a nightmare, and the language is almost like insanity since there are so many ways to do anything
    - `src-cpp`  `src-cpp.dev` `src-cpp.main`
- zig
    - we will use for small components, that need the power of C but super performance. and I really like the ethos behind it
    - `src-zig`  `src-zig.dev` `src-zig.main`

For each language, we need to have solid rules for style... I like all code to be consistent and not a BULL OF MUD. Therefore the first task is to generalise the repo structure and to separate things into agnostic and common across programming.

2. general notes about projects:-
    - I don't like loads of dependencies.. I want to know what everything does, I prefer to old school static deps, and optimise them if necessary. I particularly dislike deps that are so small or often should be part of an Standard library, they are better marked as a 3p but static dep. I also don't have time to deal with CI pulling in stupid malware and stuff like that.. we dont care if stuff is old.. We code such that we are as sure as we can be it will work forever.. this is the aim.
    - maintenance, always has a lot of phases, and lofty goals, stuff will get fixed, but it probably will take me awhile to get around to it. And a giant ton of PRs is not someting I want to spend any time doing.. people will fork but the problem with vibe coding is they dont know about prs and keeping a mainline - helping everyone, they just fork some old version modify it and then its probably got bad bugs.... hence by limiting the scope as much as possible - and keeping deps to the absolute minimum when that happens if they must do that ( also i dont think many new coders have any idea about how foss is supposed ot work ) they have a solid base... its all good but that is our aim.
    - `var/build` don't put the target in some place that makes no sense, a build is variable and a global `.gitignore` decent...
        - more than one `var/build` is fine, it just makes it nice and easy to see this the output - so many languages and frameworks splatter artefacts in some silly location
    - `var/dist` some distribution form for package managers
    - `var/release` some signed artefact
