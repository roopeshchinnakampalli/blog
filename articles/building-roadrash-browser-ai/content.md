## The Long-Pending Dream 🚴‍♂️💥

For years, I’ve had this one stubborn wish:
to rebuild the **classic RoadRash game** — the one many of us grew up playing — and make it run **directly inside a web browser**.

No downloads.
No emulators.
Just pure nostalgia, playable anywhere.

With AI models getting *really* good at writing code, I finally thought:

> *What if I let AI do most of the heavy lifting, and I just guide, tweak, review, and ship?*

That idea turned into a real experiment.

---

## The Setup: Building in Public

To keep myself accountable, I went fully public:

- Bought a domain: **https://builtwithai.fyi**
- Created a project subdomain:
  👉 **https://roadrash.builtwithai.fyi**

The goal was simple:
**AI-assisted game development, end-to-end, visible to everyone.**

No private repos. No hiding the failures.

---

## Going All-In on Google’s AI Stack 🤖

Since I already have a **Google AI Pro** subscription, I decided to test Google’s ecosystem seriously:

- **Gemini**
- **Jules**
- **Gemini Code Assist (VS Code)**

### Step 1: Let Gemini Write the Prompt

Instead of directly building the game, I asked **Gemini** a meta-question:

> “Give me a prompt that I can use with Jules to build a RoadRash-style game.”

This is the prompt Gemini generated:
👉 https://gemini.google.com/app/bd4631348b8e3226

So far, so good.

---

## Step 2: Jules Takes the Wheel (for 6.5 Hours ⏱️)

I fed Gemini’s prompt into **Jules** and started the session.

What happened next surprised me:

- Jules ran for **~6.5 hours**
- No intervention needed
- Full code generation

Final output:
👉 **https://roadrash.builtwithai.fyi**

### The Result?

- ✅ A playable game
- ⚠️ Very bare-bones mechanics
- ⚠️ Minimal polish
- ⚠️ Feels more like a prototype than a game

Honestly?
It was *okay-ish*.

Not impressive — but not useless either.

I could see potential **if prompts were refined further**.

---

## Step 3: Prompt Tweaks… and a Dead End ❌

Naturally, I tried to iterate.

I sent follow-up prompts to Jules to:
- Improve gameplay
- Add polish
- Refine controls

That’s when things broke.

Jules started throwing this error repeatedly:

> **“Failed to pause / resume. Please try again later.”**

No recovery.
No progress.
Session stuck.

That experiment was effectively over.

---

## Step 4: Gemini Code Assist Joins the Party 🧑‍💻

Plan B.

I opened the generated code in **VS Code** and turned to **Gemini Code Assist**.

I asked it to:
- Improve structure
- Enhance gameplay logic
- Clean up rendering issues

The outcome?

- 🟥 Blank screen
- 🟥 Game no longer loads
- 🟥 Something fundamental got messed up

Classic AI-assisted refactor moment:
*“Trust me bro”* — and then everything disappears.

---

## So… Can AI Build a Game Like RoadRash Today?

### The honest answer: **almost, but not yet.**

What worked:
- AI can generate a full project from scratch
- It can wire up rendering, controls, and basic logic
- It’s great for bootstrapping ideas fast

What didn’t:
- Long-running agent sessions are fragile
- Iteration via prompts is unreliable
- Refactoring non-trivial code often breaks things
- You still need **human judgment at every step**

---

## What’s Next?

Ironically, this experiment might push me *away* from Google’s tools.

Next up:
- 👉 Try **Claude**
- 👉 Compare agentic coding quality
- 👉 See which model respects my pixels better

(Yes, Google — you kind of forced my hand here 😅)

---

## Final Thoughts

This journey was:
- Messy
- Frustrating
- Genuinely fascinating

AI is **very close** to being a real game dev partner — but we’re not at
*“one prompt → polished RoadRash clone”* yet.

Still, I’m glad I tried.

More experiments coming.
More failures coming.
And hopefully… a better RoadRash too.

If you’re building with AI, I’d love to hear what’s working (and breaking) for you.
