# pod-charly-hooks

The harness gate-hook candy of the OpenCharly candy library, as a standalone
repo (the candy de-submodule cutover, kind-prefixed naming). This candy owns the
`hook:` entities that become the `.claude/hooks/*` git-discipline scripts and
their `.claude/settings.json` wiring.

## What it provides

| Entity | Kind | Emitted as |
|---|---|---|
| `charly-hooks` | `candy` | the concept candy (no install content of its own) |
| `pre-commit-gate` | `hook` | `.claude/hooks/pre-commit-gate.sh` |
| `pre-push-gate` | `hook` | `.claude/hooks/pre-push-gate.sh` |
| `gitcmd` | `hook` | `.claude/hooks/gitcmd.py` (shared parser) |
| `gate-test` | `hook` | `.claude/hooks/gate_test.py` (behavioral tests) |
| `marketplace` | `marketplace` | the `charly-plugins` marketplace metadata |

The two gates are **deterministic command-mechanics backstops**, not security
boundaries:

- `pre-commit-gate.sh` blocks `git commit --no-verify` / `-n`, a
  `core.hooksPath` override, untokenizable commit commands, staged Go modules
  that are not `golangci-lint` clean, and the ZERO-ALIASES declaration forms
  (a new `charly/*_aliases.go`, or a kit-alias declaration line).
- `pre-push-gate.sh` blocks a force-push (`--force` / `--force-with-lease` /
  `-f` / a leading `+` refspec), a hook bypass, and a direct push to `main`.

Attribution, change class, CHANGELOG coverage, architecture, and all R0–R10
proof are judged once by the fresh `charly/pr-validator` at merge — deliberately
absent from these hooks so two policy implementations cannot drift.

## How it is consumed

The hook scripts are **generated from these entities**, never hand-edited:

```bash
charly marketplace generate --root <marketplace-checkout> --out <marketplace-checkout>
```

`candy/plugin-marketplace` (the `command:marketplace` provider) emits the scripts
to `.claude/hooks/` and regenerates the `.claude/settings.json` hook entries.
The entities carry the same content the emitted scripts do, so a change is made
here and regenerated downstream.

## Layout

- `charly.yml` — the `charly-hooks` candy entity plus the four `hook:` entities
  and the `marketplace:` entity.
- `.github/workflows/tag-on-merge.yml` — CalVer tag + `CHANGELOG/` on merge.
- `CHANGELOG/` — per-CalVer history.
- `README.md` — this user overview.

## Related

- Owning procedure: `/charly-internals:agents` — the hooks doctrine and the
  current hook inventory.
- `/charly-internals:git-workflow` — the landing discipline the push gate
  backstops.
- [`opencharly/charly`](https://github.com/opencharly/charly) — the charly CLI and image builder
- [`opencharly/opencharly`](https://github.com/opencharly/opencharly) — the umbrella
