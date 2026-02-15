## Introduction

For a long time, I’ve had a persistent idea in the back of my mind: rebuilding a classic RoadRash-style game that runs directly inside a web browser.

No installations.
No emulators.
Just a playable experience accessible from anywhere.

With modern AI models becoming increasingly capable at generating code, I decided to treat this as an experiment: could AI act as a meaningful development partner for building such a game?

Rather than keeping this as a private project, I chose to build it publicly.

---

## The Setup

To formalize the experiment, I created a dedicated space:

- Domain: https://builtwithai.fyi
- Project URL: https://roadrash.builtwithai.fyi

The objective was straightforward: rely heavily on AI-assisted development, intervene minimally, and observe where things succeed or break.

Since I already had a Google AI Pro subscription, I decided to begin entirely within Google’s AI tooling ecosystem.

---

## Phase 1: Prompt Engineering with Gemini

Instead of immediately asking an agent to build the game, I first asked Gemini a meta-level question:

“Generate a prompt that can be used with Jules to build a RoadRash-style browser game.”

Gemini produced a detailed prompt, which I then supplied directly to Jules to initiate the build process.

---

## Phase 2: Jules Execution

Jules ran for several hours without interruption and ultimately produced a working output.

The result was technically functional: a playable motorcycle game running in the browser. However, the experience was extremely minimal and lacked the defining characteristics of the classic RoadRash games.

While this demonstrated that long-form autonomous code generation is possible, the outcome felt more like a prototype than a recognizable game.

---

## Phase 3: Iteration Challenges

The natural next step was refinement. I attempted to provide additional prompts to Jules to improve visuals, mechanics, and overall feel.

At this point, the workflow became unstable. Jules repeatedly failed to pause or resume sessions, effectively blocking further progress through that channel.

This highlighted a practical limitation of agent-based development: session reliability becomes a critical dependency.

---

## Phase 4: Gemini Code Assist

To continue iteration, I moved the generated code into VS Code and used Gemini Code Assist to request structural and gameplay improvements.

The result was unexpected but instructive. The game stopped rendering correctly, ultimately producing a blank screen. Debugging revealed that seemingly reasonable AI-generated modifications can easily destabilize an otherwise working system.

This was a reminder that AI-assisted refactoring remains fragile, particularly for interactive graphical applications.

---

## Key Observations

Several patterns became clear throughout this experiment:

1. AI can bootstrap complex projects quickly, especially from a blank slate.
2. Visual and experiential fidelity is far harder than generating functional code.
3. Agent workflows are highly sensitive to prompt specificity.
4. Iteration and refinement are currently the weakest parts of the process.
5. Human oversight remains essential, particularly for preserving architectural intent.

Most importantly, building something that “works” is very different from building something that “feels right.”

---

## Next Steps

Given the mixed results within a single tooling ecosystem, the next logical step is comparative experimentation.

Future iterations will explore alternative models and agents, particularly Claude, to evaluate differences in reasoning, rendering approaches, and code stability.

The goal is not merely to complete the game, but to better understand how AI tools behave in non-trivial creative and technical workflows.

---

## Conclusion

This project has been both frustrating and informative. AI models are clearly capable of generating substantial amounts of code, yet achieving authenticity, polish, and reliable iteration remains challenging.

Despite the setbacks, the experiment has been worthwhile. Each failure reveals more about the current boundaries of AI-assisted development.

Progress continues.
