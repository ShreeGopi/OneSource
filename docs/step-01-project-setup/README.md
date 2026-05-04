# Step 01 — Project Setup (OneSource)

## Objective
Set up the foundational development environment for OneSource using Next.js, and initialize version control with GitHub.

---

## What We Built
- Created a Next.js application using App Router
- Set up TypeScript + Tailwind CSS
- Initialized Git repository
- Connected project to GitHub
- Created structured `/docs` system for tracking build progress

---

## Steps Taken

### 1. Created Next.js App
```bash
npx create-next-app@latest .
```

## Selected:

- TypeScript → Yes
- Tailwind → Yes
- App Router → Yes
- src/ directory → Yes

### 2. Installed Dependencies
```
npm install
```
### 3. Started Development Server
```
npm run dev
```

Verified:

App running at http://localhost:3000


### 4. Initialized Git + GitHub
Created GitHub repository
Connected local project using:
```
git init
git remote add origin <repo-url>
git add .
git commit -m "initial commit"
git push -u origin main
```

Created Documentation System

### 5. Structured internal documentation:
```
/docs
  /step-01-project-setup
  /step-02-supabase-setup
  /step-03-database-design
  /step-04-admin-upload
```
Each step contains a README.md for:

- steps
- errors
- fixes
- learnings

## Challenges Faced
### 1. npm Installation Failure

Error:

TAR_ENTRY_ERROR
install aborted midway

Cause:

Using OneDrive directory
Special character in folder name (#)

### 2. Missing package.json

Error:

npm ERR! Could not read package.json

Cause:

Incomplete installation

### 3. Submodule Issue in GitHub

Problem:
```
- onesource folder appeared as a submodule
- Folder was not clickable in GitHub
- Files were not visible
```

Cause:

Nested .git folder inside project directory

# Fixes / Solutions
## Fix 1 — Clean Project Setup
```
- Moved project outside OneDrive
- Removed special characters from folder name
- Re-ran Next.js setup in clean directory
```

## Fix 2 — Submodule Issue

To convert submodule into normal directory:
```
git rm --cached onesource
rm -rf onesource/.git
git add .
git commit -m "fix: convert submodule to regular directory"
git push origin main
```

Result:

Folder became normal directory
Files visible and editable

# Key Learnings
- Avoid OneDrive for dev projects (file locking issues)
- Avoid special characters (#) in folder names
- Always verify installation completed successfully
- Git submodules can be unintentionally created due to nested .git
- Debugging setup issues quickly is an important engineering skill

# Outcome

At the end of this step:

- Working Next.js app
- Clean GitHub repo
- Structured documentation system
- Stable development environment
