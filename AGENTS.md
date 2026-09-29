# AGENTS.md — pod-charly-hooks

Standalone candy repo for the `charly-hooks` candy — the harness gate-hook
entities. The entire candy lives in `charly.yml` at the repo root: the
`charly-hooks` concept candy (no install content) plus the `hook:` entities
(`pre-commit-gate`, `pre-push-gate`, `gitcmd`, `gate-test`) and the
`marketplace:` entity that `candy/plugin-marketplace` emits into `.claude/hooks/`
and `.claude/settings.json`. There is no source tree — the emitted scripts ARE
the entity content.

Canonical files:

- `charly.yml` — the `charly-hooks` candy entity plus the four `hook:` entities
  and the `marketplace:` entity.
- `.github/workflows/tag-on-merge.yml` — CalVer tag + `CHANGELOG/` on merge.
- `CHANGELOG/` — per-CalVer history.
- `README.md` — user overview only; never agent guidance.

## Load these skills first (R0)

- `/charly-internals:agents` — the owning procedure: the hooks doctrine and the
  current hook inventory. Load before editing, building, deploying, or
  troubleshooting this candy.
- `/charly-internals:git-workflow` — before any git/PR action.
- `/charly-image:layer` — the candy authoring reference (`charly.yml` schema,
  `plan:` step verbs, service declarations) when editing an entity.

The candy carries no `skill:` entity of its own; the owning procedure is
`/charly-internals:agents`. The gap is routed to the named skill-authoring batch
[opencharly/opencharly#291](https://github.com/opencharly/opencharly/issues/291);
when that lands, add the owning skill here.

## Build / validate / test

- `charly box validate` at the repo root — the structural check: the manifest
  must parse and validate at the installed charly.
- The merge gate is the **org-wide** `charly/pr-validator` (required check
  `validate / validate`, defined in `opencharly/.github`); this repo has **no**
  per-repo candy gate. Its only workflow file is
  `.github/workflows/tag-on-merge.yml`.
- The behavioral tests for the gates are `gate-test` (emitted as
  `.claude/hooks/gate_test.py`); the byte-identical emission is proven by the
  marketplace plugin's generate test and the R10 bed.

## Modify this repo

- Edit the `hook:` entity content in `charly.yml` — the entity is the source; the
  emitted `.claude/hooks/*` scripts are generated and must not be hand-edited.
- Keep the entity content byte-identical to what the generator emits; a drift is
  a `charly task harness` failure downstream.
- Attribution, change class, and R0–R10 proof belong to the `pr-validator`; do
  not add them to a gate script.

## Landing

- PR-only. Every change lands through a pull request; the org-required
  `charly/pr-validator` validates the diff and body and arms native auto-merge
  on PASS. Direct pushes to `main` are blocked.
- History lives in `CHANGELOG/` (written by `tag-on-merge` at merge time); the
  PR body IS the changelog.
- The authoritative rulebook is the umbrella `AGENTS.md` in
  `opencharly/opencharly` and `charly/AGENTS.md` in the charly repo. Do not
  restate its rules here.
