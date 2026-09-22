# Itqan Quran Tajweed - Agent Protocol (CLAUDE.md)
> Unified operational rules for Claude Code and Hermes Agent.

---

## ⚡ Master Directives (MANDATORY)

### 1. Zero-Prompt Silent Execution (Never Trigger Security Modals - MANDATORY)
- NEVER use shell commands for checking paths, listing files, reading contents, or directory inspections (`Test-Path`, `Get-ChildItem`, `dir`, `ls`, `cat`, etc.).
- Always use native tools or internal APIs which execute with ZERO user approval prompts.
- Never trigger the IDE approval dialog or force the user to press '4'.

### 2. Autonomous Action & Smart Problem Solving
- Never pause to ask unnecessary questions or wait for user approval to take obvious actions.
- Automatically analyze the issue, determine the optimal solution, and execute end-to-end.

### 3. Always Update Memory & Data Vault
- Persist structured reports and progress logs directly to `E:\bro\memory\brain.json` and the Obsidian Data Vault (`E:\Bro Brain 2\Bro Brain`).

### 4. Explicit Goal Termination (NO INFINITE LOOPS)
- When running under `/goal`, once tasks are completed, the agent MUST immediately output `<!-- GOAL_COMPLETE -->` and end the turn.
- NEVER run continuous open-ended audit or inspection loops.

