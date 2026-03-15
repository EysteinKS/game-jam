---
name: pull-request
description: Create a GitHub pull request from the current branch
---

Create a pull request for the current work.

## Steps

1. **Check git status**: `git status` and `git log --oneline main..HEAD`
2. **Verify suite passes**: `npm run build && npm run test -- --run && npm run lint`
3. **Determine PR title and body** from:
   - `plan.md` if it exists (use the plan title and phase summaries)
   - `git log` commit messages if no plan exists
4. **Create the PR** using `gh pr create` with a well-structured body:

```
## Summary
- [bullet 1]
- [bullet 2]

## Changes
- [file or feature 1]
- [file or feature 2]

## Test plan
- [ ] `npm run build` passes
- [ ] `npm run test -- --run` passes
- [ ] `npm run lint` passes
- [ ] [manual test steps if applicable]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

5. **Output the PR URL** when done

## Notes

- If there are uncommitted changes, commit them first (with user approval)
- If there is no upstream branch, push with `-u origin HEAD`
- Target branch is always `main`
