# LeetCode Tracker

A production-quality web app to track LeetCode problems, approaches and notes — built with **Next.js (App Router) + TypeScript + TailwindCSS + MongoDB + Google OAuth**. Clean, responsive, dark/light themed, and ready to deploy on Vercel.

> This repository implements **Phase 1** of the spec. The architecture is intentionally modular so the **Phase 2** Profile Analytics module can be plugged in later without major refactoring (the route and sidebar entry already exist).

---

## ✨ Features

- **Google OAuth** sign-in via NextAuth, with a signed **JWT** session strategy (lightweight, serverless-friendly).
- **Protected dashboard** — middleware guards every `/dashboard` route.
- **Question Tracker** — searchable, sortable, filterable, paginated table.
  - Sortable columns: number, name, difficulty, date added, recently updated.
  - Colored **difficulty badges** (Easy/Medium/Hard) and **topic chips**.
  - **View** approach in a modal with full **Markdown** rendering + syntax-highlighted code.
  - **Open Question** link to LeetCode (new tab).
  - **Edit** / **Delete** with a confirmation dialog.
- **Add / Edit modal** with a custom **Markdown editor** (toolbar: bold, italic, lists, code block, table, quote + live preview), multi-select topics with custom entry, and URL validation.
- **Search** across number, name, topic, difficulty, or everything.
- **Filters** by difficulty and multiple topics. **Pagination** at 10 / 25 / 50 / 100 rows.
- **Theme** — beautiful dark mode by default, light mode toggle, glassmorphism cards, rounded corners, subtle shadows.
- **UX polish** — framer-motion animations, skeleton loading, toast notifications, optimistic delete, full error handling.
- **Pattern Library** — a "second brain" for reusable DSA heuristics and interview patterns, tightly integrated with the Question Tracker.
  - Responsive card grid (4 / 2 / 1 per row on desktop / tablet / mobile) with hover animations; each card shows top trigger keywords and a live "Used in N questions" badge.
  - Read-only **side drawer** with: clickable **Trigger Keywords** (click to find patterns with that keyword), a multi-language **Template** with syntax-highlighted tabs (Java / Python / Go / JavaScript / C++), an interactive **Mental Checklist**, a documentation-style **Complexity** card (right on desktop, below on mobile), full Markdown **Notes**, and a **Related Questions** list.
  - **Auto-linking** — associate patterns when adding/editing a question; each pattern's Related Questions and usage count are then derived *live* from the Question collection (no manual maintenance, no duplicated counts).
  - Clicking a related question deep-links into the Question Tracker and opens it.
  - Add/Edit modal: tags, trigger-keyword chip input (Enter / comma / paste), Markdown notes + template editors, mental-checklist and complexity-row editors.
  - Search across name / tags / description / notes / trigger keywords; filter by tag; sort by Alphabetical, Recently Updated, Recently Created, Most Viewed.
- **Responsive** across desktop, tablet and mobile.

---

## 🧱 Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 14** (App Router) | Frontend + backend (API routes) in one deployable unit on Vercel |
| Language | **TypeScript** | Type safety end-to-end |
| Styling | **TailwindCSS** | Utility-first, no inline styles |
| Database | **MongoDB** + **Mongoose** | Flexible document model for questions |
| Auth | **NextAuth** (Google provider, JWT) | Simple, secure, Vercel-friendly |
| Validation | **Zod** | Shared request validation |
| Markdown | react-markdown + remark-gfm + rehype-highlight | Render notes & code |
| Animation | framer-motion | Page/modal transitions |
| Toasts | react-hot-toast | Notifications |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   └── questions/
│   │       ├── route.ts                  # GET (list) + POST (create)
│   │       └── [id]/route.ts             # GET / PUT / DELETE
│   ├── dashboard/
│   │   ├── layout.tsx                    # Protected shell (sidebar + navbar)
│   │   ├── page.tsx                      # → redirects to /questions
│   │   ├── questions/page.tsx            # Main Question Tracker
│   │   └── analytics/page.tsx            # Phase 2 placeholder
│   ├── login/page.tsx                    # Google login page
│   ├── layout.tsx                        # Root layout + providers
│   ├── page.tsx                          # Entry redirect
│   └── globals.css                       # Theme tokens + markdown styles
├── components/
│   ├── auth/            # LoginCard
│   ├── dashboard/       # Sidebar, Navbar, DashboardShell
│   ├── icons/           # GoogleIcon
│   ├── markdown/        # MarkdownEditor, MarkdownPreview
│   ├── providers/       # Session + Theme + Toaster
│   ├── questions/       # Tracker, Table, Toolbar, Pagination, Modals
│   └── ui/              # Modal, ConfirmDialog, badges, chips, selects…
├── hooks/               # useQuestions
├── lib/                 # mongoose, mongodb, auth, env, validation, utils…
├── models/              # Question (Mongoose schema)
├── services/            # questionService (API calls)
└── types/               # Question types + next-auth augmentation
scripts/seed.ts          # Seed sample data
```

---

## 🚀 Getting Started (Local)

### 1. Prerequisites
- Node.js 20+
- A MongoDB instance (local, Docker, or MongoDB Atlas)
- Google OAuth credentials

### 2. Clone & install
```bash
npm install
```

### 3. Configure environment
Copy the example file and fill in the values:
```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` in dev) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### 4. Set up Google OAuth
1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (type: Web application).
3. Add an **Authorized redirect URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (and your production URL, e.g. `https://your-app.vercel.app/api/auth/callback/google`).
4. Copy the client ID & secret into `.env`.

### 5. (Optional) Seed sample data
```bash
# After your first login, set SEED_USER_ID to your Google subject id to see the
# sample questions in the app. Otherwise they're attached to "seed-user".
npm run seed
```

### 6. Run the dev server
```bash
npm run dev
```
Open **http://localhost:3000**.

---

## 🐳 Run with Docker

A `docker-compose.yml` is included that spins up **MongoDB + the web app**.

```bash
# Provide secrets via a .env file (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
docker compose up --build
```
The app will be available at **http://localhost:3000** and MongoDB at `localhost:27017`.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env` in the Vercel project settings
   (use **MongoDB Atlas** for `MONGODB_URI`, and set `NEXTAUTH_URL` to your Vercel domain).
4. Add the production redirect URI to your Google OAuth client.
5. Deploy. 🎉

---

## 🔌 API Reference

All endpoints require an authenticated session. Data is scoped to the logged-in user.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/questions` | List the user's questions |
| `POST` | `/api/questions` | Create a question |
| `GET` | `/api/questions/:id` | Get one question |
| `PUT` | `/api/questions/:id` | Update a question |
| `DELETE` | `/api/questions/:id` | Delete a question |
| `GET` | `/api/patterns` | List the user's patterns |
| `POST` | `/api/patterns` | Create a pattern |
| `GET` | `/api/patterns/:id` | Get one pattern (increments view count) |
| `PUT` | `/api/patterns/:id` | Update a pattern |
| `DELETE` | `/api/patterns/:id` | Delete a pattern |

**Question model**
```ts
{
  questionNumber: number;   // unique per user
  questionName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  leetcodeUrl: string;
  approach: string;         // Markdown
  createdBy: string;        // user id
  createdAt: Date;
  updatedAt: Date;
}
```
> **Validation:** duplicate `questionNumber` per user is rejected (enforced by a compound unique index *and* an explicit check).

---

## 🧪 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run seed` | Seed sample questions |

---

## 🗺️ Phase 2 (Planned)

A **Profile Analytics** dashboard tab (already stubbed at `/dashboard/analytics`) will add: solved totals, difficulty distribution, submission heatmap, acceptance rate, streaks, contest rating/ranking, topic- & company-wise progress, dynamic charts, weakest/strongest topics, a recommendation engine, an AI revision planner, progress timeline, and goal tracking. The current architecture (service layer, modular components, protected layout) is designed to accommodate this without major refactoring.

---

## 📄 License

MIT — use it, learn from it, ship it.
