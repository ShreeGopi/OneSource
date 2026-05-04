# Step 04 — Admin Upload System (Data Ingestion)

## Objective
Build a simple interface to manually add creatives into the database.

---

## What We Built
- Created `/admin` route
- Built a form UI
- Connected form to Supabase
- Inserted data into `creatives` table

---

## Steps Taken

### 1. Created Admin Page

File:
```text
src/app/admin/page.tsx
```
Used:

- Next.js App Router
-Client component ("use client")

### 2. Built Form UI

Created input fields for:

- title
- brand
- platform
- niche
- image_url
- hook
- cta
- notes

Used useState to manage form data.

### 3. Connected to Supabase

Imported client:
```
import { supabase } from "@/lib/supabase";
```
### 4. Inserted Data

Used:
```
await supabase.from("creatives").insert([
  {
    title,
    brand,
    platform,
    niche,
    image_url: imageUrl,
    hook,
    cta,
    notes,
  },
]); 
```

### 5. Tested Flow
- Opened /admin
- Filled form manually
- Clicked "Save Creative"
- Verified alert: "Saved!"
- Checked Supabase → data successfully inserted

# Challenges Faced
## 1. Import Error (Path Alias)

Error:
```
Cannot find module '@/lib/supabase'
```

## Cause:

- TypeScript alias (@) not configured correctly
- Fixes / Solutions

#### Fix —>  
```
Updated tsconfig.json
```
#### Added:
```
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

Also:

- Fixed trailing comma issue
- Restarted dev server
- Restarted TypeScript server

# Key Learnings
- Small config issues can block development flow
- Path aliases improve code readability but need proper setup
- Always verify full flow (UI → DB)
- Manual data entry is useful for early-stage data collection

# Outcome

At the end of this step:

- Working admin panel
- Data successfully stored in database
- End-to-end flow complete (input → storage)