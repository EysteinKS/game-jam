---
name: execute-plan
description: Execute the next incomplete phase of the current plan.md
---

Read `plan.md` from the project root. Find the first phase that has not been completed (phases are marked complete when all verification checklist items are checked off, or when a "✅ Complete" marker exists).

## Execution Process

1. **Read `plan.md`** — identify the next incomplete phase
2. **Announce** which phase you are executing and what files will be created/modified
3. **Implement** all files for that phase exactly as specified in the plan
4. **Verify** by running: `npm run build && npm run test -- --run && npm run lint`
5. **Fix** any errors that arise — do not move on until verification passes
6. **Mark the phase complete** in `plan.md` by adding `✅ Complete` after the phase header
7. **Report** what was done and what the next phase will be

## Important Rules

- Execute exactly ONE phase per invocation
- Do not skip ahead even if phases seem simple
- If verification fails, diagnose and fix before marking complete
- Follow all project conventions (named exports, tabs, strict TypeScript, no `any`, `cn()` for class names)
- All new hooks must have co-located test files
- After completing the final phase, confirm the full suite passes and suggest creating a PR with `/pull-request`
