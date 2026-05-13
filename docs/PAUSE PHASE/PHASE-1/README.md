# Pause Phase 1 - Architecture Stabilization

## Purpose

Pause Phase exists to stabilize OneSource before adding deeper intelligence features.

The project had already moved beyond a simple creative gallery. The priority became making the existing intelligence easier to trust, explain, and extend.

## Current Pipeline

```text
Creative data
-> signal normalization
-> intelligence pipeline
-> exploration UI
```

## Layers

### Creative Data

Creatives are stored with structured fields such as emotions, hooks, visual styles, CTAs, platform, and niche.

### Signal Normalization

Raw creative fields are normalized into consistent signals. This prevents fragmented intelligence caused by casing, whitespace, duplicate tags, or invalid emotion values.

Primary code:

- `src/lib/config/ontology.ts`
- `src/lib/signals/extractSignals.ts`
- `src/lib/utils/validation.ts`

### Intelligence Pipeline

The intelligence layer builds summaries, repeated patterns, relationships, reinforced structures, taxonomy clusters, platform insights, and exploration data.

Primary code:

- `src/lib/intelligence/index.ts`
- `src/lib/intelligence/patterns.ts`
- `src/lib/signals/buildRelationships.ts`
- `src/lib/intelligence/signalExploration.ts`

### Exploration UI

The UI presents intelligence as a navigable research environment instead of a static tag gallery.

Primary code:

- `src/components/intelligence/SignalTag.tsx`
- `src/components/intelligence/SignalField.tsx`
- `src/components/intelligence/ExplorationPanel.tsx`
- `src/components/intelligence/PatternCard.tsx`

## Verification

Pause Phase now includes a minimal intelligence-layer verification suite.

Current checks:

```bash
npm run test
npm run lint
npm run build
```

The tests focus on pure intelligence logic only:

- signal extraction
- universal signal exploration
- relationship stability
- pipeline smoke behavior

## Boundaries

Still out of scope:

- AI reasoning systems
- graph systems
- recommendation logic
- ontology expansion
- Supabase integration tests
- Playwright, Cypress, and snapshots

The current goal is stable, understandable intelligence infrastructure.
