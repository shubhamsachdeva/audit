# Audit

Audit an AI master's degree for free. The curricula of top AI programs, mapped to free lectures, with progress tracking.

## Run locally

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What you get

- **Three paths** — Sprint (8 weeks), Builder (6–9 months), Master's (2 years)
- **Embedded YouTube** — lecture series play inside the app; mark each lecture done
- **External resources** — Coursera audits, free books, assignments open in a new tab; log progress when you return
- **Progress in this browser** — streaks, heatmap, export/import JSON (no login yet)
- **Programs we mapped** — tuition + course lists from Stanford, CMU, MIT-adjacent, Cambridge, ETH, IITs and more, each linked to free equivalents

## Verify YouTube links

```bash
cd app
node scripts/verify-youtube.ts
```

## Research

The curriculum deep-dive that feeds the syllabus lives in [`../research/`](../research/).

## Stack

Vite, React 19, TypeScript, Tailwind CSS 4, React Router, Zustand, Phosphor icons.
