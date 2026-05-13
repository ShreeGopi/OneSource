# OneSource App

OneSource is a Next.js application for structured attention intelligence. It stores ecommerce creatives, normalizes their signals, and helps explore repeated patterns across emotions, hooks, visuals, CTAs, platforms, and niches.

This is not an AI content generator. The current product focus is signal quality, exploration clarity, and durable intelligence infrastructure.

## Routes

- `/` - OneSource entry screen.
- `/gallery` - Intelligence environment for exploring creatives and related signals.
- `/admin` - Manual creative ingestion and signal quality validation.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` with Supabase public client values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Verification

Run the intelligence tests:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

The production build may need network access because the app uses `next/font/google`.

## Architecture

Current pipeline:

```text
Creative data
-> signal normalization
-> intelligence pipeline
-> exploration UI
```

Core areas:

- `src/lib/config` - controlled vocabularies, thresholds, and weighting.
- `src/lib/signals` - normalized signal extraction and relationship building.
- `src/lib/intelligence` - summaries, patterns, platform insights, exploration, and orchestration.
- `src/components/intelligence` - signal tags, fields, cards, and exploration panel.

## Pause Phase

OneSource is currently in Pause Phase: stabilization, clarity, and architecture hardening before adding deeper intelligence layers.

In scope now:

- clean signal behavior
- understandable exploration UX
- documentation clarity
- focused intelligence-layer tests

Out of scope now:

- AI reasoning engines
- graph systems
- recommendation systems
- frontend/E2E test frameworks
- Supabase integration tests
- ontology expansion
