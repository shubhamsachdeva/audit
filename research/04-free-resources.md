# Free resource catalog

The authoritative, machine-readable catalog is [`app/src/data/resources.ts`](../app/src/data/resources.ts). This document is the human-readable index of what is in it and why.

**Verification:** every YouTube playlist and video ID was checked with `app/scripts/verify-youtube.ts` against live YouTube pages. Result: **43/43 OK**. Lecture counts were patched to match playlist reality (except MIT 6.S191, which is a multi-year playlist — progress tracks the latest year's ~9 lectures).

## By subject

### Python & tooling
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| CS50P (Harvard, Malan) | YouTube playlist | Programming prereq |
| Kaggle Learn Python / Pandas | Interactive | — |
| NumPy absolute beginners | Docs | — |
| Missing Semester (MIT) | YouTube playlist | Tooling every lab assumes |

### Algorithms
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| MIT 6.006 (2020) | YouTube playlist | MIT 6.006, Stanford CS 161 |
| CS50x | Course | Undergrad CS |
| NeetCode 150 | Interactive | Interview prep |

### Linear algebra
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| 3Blue1Brown Essence of LA | YouTube playlist | Intuition layer |
| MIT 18.06 (Strang) | YouTube playlist | MIT 18.06 |
| MIT 18.065 (Strang) | YouTube playlist | Matrix methods for ML |

### Calculus
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| 3Blue1Brown Essence of Calculus | YouTube playlist | — |
| Khan Academy Multivariable (Sanderson) | Course | MIT 18.02 |
| MIT 18.02 (Auroux) | YouTube playlist | MIT 18.02 |
| Matrix Calculus You Need for DL | Article | Backprop math |

### Probability & statistics
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Harvard Stat 110 (Blitzstein) | YouTube playlist | Stat 110 / CS 109 |
| StatQuest Statistics Fundamentals | YouTube playlist | — |
| MIT 18.05 | Course (OCW) | MIT 18.05 |
| Seeing Theory (Brown) | Interactive | — |

### Math for ML & optimization
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Mathematics for ML (free book) | Book | Imperial M4ML |
| Imperial M4ML Specialization | Coursera audit | Imperial prep |
| Stanford EE364A (Boyd) | YouTube playlist | EE364A, CMU 10-725 |

### AI foundations
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Berkeley CS188 + Pac-Man projects | Course | CS188, CS 6601 |
| Stanford CS221 (2019) | YouTube playlist | CS221 |
| MIT 6.034 (Winston) | YouTube playlist | 6.034 |

### Classical ML
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Stanford CS229 (Ng, 2018) | YouTube playlist | CS229, CMU 10-701, GT 7641 |
| ML Specialization (Ng) | Coursera audit | Applied undergrad ML |
| Caltech Learning from Data | YouTube playlist | CS156 / learning theory |
| Cornell CS4780 (Weinberger) | YouTube playlist | COMS 4771 |
| StatQuest ML | YouTube playlist | — |
| Google ML Crash Course | Course | — |
| Kaggle Intro/Intermediate ML | Interactive | — |
| ISLP (free book + labs) | Book | STATS 202 |
| ESL (free PDF) | Book | STATS 315 |
| Murphy PML Book 1 (free) | Book | Graduate probabilistic ML |
| scikit-learn user guide | Docs | — |

### Probabilistic ML
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| CMU 10-708 (Xing, 2020) | YouTube playlist | 10-708, CS228 |
| Tübingen Probabilistic ML (Hennig) | YouTube playlist | Cambridge / UCL P&UL |
| MacKay ITILA lectures | YouTube playlist | Cambridge |
| Bishop PRML (free PDF) | Book | Edinburgh / Oxford |

### Deep learning
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| 3Blue1Brown Neural Networks | YouTube playlist | Intuition |
| Karpathy Zero to Hero | YouTube playlist | Implementation half of 11-785 / CS230 |
| MIT 6.S191 | YouTube playlist | 6.S191 |
| fast.ai Practical DL Parts 1 & 2 | Playlist + course | Applied DL |
| NYU Deep Learning (LeCun) | YouTube playlist | DS-GA 1008 |
| Stanford CS230 | YouTube playlist | CS230 |
| Deep Learning Specialization | Coursera audit | — |
| Dive into Deep Learning | Book | STAT 157 |
| Understanding Deep Learning (Prince) | Book | Modern DL core |
| Goodfellow et al. Deep Learning | Book | Classic reference |
| PyTorch official tutorials | Interactive | — |
| CMU 11-785 site | Course | 11-785 |

### Computer vision
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Stanford CS231n (2017) | YouTube playlist | CS231n |
| Michigan EECS 498 (Johnson) | YouTube playlist | CS231n successor |
| First Principles of CV (Nayar) | Course | Classical vision |

### NLP & LLMs
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Stanford CS224N | YouTube playlist | CS224N, GT 7650 |
| CMU 11-711 Advanced NLP | YouTube playlist | 11-711 |
| SLP3 (Jurafsky & Martin) | Book | NLP textbook |
| Hugging Face LLM Course | Course | Applied transformers |
| Karpathy LLM / GPT / tokenizer / GPT-2 videos | YouTube videos | CS336 practice |
| 3Blue1Brown Transformers | YouTube video | Intuition |
| Stanford CS336 (2025) | YouTube playlist | CS336 |
| Stanford CS25 | YouTube playlist | Seminar |

### Generative models
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Stanford CS236 (2023) | YouTube playlist | CS236 |
| HF Diffusion Course | Course | Applied diffusion |

### Reinforcement learning
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| David Silver UCL/DeepMind | YouTube playlist | UCL RL, GT 7642 |
| Stanford CS234 (2019) | YouTube playlist | CS234 |
| Berkeley CS285 (2023) | YouTube playlist | CS285, CMU 10-703 |
| Sutton & Barto (free) | Book | Every RL course |
| OpenAI Spinning Up | Article + code | Deep RL algorithms |
| HF Deep RL Course | Course | Hands-on |

### MLOps & systems
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Made With ML | Course | CS329S / production ML |
| Full Stack Deep Learning | Course | ML systems electives |
| MLOps Zoomcamp | Course | Applied MLOps |
| CMU Deep Learning Systems | Course | 10-414/714 |
| Chip Huyen CS329S notes | Article | CS329S |
| Google Rules of ML | Article | Production heuristics |
| FastAPI + Docker tutorials | Interactive / docs | Serving basics |

### Agents & LLM apps
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| DeepLearning.AI short courses (prompting, RAG, fine-tuning) | Course | Industry AI eng |
| Anthropic prompt tutorial + Building effective agents | Interactive / article | — |
| Pinecone RAG learning center | Article | — |
| Hugging Face Agents Course | Course | — |
| Berkeley LLM Agents MOOC | Course | CS294-196 |
| OpenAI Cookbook | Article | — |

### Graphs, robotics, safety, career
| Resource | Type | Free equivalent of |
| --- | --- | --- |
| Stanford CS224W | YouTube playlist | CS224W |
| MIT Robotic Manipulation | Course | 6.4210 |
| BlueDot AI Safety Fundamentals | Course | Safety modules |
| Fairness and ML book | Book | Fairness courses |
| fast.ai Practical Data Ethics | Course | Ethics |
| ARENA transformer interp | Interactive | Mech interp |
| Chip Huyen ML Interviews | Book | Interview prep |
| ML Interviews GitHub guide | Article | System design interviews |

## Path recommendations (quick)

**Sprint (job, 8 weeks):** CS50P refresh → Ng ML Specialization → MIT 6.S191 + Karpathy Zero to Hero → Karpathy LLM videos + RAG/agents short courses → FastAPI/Docker + Made With ML → interview book.

**Builder (6–9 months):** Add 3Blue1Brown + Stat 110 + CS188 Pac-Man + CS231n or CS224N + CS236 or diffusion + Full Stack DL + ethics + capstone.

**Master's (2 years):** Add MIT 6.006, Strang 18.06/18.065, CS229, CMU 10-708 or Tübingen PML, NYU DL or CMU 11-785, CS234/CS285, CS336, CS224W, Boyd, ESL/Murphy, ARENA, master's-style capstone.
