Analyze the current session for mistakes and update documentation to prevent future occurrences.

## Analysis Process

### Step 1: Review Session History

Look through the conversation for:
- Build failures and their root causes
- Lint errors that were fixed
- Format issues that were corrected
- Incorrect assumptions about the codebase
- Components or patterns used incorrectly
- Missing imports or dependencies
- Type errors
- Runtime errors

### Step 2: Categorize Each Mistake

For each issue found, determine the category:
- `build` - Build/compilation failures
- `lint` - ESLint rule violations
- `format` - Prettier formatting issues
- `type` - TypeScript type errors
- `component` - Incorrect component usage
- `pattern` - Wrong architectural pattern
- `assumption` - Incorrect assumption about codebase
- `dependency` - Missing or wrong dependencies

### Step 3: Document the Lesson

For each mistake, create an entry with:
1. **Date** - Today's date
2. **Category** - From the list above
3. **Mistake** - What went wrong
4. **Fix** - How it was resolved
5. **Prevention Rule** - How to avoid this in the future

### Step 4: Update Documentation

1. **Append to `.claude/mistakes.jsonl`:**
```json
{"date": "2024-01-15", "category": "component", "mistake": "description", "fix": "solution", "rule": "prevention"}
```

2. **Append to `docs/LESSONS.md`:**
```markdown
## YYYY-MM-DD - Brief Title

**Category:** [category]

**Mistake:** [what went wrong]

**Fix:** [how it was resolved]

**Prevention Rule:** [rule to follow]
```

3. **If the lesson is critical**, propose an update to:
   - `docs/CONVENTIONS.md` for code patterns
   - `.claude/CLAUDE.md` for key conventions

### Step 5: Summarize

Provide a summary:
- Number of lessons captured
- Categories affected
- Any documentation updates made
- Recommendations for the developer

## Example Output

```
## Session Analysis Complete

### Lessons Captured: 2

1. **Component Context Issue** (component)
   - Used Dialog directly in Astro, causing context break
   - Rule: Wrap context-dependent shadcn components in React wrapper

2. **Missing Import Alias** (pattern)
   - Used relative import instead of @/ alias
   - Rule: Always use @/ prefix for src imports

### Documentation Updated:
- ✅ Appended to docs/LESSONS.md
- ✅ Appended to .claude/mistakes.jsonl
- ⚠️ Consider adding to CONVENTIONS.md: Component wrapper rule
```

## If No Mistakes Found

If the session had no errors or issues:
- Confirm the session was clean
- Note any good patterns that were followed
- Suggest the developer run `/validate` to confirm
