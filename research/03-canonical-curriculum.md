# Canonical AI master's curriculum (synthesis)

This is the subject map that appears across nearly every program in `01-us-programs.md` and `02-international-programs.md`, ordered the way those programs expect students to learn it.

## A. Foundations (required everywhere)

1. **Python for ML** — syntax, NumPy, Pandas, plotting, Git/shell.
2. **Algorithms & CS** — asymptotics, graphs, DP (MIT/CMU/Stanford prereq; GT CS 6515).
3. **Linear algebra** — subspaces, least squares, eigen, SVD/PCA (MIT 18.06 / 18.065).
4. **Multivariable calculus** — gradients, Jacobian/Hessian, Lagrange (MIT 18.02).
5. **Probability & statistics** — Bayes, RVs, MLE, inference (Harvard Stat 110 / MIT 18.05 / Stanford CS 109).
6. **Optimization** — convex sets/problems, GD/SGD, duality (Stanford EE364A; CMU 10-725).

UK and Cambridge/ETH programs stress this harder; Indian M.Tech programs often examine it explicitly.

## B. AI fundamentals

Search, CSPs, games, MDPs, Bayes nets, HMMs, intro learning agents.
- Required or core: Berkeley CS188, Stanford CS221, Georgia Tech CS 6601, MIT 6.034.

## C. Classical machine learning

Linear/logistic regression, GLMs, GDA/Naive Bayes, SVMs/kernels, trees/ensembles/boosting, bias-variance, regularization, k-means/EM/PCA/ICA, intro RL, learning theory.
- Flagship: Stanford CS229, CMU 10-701/715, GT CS 7641, Cornell CS4780, Columbia COMS 4771.

## D. Probabilistic ML / graphical models

Bayes nets, MRFs, exact + variational + MCMC inference, GPs, latent-variable models.
- Core at CMU (10-708), Cambridge MLMI, UCL, Edinburgh, ETH/Tübingen; elective at Stanford (CS228).

## E. Deep learning

MLPs, backprop, CNNs, RNNs/LSTMs, attention/transformers, training practice, modern architectures.
- CMU 11-785, NYU DS-GA 1008, Stanford CS230, MIT 6.S191 / 6.7960, GT CS 7643.

## F. Specializations (programs require ~2–4)

| Area | Flagship free lectures |
| --- | --- |
| Computer vision | Stanford CS231n, Michigan EECS 498, Columbia FPCV |
| NLP | Stanford CS224N, CMU 11-711, Jurafsky & Martin SLP3 |
| LLMs / language modeling | Stanford CS336, Karpathy Zero to Hero + GPT series, CS25 |
| Generative models | Stanford CS236, HF Diffusion course |
| Reinforcement learning | David Silver (UCL/DeepMind), Stanford CS234, Berkeley CS285 |
| Graphs | Stanford CS224W |
| Robotics | MIT 6.4210 Manipulation |

## G. ML systems / MLOps

Data pipelines, experiment tracking, serving, monitoring, continual learning.
- Stanford CS329S, CMU 10-414/714, Full Stack Deep Learning, Made With ML, MLOps Zoomcamp.

## H. LLM applications & agents (2024– industry layer)

Prompting, RAG, tools, agent patterns, evals, when to fine-tune.
- Not always a named master's course yet; Berkeley LLM Agents MOOC, HF Agents course, Anthropic/OpenAI guides fill the gap employers care about.

## I. Safety, fairness, ethics

Fairness criteria, privacy, alignment/governance, practical ethics.
- Required at UT MSAI, Columbia MSAI, CMU MSAII/MSAIE, many UK programmes; elective elsewhere.

## J. Capstone

Scoped problem → baseline → iteration → deploy → ethics review → report/demo.
- Required at CMU MSAII, Berkeley MIDS/MEng, NYU, Harvard, Toronto MScAC (internship), most EU theses.

---

## How Audit's three paths cover this

| Canonical area | Sprint (8 wk) | Builder (6–9 mo) | Master's (2 yr) |
| --- | --- | --- | --- |
| Python | ✓ | ✓ | ✓ |
| Algorithms | — | — | ✓ |
| Linear algebra / calculus / probability | light | ✓ | ✓ |
| Math for ML / optimization | — | ✓ | ✓ |
| AI foundations | — | ✓ | ✓ |
| Classical ML | ✓ applied | ✓ + CS229 deeper | ✓ + CS229 deeper required |
| Probabilistic ML | — | — | ✓ |
| Deep learning | ✓ | ✓ | ✓ |
| Vision | — | ✓ | ✓ |
| NLP | — | ✓ | ✓ |
| LLMs | ✓ | ✓ | ✓ |
| Generative | — | ✓ | ✓ |
| RL | — | — | ✓ |
| Graphs / robotics | — | — | ✓ |
| MLOps | ✓ | ✓ | ✓ |
| Agents / RAG | ✓ | ✓ | ✓ |
| Safety | — | ✓ | ✓ |
| Career | ✓ | ✓ | ✓ |
| Capstone | ship a demo | ✓ | ✓ master's-style |

Shorter paths are subsets: finishing Sprint progress counts toward Builder and Master's because progress is stored per resource, not per path.
