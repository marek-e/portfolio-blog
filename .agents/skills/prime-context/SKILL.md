---
name: prime-context
description: Use only when the user explicitly asks to prime context from project guidelines and coding standards
allowed-tools: Bash(find *), Bash(sed *)
---

Read `README.md` and `AGENTS.md`.

Here are all standards of our codebase. These include architectural patterns and high-level coding standards but also very important and specific coding conventions such as when and how to write comments, naming conventions for files, classes, methods, variables, etc.

Read the files under `docs/standards/` when that directory exists.

Follow the project standards strictly. Verify that all code adheres to the documented standards before considering a task complete.

For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.

Just reply "Ready!" then continue what you were doing.
