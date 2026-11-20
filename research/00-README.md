# Research behind Audit

This folder is the curriculum deep-dive that the product is built from.

| File | Contents |
| --- | --- |
| [01-us-programs.md](./01-us-programs.md) | Course-level curricula for top U.S. AI/ML master's programs (Stanford, CMU, MIT-adjacent, Berkeley, Georgia Tech, UT Austin, Columbia, JHU, NYU, Harvard, UW, Penn), with tuition, syllabi, and which lectures are free |
| [02-international-programs.md](./02-international-programs.md) | Same for UK, Europe, Canada, Asia and India (Oxford, Cambridge, Imperial, UCL, Edinburgh, ETH, EPFL, UvA, TUM, Tübingen, Toronto, Mila, NUS, Tsinghua, KAIST, IISc, IITM, IITH, IIITH, IITD) |
| [03-canonical-curriculum.md](./03-canonical-curriculum.md) | The synthesized "canonical AI master's" and how Audit's three paths cover it |
| [04-free-resources.md](./04-free-resources.md) | Free resource catalog with verified YouTube IDs |

The live syllabus the app serves is `app/src/data/` (`resources.ts`, `modules.ts`, `paths.ts`, `programs.ts`).

## How to re-verify YouTube links

```bash
cd app
node scripts/verify-youtube.ts
```

All 43 YouTube playlists/videos in the current catalog returned OK as of the last run.
