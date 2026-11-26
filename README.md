# `lib-agent`

#### license: GNU General Public License Version 3 ([`LICENSE`](LICENSE) — Free Software)
#### master jump table: [`doc/agent-jump-table.md`](doc/agent-jump-table.md)
#### universal fast-pass (AI `.agent.txt`): [`res/agent/current/rules-fastpass.agent.txt`](res/agent/current/rules-fastpass.agent.txt)
#### universal human index: [`res/agent/current/rules-fastpass.md`](res/agent/current/rules-fastpass.md)
#### architectural roadmap: [`doc/TODO.md`](doc/TODO.md)

`lib-agent` (namespace prefix `libag_`) is the canonical multi-language architecture, coding style, and fast-pass rule repository for Free Software (`GPLv3`) systems and libraries across **MJS (`src-mjs`)**, **Go (`src-go`)**, **Rust (`src-rs`)**, **C++ (`src-cpp`)**, **Zig (`src-zig`)**, **Java (`src-java`)**, **Python 3 (`src-py3`)**, **C# / .NET (`src-cs`)**, and **Kotlin (`src-kt`)**.

---

## Quick Navigation

- **Universal Agnostic Rules (`res/agent/current/`):**
    - [`01-license-freesoftware.md`](res/agent/current/01-license-freesoftware.md) | [`.agent.txt`](res/agent/current/01-license-freesoftware.agent.txt) — Mandatory GNU GPLv3 licensing across all code and static `3p` dependencies.
    - [`02-architecture-ethos.md`](res/agent/current/02-architecture-ethos.md) | [`.agent.txt`](res/agent/current/02-architecture-ethos.agent.txt) — Forever-code, zero supply-chain roulette, `1p/2p/3p` import tiers, anti-ball-of-mud discipline.
    - [`03-topology-var.md`](res/agent/current/03-topology-var.md) | [`.agent.txt`](res/agent/current/03-topology-var.agent.txt) — Multi-language channels (`src-<lang>.{dev,main,testing}`) and unified `var/{build,dist,release}` outputs.
    - [`04-epistemic-critique.md`](res/agent/current/04-epistemic-critique.md) | [`.agent.txt`](res/agent/current/04-epistemic-critique.agent.txt) — Pre-action feasibility gate, anti-sycophancy, and mandatory response self-critique.
- **Language Fast-Pass Specs (`res/src-<lang>/`):**
    - [`res/src-mjs/rules-fastpass.md`](res/src-mjs/rules-fastpass.md) ([`.agent.txt`](res/src-mjs/rules-fastpass.agent.txt))
    - [`res/src-go/rules-fastpass.md`](res/src-go/rules-fastpass.md) ([`.agent.txt`](res/src-go/rules-fastpass.agent.txt))
    - [`res/src-rs/rules-fastpass.md`](res/src-rs/rules-fastpass.md) ([`.agent.txt`](res/src-rs/rules-fastpass.agent.txt))
    - [`res/src-cpp/rules-fastpass.md`](res/src-cpp/rules-fastpass.md) ([`.agent.txt`](res/src-cpp/rules-fastpass.agent.txt))
    - [`res/src-zig/rules-fastpass.md`](res/src-zig/rules-fastpass.md) ([`.agent.txt`](res/src-zig/rules-fastpass.agent.txt))
    - [`res/src-java/rules-fastpass.md`](res/src-java/rules-fastpass.md) ([`.agent.txt`](res/src-java/rules-fastpass.agent.txt))
    - [`res/src-py3/rules-fastpass.md`](res/src-py3/rules-fastpass.md) ([`.agent.txt`](res/src-py3/rules-fastpass.agent.txt))
    - [`res/src-cs/rules-fastpass.md`](res/src-cs/rules-fastpass.md) ([`.agent.txt`](res/src-cs/rules-fastpass.agent.txt))
    - [`res/src-kt/rules-fastpass.md`](res/src-kt/rules-fastpass.md) ([`.agent.txt`](res/src-kt/rules-fastpass.agent.txt))
- **Google-Inspired & Anti-LLM-Mess Guides (`doc/suggested/`):**
    - [`doc/suggested/README.md`](doc/suggested/README.md) — Overview & index
    - [`doc/suggested/llm-guardrails.md`](doc/suggested/llm-guardrails.md) — Guardrails for GPT, DeepSeek, and local LLMs before `underwyrt`
    - [`doc/suggested/cpp-style.md`](doc/suggested/cpp-style.md) | [`rust-style.md`](doc/suggested/rust-style.md) | [`go-style.md`](doc/suggested/go-style.md) | [`zig-style.md`](doc/suggested/zig-style.md) | [`java-style.md`](doc/suggested/java-style.md) | [`py3-style.md`](doc/suggested/py3-style.md) | [`cs-style.md`](doc/suggested/cs-style.md) | [`kt-style.md`](doc/suggested/kt-style.md)
- **Agent Behavioral Prompts (`doc/prompts/`):**
    - [`doc/prompts/README.md`](doc/prompts/README.md) — Epistemic & behavioral prompt index
    - [`doc/prompts/self-critical-agent.md`](doc/prompts/self-critical-agent.md) — Anti-sycophancy & response self-critique protocol
- **Fast-Pass CLI Tool (`agent-fastpass`):**
    - Run `.\local\sh\agent-fastpass.cmd` (or `./local/sh/agent-fastpass.sh`) with `+validate`, `+audit`, or `+bundle`.
