---
name: fix-pr-comments
description: Use only when the user explicitly asks to fetch unresolved PR or MR comments and plan fixes
allowed-tools: Bash(git *), Bash(gh *), Bash(glab *), Bash(tsx *)
---

Task: Get all unresolved comments from the current branch's merge/pull request and create a plan to address them.

Use any pull request or merge request identifier supplied with the skill invocation.

## Platform Detection

Run `git remote get-url origin` to detect the hosting platform. Then run the
matching authentication check: `gh auth status` for GitHub or `glab auth
status` for GitLab.

Based on the remote URL above:

- If it contains "github":
  - If GitHub authentication fails, stop immediately and tell the user to run `gh auth login`
  - Otherwise run `.agents/skills/fix-pr-comments/github-pr-comments.ts`, passing any identifier supplied by the user
- If it contains "gitlab":
  - If GitLab authentication fails, stop immediately and tell the user to run `glab auth login`
  - Otherwise run `.agents/skills/fix-pr-comments/gitlab-mr-comments.ts`, passing any identifier supplied by the user
- Otherwise → inform the user that only GitHub and GitLab are supported

## Instructions

1. Run the appropriate script based on the detected platform (see above)
2. Analyze all unresolved comments and their code context
3. Enter plan mode and create a comprehensive plan to address each comment:
   - Group related comments by file or concern
   - For each comment, describe what changes are needed
   - Consider if changes require updates to tests
   - Check if changes affect other parts of the codebase
   - Follow existing code patterns and conventions in the project
4. Present the plan to the user for approval before implementing

If there are no unresolved comments, inform the user that all comments have been resolved.

## Rules

- Always read the code context provided by the script
- Consider the reviewer's intent, not just literal wording
- Maintain code coherence with existing patterns
- Update tests if business logic changes

For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
