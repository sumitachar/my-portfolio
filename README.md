# Sumit Achar · Portfolio

Personal portfolio of Sumit Achar, Full-Stack Developer & Tech Partner. Built with React, Vite, Tailwind CSS, GSAP and Framer Motion.

Live: https://my-portfolio-nh86.vercel.app

## Features

- Client-focused sections: services, selected work, process, FAQ and contact
- **Project assistant** chatbot that collects a project brief (type, idea, features, budget, timeline, contact) and answers common questions
- Contact form and chatbot save enquiries to **Firebase Firestore** (falls back to email if Firebase isn't configured)
- Hidden **admin panel** (Firebase Auth) with a live leads inbox, status tracking, private notes, reply shortcuts and CSV export

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

## Environment variables

All variables live in `.env.local` locally and in **Vercel → Project → Settings → Environment Variables** for the live site. Vite bakes them into the build, so **redeploy after changing them**.

| Variable | Where to find it |
| --- | --- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` | Firebase console → Project settings → Your apps → Web app config |
| `VITE_ADMIN_KEY` | Any secret word you choose (see below) |

The Firebase web config is public by design. Data is protected by `firestore.rules`, not by hiding these values.

## Firebase setup

1. Create a Firebase project (free Spark plan) and register a **Web app**.
2. Create a **Firestore** database in production mode.
3. In **Authentication**, enable **Email/Password** and add one admin user.
4. Put that user's **UID** in `isAdmin()` in [`firestore.rules`](firestore.rules) and publish the rules (console → Firestore → Rules, or `firebase deploy --only firestore:rules`).

Rules summary: anyone can **create** a well-formed lead in `leads`; only the admin UID can read, update (status / notes) or delete; everything else is closed.

## Admin panel

Open it by typing the `VITE_ADMIN_KEY` word anywhere on the site (outside a text field), or by visiting `/#<your-key>` (handy on mobile). Then sign in with the Firebase admin user.

The key only reveals the sign-in screen. Access to leads is enforced by Firebase Auth and the Firestore rules.

## Editing content (no code needed)

Open the admin panel, sign in and switch to the **Content** tab. Every section of the site can be edited there:
Profile, Stats, Trust points, Services, Projects, Process, Experience, Stack, Tech ticker and FAQ.
Add, remove, reorder or duplicate items, then press **Save & publish** and reload the site.

- Content is stored in Firestore (`content/site`); the values in `src/data/portfolio.js` are the built-in defaults
  and are used whenever nothing has been saved or Firestore can't be reached.
- **Reset section** restores a section's built-in default (publish to apply).
- Project screenshots: put an image named after the project's slug in `src/assets/projects/`, or paste an image URL
  in the project's *Screenshot URL* field.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
