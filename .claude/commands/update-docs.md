Refresh documentation based on the current codebase state.

## Update Process

### Step 1: Scan Components

Read all files in `src/components/ui/` and update `docs/COMPONENTS.md`:

1. List all available components
2. Check which are context-dependent (use React Context)
3. Document variants and sizes from the source
4. Update the component table

### Step 2: Verify Architecture

Compare `docs/ARCHITECTURE.md` against actual structure:

1. Check if directory structure is accurate
2. Verify listed pages exist
3. Update any new directories or patterns
4. Note any structural changes

### Step 3: Check Conventions

Review `docs/CONVENTIONS.md` against actual code patterns:

1. Scan imports to verify alias usage
2. Check component naming conventions
3. Verify Tailwind patterns match documentation
4. Look for undocumented patterns that should be added

### Step 4: Update CLAUDE.md

Ensure `.claude/CLAUDE.md` reflects current state:

1. Verify tech stack is accurate
2. Check command list is complete
3. Update any outdated conventions
4. Ensure lessons section references latest

### Step 5: Report Findings

Provide a report:

```
## Documentation Sync Report

### Components (docs/COMPONENTS.md)
- ✅ 15 components documented
- ⚠️ New component found: Sheet (not documented)
- Action: Added Sheet to component table

### Architecture (docs/ARCHITECTURE.md)
- ✅ Directory structure matches
- ⚠️ New page: /about (not documented)
- Action: Added to pages list

### Conventions (docs/CONVENTIONS.md)
- ✅ Import patterns consistent
- ✅ Naming conventions followed
- No updates needed

### Agent Context (CLAUDE.md)
- ✅ Tech stack accurate
- ✅ Commands up to date
- No updates needed

### Summary
- Files updated: 2
- New items documented: 3
- Inconsistencies fixed: 1
```

## When to Run

Run this command:
- After adding new components
- After creating new pages
- After significant refactoring
- Before starting a new major feature
- Periodically to ensure docs stay current
