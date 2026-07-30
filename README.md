# 🍽️ PantryChef AI — Frontend

> React + Vite frontend for PantryChef AI — a conversational AI cooking companion that suggests dishes, generates step-by-step recipes, and finds missing ingredients based on your actual pantry.

**Live App:** [cookwithpantrychef-ai.vercel.app](https://cookwithpantrychef-ai.vercel.app)  
**Backend Repo:** [pantrychef-backend](https://github.com/dverma9/pantrychef-backend)  
**Part of:** [AB Talks 60-Day Claude AI Challenge](https://www.youtube.com/@ABTalks)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧺 **Pantry Manager** | Add, view, and remove ingredients with quantity and unit |
| 💬 **AI Chat** | Conversational interface powered by Gemini AI — ask anything about cooking |
| 📋 **Recipe Formatter** | AI recipes render with numbered steps, bullet ingredients, and bold section headers |
| 🔍 **Missing Ingredient Finder** | Ask for any dish — AI tells you exactly what's missing from your pantry |
| ⚙️ **Preference Memory** | Set spice level, preferred cuisines, dietary restrictions, and disliked ingredients |
| 📱 **Fully Responsive** | Works on mobile (3-tab navigation) and desktop (split pantry + chat layout) |
| 🔄 **New Chat** | Clear conversation and start fresh in one click |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| HTTP Client | Axios (with timeouts + typed error handling) |
| Styling | Plain CSS with CSS Custom Properties (design tokens) |
| Deployment | Vercel |
| AI Backend | Google Gemini API (via Spring Boot backend) |

No UI libraries. No component frameworks. Pure React + CSS.

---

## 📁 Project Structure

```
src/
├── api/
│   ├── chatApi.js          # POST /api/chat — 30s timeout, typed errors
│   ├── pantryApi.js        # Pantry CRUD — 10s timeout, 404 handling
│   └── preferencesApi.js   # GET/PUT /api/preferences — 10s timeout
├── components/
│   ├── Header.jsx          # App header with desktop Preferences button
│   ├── ChatWindow.jsx      # Chat UI — auto-resize input, New Chat, error handling
│   ├── MessageBubble.jsx   # Renders user + AI messages with recipe formatting
│   ├── PantryManager.jsx   # Pantry list with skeleton loader + add form
│   ├── IngredientItem.jsx  # Single ingredient row with per-item delete state
│   └── PreferencesPanel.jsx# Preferences settings — spice, cuisines, dietary notes
├── App.jsx                 # Root layout — tab navigation + desktop split layout
├── App.css                 # Complete design system — all component styles
├── index.css               # Global reset + base styles
└── main.jsx                # React entry point
public/
├── favicon.ico             # Custom PantryChef favicon
├── favicon-32x32.png
├── favicon-16x16.png
└── apple-touch-icon.png
index.html                  # HTML shell with title + favicon links
```

---

## 🏃 Running Locally

### Prerequisites

- Node.js 18+ (`node -v` to check)
- npm 9+ (`npm -v` to check)
- The [backend](https://github.com/dverma9/pantrychef-backend) running on `localhost:8080`

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/dverma9/pantrychef-frontend.git
cd pantrychef-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create a `.env.local` file** in the project root:
```env
VITE_API_BASE_URL=http://localhost:8080
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open the app**
```
http://localhost:5173
```

Make sure the backend is running first, then add some ingredients and start chatting!

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend | `http://localhost:8080` |

For production deployment on Vercel, set this in:
**Vercel Dashboard → Project → Settings → Environment Variables**

```
VITE_API_BASE_URL = https://your-railway-backend-url.up.railway.app
```

---

## 🏗 Building for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Vercel handles this automatically on every push to `main`.

---

## 🚀 Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project → Import from GitHub**
3. Select `pantrychef-frontend`
4. Under **Environment Variables**, add `VITE_API_BASE_URL` pointing to your Railway backend URL
5. Click **Deploy** — Vercel auto-detects Vite and builds correctly
6. Every push to `main` triggers an automatic redeploy

---

## 🎨 Design System

All styles use CSS Custom Properties defined in `App.css`:

```css
--color-primary:       #2E7D32   /* Brand green — buttons, badges, step numbers */
--color-primary-dark:  #1B5E20   /* Header, hover states, section headers */
--color-primary-pale:  #E8F5E9   /* Hover backgrounds, active tabs */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08)
--shadow-md:  0 4px 12px rgba(0,0,0,0.10)
--radius-md:  14px               /* Chat bubbles */
--radius-full: 999px             /* Pills, badges, spice buttons */
--transition: 0.2s ease          /* All interactive elements */
```

No external UI library — all components hand-crafted with this token system.

---

## 📱 Responsive Layout

| Breakpoint | Layout |
|------------|--------|
| `< 1024px` (mobile/tablet) | 3-tab navigation: Chat / Pantry / Preferences — one panel at a time |
| `≥ 1024px` (desktop) | Split layout: Pantry (340px fixed) + Chat (flex) side by side. Preferences accessible via header button |

---

## 🧩 Key Component Notes

### `MessageBubble.jsx` — Recipe Formatter
The AI message parser handles:
- `1. Step text` → numbered badge + step text
- `- item` or `• item` → styled bullet with green dot
- `**bold**` → `<strong>` inline
- `Section header:` → uppercase bold divider
- Blank lines → natural paragraph spacing

### `ChatWindow.jsx` — Chat UX
- Textarea auto-resizes up to 120px as you type
- `Enter` sends, `Shift+Enter` adds a new line
- Last 20 messages sent as history (prevents token overflow)
- "New Chat" button appears after the first message

### `PantryManager.jsx` — Loading States
- Skeleton shimmer on initial load
- Per-item delete state (only that row fades, not the whole list)
- 404 on delete silently ignored (item already gone = success)
- Error auto-clears after a successful pantry refresh

---

## 📄 License

Built as a capstone project for the AB Talks 60-Day Claude AI Challenge.  
Free to use and learn from.

---

*Built with ⚛️ React + 🤖 AI — AB Talks 60-Day Claude AI Challenge*
