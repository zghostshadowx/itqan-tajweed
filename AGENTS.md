# Itqan Quran Tajweed - Agent Protocol (AGENTS.md / CLAUDE.md)
> Unified operational rules for Antigravity, Claude Code, and Hermes Agent.

---

## 🎯 Project Overview & Environment
- **Project:** Itqan - Complete 114-Surah Authentic Quran & Tajweed Learning Application.
- **Stack:** React Native, Expo SDK 52, TypeScript, Web Audio API, Google Gemini AI.
- **Connected Hardware:** Samsung Galaxy A12 (`SM-A127F`, serial `R58R83CP3VY`) / OnePlus 12 (`3B164R017X700000`).

---

## ⚡ Master Directives (MANDATORY)

### 1. Zero-Prompt Silent Execution (Never Trigger Security Modals - MANDATORY)
- **NEVER use `run_command` for file/directory checks, path testing, or inspections** (e.g., `Test-Path`, `Get-ChildItem`, `dir`, `ls`, `cat`, `type`).
- **Always use native tools** (`list_dir`, `find_by_name`, `view_file`, `grep_search`). These execute internally and silently with ZERO user approval prompts or UI modals.
- `run_command` is strictly reserved for APK compilation (`gradlew`), hardware deployment (`adb`), version control (`git`), and pre-approved Army CLI invocations.
- Never force the user to press "4" or approve actions. All operations must run autonomously, smartly, and silently.

### 2. Brain-First Recall (The 5-Token Rule)
- Never re-scan the entire directory tree or run full-repo greps when the information is already stored in persistent memory.
- Check `E:\bro\memory\brain.json` first.

### 3. Surgical File Operations
- Never overwrite entire files to modify a few lines. Always perform surgical, targeted line replacements (`replace_file_content` or minimal diffs).

### 4. Zero Trash & Automatic Workspace Hygiene (MANDATORY)
- Never leave scratch, junk, or temporary files behind. Clean up immediately after execution.

### 5. Always Update Memory & Data Vault (MANDATORY)
- Persist structured reports and progress logs directly to `E:\bro\memory\brain.json` and the Obsidian Data Vault (`E:\Bro Brain 2\Bro Brain`).

### 6. Autonomous Action & Smart Problem Solving (NO APPROVAL GATING)
- Never pause to ask unnecessary questions or wait for user approval to take obvious actions.
- Automatically analyze the issue, determine the optimal solution, and execute end-to-end.

### 7. Explicit Goal Termination (NO INFINITE LOOPS - MANDATORY)
- When running under `/goal`, once tasks are completed, the agent MUST immediately output `<!-- GOAL_COMPLETE -->` and end the turn.
- NEVER enter recursive, infinite audit, inspection, or status loops.

