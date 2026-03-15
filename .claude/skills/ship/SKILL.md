---
name: ship
version: 1.0.0
description: |
  Ship workflow: merge main, run tests, review diff, commit, push, create PR.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Ship: Fully Automated Ship Workflow

You are running the `/ship` workflow. This is a **non-interactive, fully automated** workflow. Do NOT ask for confirmation at any step. The user said `/ship` which means DO IT. Run straight through and output the PR URL at the end.

**Only stop for:**
- On `main` or `master` branch (abort)
- Merge conflicts that can't be auto-resolved (stop, show conflicts)
- Test failures (stop, show failures)
- Pre-landing review finds CRITICAL issues and user chooses to fix (not acknowledge or skip)

**Never stop for:**
- Uncommitted changes (always include them)
- Commit message approval (auto-commit)
- CHANGELOG content (auto-generate from diff)

---

## Step 1: Pre-flight

1. Check the current branch. If on `main` or `master`, **abort**: "You're on main. Ship from a feature branch."

2. Run `git status` (never use `-uall`). Uncommitted changes are always included — no need to ask.

3. Run `git diff main...HEAD --stat 2>/dev/null || git diff master...HEAD --stat` and `git log main..HEAD --oneline 2>/dev/null || git log master..HEAD --oneline` to understand what's being shipped.

---

## Step 2: Merge origin/main (BEFORE tests)

Fetch and merge `origin/main` (or `origin/master`) into the feature branch so tests run against the merged state:

```bash
git fetch origin main 2>/dev/null && git merge origin/main --no-edit || git fetch origin master && git merge origin/master --no-edit
```

**If there are merge conflicts:** Try to auto-resolve if they are simple. If conflicts are complex or ambiguous, **STOP** and show them.

**If already up to date:** Continue silently.

---

## Step 3: Run tests (on merged code)

Run the test suite:

```bash
bun test 2>&1 | tee /tmp/ship_tests.txt
```

After tests complete, read the output and check pass/fail.

**If any test fails:** Show the failures and **STOP**. Do not proceed.

**If all pass:** Continue silently — just note the counts briefly.

---

## Step 3.5: Pre-Landing Review

Review the diff for structural issues that tests don't catch.

1. Read `.claude/skills/review/checklist.md`. If the file cannot be read, **STOP** and report the error.

2. Run `git diff origin/main 2>/dev/null || git diff origin/master` to get the full diff.

3. Apply the review checklist in two passes:
   - **Pass 1 (CRITICAL):** SQL & Data Safety, LLM Output Trust Boundary
   - **Pass 2 (INFORMATIONAL):** All remaining categories

4. **Always output ALL findings** — both critical and informational.

5. Output a summary header: `Pre-Landing Review: N issues (X critical, Y informational)`

6. **If CRITICAL issues found:** For EACH critical issue, use a separate AskUserQuestion with:
   - The problem (`file:line` + description)
   - Your recommended fix
   - Options: A) Fix it now (recommend), B) Acknowledge and ship anyway, C) It's a false positive — skip
   After resolving all critical issues: if the user chose A (fix) on any issue, apply the recommended fixes, then commit only the fixed files, then **STOP** and tell the user to run `/ship` again to re-test with the fixes applied. If only B/C were chosen, continue.

7. **If only non-critical issues found:** Output them and continue.

8. **If no issues found:** Output `Pre-Landing Review: No issues found.` and continue.

---

## Step 4: Commit

1. Stage all changes: `git add -A`

2. Compose a commit message from the diff:
   - First line: `<type>: <summary>` (type = feat/fix/chore/refactor/docs)
   - Body: brief description of what this commit contains
   - Co-author trailer:

```bash
git commit -m "$(cat <<'EOF'
<type>: <summary>

<body>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Step 5: Push

Push to the remote with upstream tracking:

```bash
git push -u origin $(git branch --show-current)
```

---

## Step 6: Create PR

Create a pull request using `gh`:

```bash
gh pr create --title "<type>: <summary>" --body "$(cat <<'EOF'
## Summary
<bullet points summarising the changes>

## Pre-Landing Review
<findings from Step 3.5, or "No issues found.">

## Test plan
- [x] All tests pass (N tests)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Output the PR URL** — this should be the final output the user sees.

---

## Important Rules

- **Never skip tests.** If tests fail, stop.
- **Never skip the pre-landing review.** If checklist.md is unreadable, stop.
- **Never force push.** Use regular `git push` only.
- **Never ask for confirmation** except for CRITICAL review findings (one AskUserQuestion per critical issue with fix recommendation).
- **The goal is: user says `/ship`, next thing they see is the review + PR URL.**
