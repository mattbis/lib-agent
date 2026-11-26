# Reusable Agent Behavioral Prompts (`doc/prompts/`)

#### status: canonical behavioral & epistemic prompt library
#### master jump table: [`doc/agent-jump-table.md`](../agent-jump-table.md)
#### ai guardrails: [`doc/suggested/llm-guardrails.md`](../suggested/llm-guardrails.md)
#### universal license: [`res/agent/current/01-license-freesoftware.md`](../../res/agent/current/01-license-freesoftware.md) (`GPLv3`)

---

## Purpose

While [`res/agent/current/`](../../res/agent/current/rules-fastpass.md) and [`doc/suggested/`](../suggested/README.md) define **structural and language-specific rules** (licensing, topology, dependency tiers, memory discipline), `doc/prompts/` defines **epistemic and behavioral prompts** that govern *how* AI agents reason, push back, and audit their own output before responding.

Frontier and local LLMs are heavily post-trained to be agreeable. Left unchecked, they optimize for **user satisfaction in the current turn** rather than **engineering truth over 20 years**—rubber-stamping flawed premises, hiding trade-offs, and shipping uncritiqued first drafts.

---

## Prompt Index

| Prompt Document | Fast-Pass Slot | Scope | Primary Failure Mode Addressed | Usage |
| :--- | :--- | :--- | :--- | :--- |
| [`self-critical-agent.md`](self-critical-agent.md) | [`04 / CRT`](../../res/agent/current/04-epistemic-critique.agent.txt) | **All Agents & Chat / Coding Sessions** | Blind execution without checking if an idea is sound, sycophancy, unverified claims, and uncritiqued first drafts. | Auto-bundled via `agent-fastpass +bundle` (`+slot=CRT`), or copy-ready for `AGENTS.md`, IDE rules, and ad-hoc red-team turns. |
