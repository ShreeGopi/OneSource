# Step 02 — Supabase Setup (Backend Integration)

## Objective
Set up Supabase as the backend and connect it with the Next.js application.

---

## What We Built
- Created a Supabase project
- Connected frontend to Supabase
- Set up environment variables
- Created reusable Supabase client

---

## Steps Taken

### 1. Created Supabase Project
- Created a new project on Supabase
- Saved:
  - Project URL
  - anon public key

---

### 2. Setup Environment Variables

Created `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
### 3. Installed Supabase Client
```
npm install @supabase/supabase-js
```
### 4. Created Supabase ClientS
File:
```
src/lib/supabase.ts
```

Code:
```
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
```

# Challenges Faced
1. Import Error (Path Alias Issue)

Error:
```
Cannot find module '@/lib/supabase'
```
Cause:

- TypeScript did not recognize @ alias
- Fixes / Solutions
- Fix — Configure tsconfig.json

Updated:
```
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```
Also added:
```
"ignoreDeprecations": "6.0"
```
And fixed:

J- SON formatting issue (trailing comma)

Then:

- Restarted dev server
- Restarted TypeScript server in VS Code
- Key Learnings
- Path aliases (@/) require proper TypeScript configuration
- JSON syntax errors (like trailing commas) can silently break config
- Restarting dev + TS server is often required after config changes
- Small config issues can block entire development flow

# Outcome

At the end of this step:

- Supabase successfully connected
- Import system working correctly
- Backend integration ready
- Project structure becoming stable