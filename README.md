<img width="100%" alt="eve Software Factory Banner" src=".github/banner.png" />

# eve Software Factory

[![Docs](https://img.shields.io/badge/Documentation-000?style=flat-square&logo=readthedocs&logoColor=FFF&labelColor=000&color=000)](https://vercel.com/kb/guide/eve-software-factory)
[![Agent Stack](https://img.shields.io/badge/Agent%20Stack-000?style=flat-square&logo=vercel&logoColor=FFF&labelColor=000&color=000)](https://vercel.com/kb/agent-stack)
[![MIT License](https://img.shields.io/badge/License-MIT-000?style=flat-square&logo=opensourceinitiative&logoColor=white&labelColor=000&color=000)](LICENSE)

Meet **Foreman**, an eve software factory that puts AI agents on every stage of the development loop and keeps people on the judgment calls.

Foreman takes tasks from GitHub, moves each one through four stations, and delivers a reviewed draft pull request on the target repository. A person reviews, marks it ready, and merges.

This deployment ran Foreman against [sulcer/cluide](https://github.com/sulcer/cluide) on the Vercel Hobby plan and the AI Gateway free tier, with GitHub as the only work source and a KERNEL cloud browser for web pages.

## How it works

- **Classifier** triages the task: type, priority, complexity, actionable or not. When the task isn't actionable, Foreman asks the requester instead of building the wrong thing.
- **Analyst** turns it into a plan with acceptance criteria, working from a live checkout of the repository.
- **Implementer** executes the plan in its own sandbox, verifies with the repo's own checks, and pushes a branch.
- **Reviewer** independently judges everything against the real diff, with evidence for each verdict.

Each station is its own agent with its own instructions, sandbox, and tools. The Reviewer sees only the pushed branch, never the Implementer's reasoning. Between runs, Foreman keeps a **factory brain**: notes about the repository that every run starts from. See [ARCHITECTURE.md](.github/ARCHITECTURE.md) for the full picture.

## How work arrives

- **Label an issue `factory`.** The pipeline runs on its own, posts progress as stations complete, and ends with a draft PR linked to the issue.
- **@mention it on an issue or PR.** Mentions from repo owners, members, and collaborators start an interactive session.
- **The dev TUI.** Hand it a task locally. Changes to GitHub wait for your approval.
- **Red CI on a factory PR.** Foreman diagnoses the failure and pushes a fix to its own branches, never yours.
- **Someone opens a pull request.** Foreman posts one orienting comment for reviewers: a summary, not a review.

## Setup

Everything was provisioned from the Vercel CLI:

```bash
vercel link
vercel env add FACTORY_REPO -e production,preview,development --value sulcer/cluide --no-sensitive -y
vercel blob create-store foreman-blob --access public --yes
vercel connect create github --name foreman-agent --triggers --trigger-path /eve/v1/github \
  --trigger-event issues --trigger-event issue_comment --trigger-event pull_request \
  --trigger-event pull_request_review_comment --trigger-event check_suite -y
vercel connect create kernel --name kernel-mcp --connection-method mcp
vercel connect attach kernel/kernel-mcp
```

Two things must line up before Foreman can do any real work. `FACTORY_REPO` must name a real repository in `owner/repo` format, and the GitHub App behind the connector must be installed with access to that repository. A station's sandbox clones `FACTORY_REPO` on its first session, not at deploy time, so a repository the app cannot reach surfaces as a `Cannot access <owner/repo>` error on the first task, not at deploy.

`KERNEL_API_KEY` stays unset everywhere: the browser authenticates each user through Vercel Connect.

Configuration (see `.env.example`):

| Variable | Required | Default | What it does |
| --- | --- | --- | --- |
| `FACTORY_REPO` | Yes | — | An existing GitHub repository in `owner/repo` format; the GitHub App must have access to it (a station's first session fails otherwise) |
| `FACTORY_SETUP_COMMAND` | No | — | Runs once per session inside the station sandbox checkout (e.g. `pnpm install`). The sandbox has no Bun, so leave it unset for a Bun repository like cluide |
| `FACTORY_LABEL` | No | `factory` | The issue label that hands an issue to the factory |
| `FACTORY_BRANCH_PREFIX` | No | `factory/` | Branch prefix marking the factory's own PRs, which are the only branches automated CI fixes touch |
| `FACTORY_BOT_NAME` | No | the GitHub App's slug | The `@mention` name, resolved from the connector automatically when unset |
| `GITHUB_CONNECTOR` | No | `github/foreman-agent` | The Vercel Connect connector UID |

## What this setup changed

- [#1](https://github.com/sulcer/eve-software-factory/pull/1) removed the Linear integration: GitHub is the only work source.
- [#2](https://github.com/sulcer/eve-software-factory/pull/2) moved every station to free-tier models: `google/gemini-2.5-flash` for the orchestrator, analyst, implementer and researcher, `openai/gpt-oss-120b` for the classifier and reviewer.
- [#3](https://github.com/sulcer/eve-software-factory/pull/3) added the KERNEL cloud browser in `agent/extensions/kernel/`. Its `connections/browser.ts` asks for approval once per tool per session and allows only the seven default tools.
- [#4](https://github.com/sulcer/eve-software-factory/pull/4) added the `count_open_issues` tool.
- [#5](https://github.com/sulcer/eve-software-factory/pull/5) added the `release-notes` skill.
- The `feat/daily-triage-schedule` branch holds a read-only weekday triage digest. It stays unmerged so it never runs.

## What ran

- **Browser:** from the TUI, the KERNEL browser opened example.com and returned its title, "Example Domain".
- **Evals:** smoke 15/15, write-requires-approval 3/3, factory-brain-write-parks 3/3, read-only-question 15/15. Gates graded by the judge model fail on the free tier.
- **Tool and skill:** `count_open_issues` returned the live count from cluide. The `release-notes` skill loaded on 2 of 3 phrasings with Gemini 2.5 Flash.
- **Pipeline:** an issue labeled `factory` on cluide reached the analyst and implementer, then stopped on rate limits.

## Free-tier limits

- Only five models are free, and the stations' original models aren't among them.
- Each model allows 5 requests per minute, and eve has no model retry setting, so a full pipeline run doesn't finish.
- The eval judge model, `typesafe-ai/jev`, is paid-only.

## Local development

Link the project, pull its environment, and start the TUI:

```bash
vercel link
vercel env pull
pnpm dev
```

Hand the agent a task ("users report the password reset email arrives twice, fix it") and watch the four stations fire in order, ending in a draft PR on `FACTORY_REPO`. Local runs are treated as untrusted, so changes to GitHub wait for your approval in the TUI.

Run the CLI through `pnpm exec eve` (`npx eve` can fetch a different eve release). `pnpm exec eve traces list` shows each run's tool calls, and `pnpm exec eve eval <ids> --url http://127.0.0.1:2000` runs evals against the dev server.

## Status

The deployment was retired on 2026-11-01. The code stays here as a record of the setup.

## Resources

- [eve Software Factory guide](https://vercel.com/kb/guide/eve-software-factory)
- [Vercel Connect](https://vercel.com/docs/connect)
- [eve Documentation](https://eve.dev/docs/introduction)
- [GitHub Tools eve Extension](https://github-tools.com/frameworks/eve-extension)
- [KERNEL eve Extension](https://www.npmjs.com/package/@onkernel/eve-extension)
