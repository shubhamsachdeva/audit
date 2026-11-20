# Audit — the AI master's, for free

A local learning platform that maps the curricula of top AI master's programs onto free lectures, books and courses, with progress tracking.

## Quick start

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What's inside

| Path | Length | For |
| --- | --- | --- |
| **Sprint** | 8 weeks | Job-ready applied AI / ML engineer |
| **Builder** | 6–9 months | Intermediate depth + portfolio |
| **Master's** | 2 years | Full free equivalent of a top AI MSc |

- YouTube lecture series play **inside** the app; mark lectures one by one
- External courses/books open in a new tab; log chapters/units when you return
- Progress, notes and streaks live in **this browser** (export/import JSON) — no login yet
- **Programs we mapped** shows tuition + course lists from 23 programs, each linked to free equivalents

## Research

Deep curriculum research lives in [`research/`](./research/):

- US programs (Stanford, CMU, MIT-adjacent, Berkeley, GT, UT, Columbia, JHU, NYU, Harvard, …)
- International programs (Oxford, Cambridge, Imperial, UCL, Edinburgh, ETH, EPFL, UvA, IITs, …)
- Canonical curriculum synthesis and free-resource catalog

## Verify YouTube links

```bash
cd app
npm run verify:youtube
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router · Zustand · Phosphor icons

UI direction from Anthropic's `frontend-design` skill + UI UX Pro Max (with a custom "highlighter notebook" aesthetic instead of the default kids-education palette).
