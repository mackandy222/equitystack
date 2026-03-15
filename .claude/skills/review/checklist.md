# Pre-Landing Review Checklist

## Instructions

Review the `git diff origin/main` output for the issues listed below. Be specific — cite `file:line` and suggest fixes. Skip anything that's fine. Only flag real problems.

**Two-pass review:**
- **Pass 1 (CRITICAL):** Run SQL & Data Safety and LLM Output Trust Boundary first. These can block `/ship`.
- **Pass 2 (INFORMATIONAL):** Run all remaining categories. These are included in the PR body but do not block.

**Output format:**

```
Pre-Landing Review: N issues (X critical, Y informational)

**CRITICAL** (blocking /ship):
- [file:line] Problem description
  Fix: suggested fix

**Issues** (non-blocking):
- [file:line] Problem description
  Fix: suggested fix
```

If no issues found: `Pre-Landing Review: No issues found.`

Be terse. For each issue: one line describing the problem, one line with the fix. No preamble, no summaries, no "looks good overall."

---

## Review Categories

### Pass 1 — CRITICAL

#### SQL & Data Safety
- String interpolation in SQL queries (use parameterised queries or ORM methods)
- TOCTOU races: check-then-set patterns that should be atomic
- Bypassing validations on fields that have or should have constraints
- N+1 queries: missing eager loading for associations used in loops

#### Race Conditions & Concurrency
- Read-check-write without uniqueness constraint or retry on conflict
- Status transitions that don't use atomic WHERE + UPDATE — concurrent updates can skip or double-apply transitions
- XSS via unsanitised user input rendered in HTML

#### LLM Output Trust Boundary
- LLM-generated values (emails, URLs, names) written to DB or passed to services without format validation. Add lightweight guards before persisting.
- Structured tool output (arrays, objects) accepted without type/shape checks before database writes.

### Pass 2 — INFORMATIONAL

#### Conditional Side Effects
- Code paths that branch on a condition but forget to apply a side effect on one branch.
- Log messages that claim an action happened but the action was conditionally skipped.

#### Magic Numbers & String Coupling
- Bare numeric literals used in multiple files — should be named constants
- Error message strings used as query filters elsewhere

#### Dead Code & Consistency
- Variables assigned but never read
- Comments/docstrings that describe old behavior after the code changed

#### LLM Prompt Issues
- 0-indexed lists in prompts (LLMs reliably return 1-indexed)
- Prompt text listing available tools/capabilities that don't match what's actually wired up
- Word/token limits stated in multiple places that could drift

#### Test Gaps
- Negative-path tests that assert type/status but not the side effects
- Assertions on string content without checking format
- Security enforcement features without integration tests verifying the enforcement path

#### Type Coercion at Boundaries
- Values crossing TypeScript→JSON→client boundaries where type could change
- Hash/digest inputs that don't normalise types before serialization

---

## Gate Classification

```
CRITICAL (blocks /ship):          INFORMATIONAL (in PR body):
├─ SQL & Data Safety              ├─ Conditional Side Effects
├─ Race Conditions & Concurrency  ├─ Magic Numbers & String Coupling
└─ LLM Output Trust Boundary      ├─ Dead Code & Consistency
                                   ├─ LLM Prompt Issues
                                   ├─ Test Gaps
                                   └─ Type Coercion at Boundaries
```

---

## Suppressions — DO NOT flag these

- "X is redundant with Y" when the redundancy is harmless and aids readability
- "Add a comment explaining why this threshold/constant was chosen" — thresholds change during tuning, comments rot
- "This assertion could be tighter" when the assertion already covers the behavior
- Suggesting consistency-only changes
- Harmless no-ops
- ANYTHING already addressed in the diff you're reviewing — read the FULL diff before commenting
