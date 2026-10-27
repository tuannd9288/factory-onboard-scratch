# parcel-notes

parcel-notes turns a courier's free-text delivery notes into the one-line summaries on the depot's morning sheet. It
is a small Node module that the depot's laptop runs each dawn; the two depot clerks read its output and nothing else.

## Commands

| Command | What it does |
|---|---|
| `scripts/setup` | checks Node, points git at `.githooks`; run it once per clone |
| `scripts/verify` | the size rule, then every test; ends on `verify: 2 steps passed` |
| `scripts/verify --fast` | the size rule only; the pre-commit hook runs it |

## Layout

- `src/notes.mjs`: `summarize` and `countDelivered`, the whole product.
- `test/`: Node's built-in test runner, one file for each source file.
- `scripts/`: `verify` and the `size.mjs` it calls, and `setup`.
- `.githooks/`: `pre-commit` runs the fast half of `scripts/verify`; `pre-push` refuses a push to `main`.
- `.claude/settings.json`: the plugin pin and the commands an agent may not run.

## Rules and what enforces them

| Rule | Enforced by |
|---|---|
| No file in `src/` longer than 60 lines | `scripts/size.mjs`, run by `scripts/verify` |
| Every behaviour has a test that fails without it | `scripts/verify` runs them all; review reads the diff |
| Nothing is pushed straight to `main` | `.githooks/pre-push` |
| A summary never passes the sheet's width of 72 characters | `test/notes.test.mjs` |

A rule with nothing to enforce it goes in this table as `prose` and gets a tool or is deleted.

## Building and review

Work on a branch and open a pull request. Run `scripts/verify` before you push. A reviewer who did not write the change
reads the diff; the clerks' sheet is the only deploy, and the depot manager decides when it changes.

## Facts the code cannot tell

- The sheet is 72 characters wide because the depot's printer cuts there (decided by the depot manager, 2026-09-02).
- A note that says "delivered" in any case counts as a delivery; the courier app has no status field of its own.
- The laptop has Node 22 and no network at dawn, so nothing here may fetch anything.
