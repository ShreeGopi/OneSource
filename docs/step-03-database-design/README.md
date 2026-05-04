# Step 03 — Database Design (Creative Schema)

## Objective
Design the core database structure to store and organize ecommerce creatives in a structured and scalable way.

---

## What We Built
- Created `creatives` table in Supabase
- Defined structured schema for storing:
  - hooks
  - CTAs
  - visual data
  - platform & niche
- Designed system to support future filtering and pattern analysis

---

## Steps Taken

### 1. Accessed Supabase SQL Editor

- Opened Supabase dashboard
- Navigated to SQL Editor

---

### 2. Created `creatives` Table

Executed:

```sql
create table creatives (
  id uuid default gen_random_uuid() primary key,
  
  title text,
  brand text,
  platform text,
  niche text,
  
  image_url text,
  
  hook text,
  cta text,
  
  emotion_tags text[],
  hook_types text[],
  visual_styles text[],
  
  creator_archetype text,
  
  notes text,
  
  source_link text,
  
  created_at timestamp default now()
);
```

---
## Schema Design Thinking

Each field was added intentionally:

### Core Info
``` title, brand, platform, niche ```
### → Basic identification and categorization
- Content Layer
- hook
- cta
### → Core conversion elements of the creative
- Visual Layer
- image_url
### → Stores thumbnail or ad image reference
- Pattern Layer (MOST IMPORTANT)
- emotion_tags
- hook_types
- visual_styles
### → These enable:
- filtering
- pattern recognition
- future insights
--- 

This is the foundation of:
Attention Intelligence

- Metadata
- creator_archetype
- notes
- source_link
- created_at

### → Adds context and traceability

# Challenges Faced

No major technical errors in this step.

However, key challenge was:

## 1. Deciding What to Store

### Not obvious:

- what fields matter?
- how structured should data be?
- what will be useful later?

### Key Decisions

Used arrays (text[]) for tags instead of single values
→ allows multiple tags per creative

Designed schema for future filtering + insights
→ not just storage

Avoided over-complication
→ kept MVP simple but extensible

## Key Learnings
- Database design = product design
- Structure defines future capabilities
- Tagging system is the foundation of intelligence layer
- Thinking ahead saves major refactors later

## Outcome

At the end of this step:

- Database is fully ready
- Schema supports:
- tagging
- filtering
- analysis
- Core foundation of product is established