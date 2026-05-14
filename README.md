# OneSource

## Structured Attention Intelligence

OneSource is a project for studying internet attention patterns.

Right now it focuses on ecommerce creatives — things like hooks, emotions, visuals, CTAs, platforms, and niches — and tries to organize them into signals that can actually be explored and compared.

The goal isn’t to generate more AI content.

The goal is to understand why certain creative patterns keep working.

> clean signal > more AI

---

## What OneSource Does

Most tools try to help people create more content faster.

OneSource goes in the opposite direction.

It tries to slow things down and study the structure behind attention:

* what hooks repeat
* which emotions appear together
* how visuals reinforce persuasion
* what changes across platforms
* which patterns keep showing up again and again

It started with ecommerce because ecommerce creatives are structured enough to compare reliably.

But the bigger idea is broader than ecommerce.

---

## What It Is Not

OneSource is not:

* an AI wrapper
* a chatbot
* a content generator
* a viral prediction tool
* a recommendation engine

AI is useful during development and organization, but it’s not really the core idea here.

The interesting part is the structure:

* normalized signals
* repeatable patterns
* relationships between creative behaviors
* accumulated attention data over time

---

## How It Works

The system currently follows a pretty simple flow:

```text
creative data
→ signal cleanup
→ pattern extraction
→ exploration workspace
```

Each creative can contain signals like:

* emotions
* hooks
* visual styles
* CTAs
* platforms
* niches

From there, OneSource looks for:

* repeated patterns
* strongest co-signals
* reinforced structures
* platform behavior
* signal relationships

The idea is to make attention patterns easier to inspect instead of guessing what “might go viral.”

---

## Current State

OneSource is currently in what I call the “Pause Phase.”

The project was evolving quickly, so I intentionally stopped adding major features for a while and focused on making the foundation cleaner and easier to understand.

Most of the recent work has been around:

* stabilizing the intelligence layer
* cleaning signal behavior
* improving exploration UX
* fixing inconsistent traversal logic
* simplifying the product story
* reducing unnecessary complexity

That restraint ended up helping the product a lot.

---

## Current Features

Current foundations include:

* governed signal vocabulary
* signal quality validation
* normalized signal extraction
* universal signal exploration
* weighted signal rendering
* breadcrumb traversal
* strongest co-signal analysis
* pattern + platform intelligence
* minimal Vitest coverage
* production build + lint verification

The app now feels more like an intelligence workspace than a tagged gallery.

---

## App Structure

The Next.js app lives in:

```text
onesource/
```

Main routes:

* `/` → entry screen
* `/gallery` → intelligence workspace
* `/admin` → creative ingestion + governance

Commands:

```bash
cd onesource
npm run dev
npm run test
npm run lint
npm run build
```

---

## Stack

Current stack:

* Next.js
* TypeScript
* Tailwind
* Supabase
* Vitest

---

## Out Of Scope Right Now

Things intentionally NOT being added yet:

* graph systems
* AI reasoning engines
* recommendation systems
* embeddings/vector infrastructure
* ontology expansion
* feature-heavy UX

Trying to keep the foundation clean before making the system more complex.

---

## Long-Term Direction

The long-term idea is something closer to:

> a structured intelligence layer for internet attention

or:

> a creative genome for persuasion patterns

Most products help generate more content.

OneSource is more interested in understanding the patterns underneath it.
