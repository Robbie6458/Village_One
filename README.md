# 🌱 Village-One

Village-One is an experimental community-building web app built with **React (Vite + TypeScript)** and a **Postgres database**.  
It’s a prototype for exploring how digital spaces can model collaboration, discussion, and resource sharing for small, resilient villages.

---

## 🚀 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, TanStack Query, Wouter
- **Backend (moving to serverless):** Supabase (Auth, Postgres, Storage, Realtime)
- **AI:** OpenAI API (summaries, archetypes, state updates)

---

## 📦 Project Structure
```
/client   → Frontend (React + Vite)
/server   → Server code (being replaced by serverless functions)
/shared   → Shared types and database schema
```

---

## ⚡ Getting Started (local dev)
1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase + OpenAI keys
4. Run locally:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 🌍 Deployment
- **Frontend:** [Vercel](https://vercel.com)  
- **Backend:** [Supabase](https://supabase.com) + Vercel Functions  

Push changes to GitHub → Vercel automatically builds and gives you a shareable preview URL.  

---

## 📖 Notes
This project started on Replit and is being migrated to Supabase + Vercel to reduce cost and simplify development.  
The goal is to make it easy to work on, test, and share without worrying about hosting overhead.
