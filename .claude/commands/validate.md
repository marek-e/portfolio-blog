Run validation checks to verify the codebase is correct.

## Validation Steps

Execute these commands in sequence, stopping on first failure:

### 1. Format Check
```bash
pnpm format:check
```
If this fails, run `pnpm format` to fix formatting issues.

### 2. Lint Check
```bash
pnpm lint
```
If this fails, review the errors and fix them. Common issues:
- Unused variables
- Missing dependencies in useEffect
- TypeScript type errors

### 3. Build Check
```bash
pnpm build
```
If this fails, check for:
- Import errors
- Missing dependencies
- Content collection schema mismatches
- TypeScript compilation errors

## Success Criteria

All three commands must pass with exit code 0.

## On Failure

Report:
1. Which step failed
2. The specific error message
3. The file(s) involved
4. A suggested fix

## On Success

Confirm all checks passed and the build is ready for deployment.
