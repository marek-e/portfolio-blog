---
name: fix-pr-comments
description: Fetch unresolved PR/MR comments and create a plan to address them
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(gh *), Bash(glab *), Bash(tsx *), Bash(./skills/fix-pr-comments/*)
---

Task: Get all unresolved comments from the current branch's merge/pull request and create a plan to address them.

Arguments: $ARGUMENTS

## Platform Detection

Git remote: !`git remote get-url origin`
GitHub auth: !`gh auth status 2>&1`
GitLab auth: !`glab auth status 2>&1`

Based on the remote URL above:

- If it contains "github":
  - First check the GitHub auth output above. If it shows "Failed to log in" or "not logged in", stop immediately and tell the user to run `gh auth login`
  - Otherwise run: `github-pr-comments.ts $ARGUMENTS`
- If it contains "gitlab":
  - First check the GitLab auth output above. If it shows authentication errors, stop immediately and tell the user to run `glab auth login`
  - Otherwise run: `gitlab-mr-comments.ts $ARGUMENTS`
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
