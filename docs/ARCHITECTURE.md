# PantryChef AI — System Architecture

> **Version:** 1.0 | **Day:** 2 | **Status:** Design Complete

---

## 1. Overview

PantryChef AI is a single-user, full-stack web application with three distinct tiers:

| Tier | Technology | Responsibility |
|------|-----------|----------------|
| Frontend | React 18 + Vite | UI: Chat, Pantry, Preferences |
| Backend | Java 17 + Spring Boot 3.x | REST API, Business Logic, Claude Orchestration |
| Database | PostgreSQL 15 | Persistent storage for pantry, preferences |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Conversational intelligence |

---

## 2. Tech Stack Decisions

### Frontend: React 18 + Vite
- **Why React:** Component-based architecture ideal for chat + pantry list UI. Large ecosystem, beginner-friendly hooks API.
- **Why Vite (not CRA):** Significantly faster dev server startup and HMR. Industry standard in 2025.
- **Why not Angular/Vue:** React chosen for larger community, more AI chat examples to learn from.
- **Styling:** Plain CSS with CSS variables — no heavy framework needed for a focused single-user app.

### Backend: Java 17 + Spring Boot 3.x
- **Why Java:** 15 years of developer expertise. Zero learning curve = maximum productivity in 9 days.
- **Why Spring Boot 3.x:** Auto-configuration, JPA integration, REST support out of the box. Production-grade from day one.
- **HTTP Client:** Spring's built-in `RestTemplate` for Claude API calls — no extra dependency.

### Database: PostgreSQL 15
- **Why PostgreSQL:** Relational structure fits pantry (rows of ingredients) and preferences (single-row settings) perfectly. ACID compliance. Free on Railway.app.
- **Why not MongoDB:** Structured data doesn't benefit from document storage. JPA + PostgreSQL is the fastest path given Java expertise.
- **Why not H2 in-memory:** Data must persist across sessions and deployments.

### AI: Anthropic Claude API (claude-sonnet-4-6)
- **Why Claude:** The challenge requirement. Claude's long context window is ideal for injecting full pantry + preferences into every request.
- **Model:** `claude-sonnet-4-6` — best balance of quality and cost for a conversational cooking assistant.
- **Integration:** Backend-only. The Claude API key never touches the frontend.

### Hosting: Railway.app (backend) + Vercel (frontend)
- **Railway:** Free tier supports Spring Boot JARs + managed PostgreSQL in the same project. Simple GitHub-connected auto-deploy.
- **Vercel:** Best-in-class free hosting for Vite/React apps. Auto-deploy from GitHub. Zero config needed.
- **Why not one platform:** Railway doesn't serve static React builds as cleanly as Vercel. Splitting is the free-tier optimal choice.

---

## 3. Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        BROWSER                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  ChatWindow  │  │PantryManager │  │ Preferences  │  │
│  │  Component   │  │  Component   │  │   Panel      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────▼─────────────────▼──────────────────▼───────┐  │
│  │              Axios HTTP Client Layer               │  │
│  │  chatApi.js | pantryApi.js | preferencesApi.js     │  │
│  └───────────────────────┬───────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTPS REST
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    SPRING BOOT SERVER                    │
│                     (Railway.app)                        │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Controller Layer                      │  │
│  │  ChatController | PantryController | PrefController│  │
│  └──────┬──────────────────┬──────────────────┬──────┘  │
│         │                  │                  │         │
│  ┌──────▼──────┐  ┌────────▼──────┐  ┌────────▼──────┐  │
│  │ClaudeService│  │IngredientSvc  │  │PreferencesSvc │  │
│  └──────┬──────┘  └────────┬──────┘  └────────┬──────┘  │
│         │                  │                  │         │
│  ┌──────▼──────┐  ┌────────▼──────────────────▼──────┐  │
│  │ RestTemplate│  │         JPA Repositories          │  │
│  └──────┬──────┘  └────────────────────┬──────────────┘  │
└─────────┼───────────────────────────────┼───────────────┘
          │ HTTPS                         │ JDBC
          │                              │
┌─────────▼──────────┐     ┌─────────────▼──────────────┐
│  Anthropic Claude  │     │      PostgreSQL 15           │
│  API               │     │      (Railway.app)           │
│  api.anthropic.com │     │  ingredients table          │
│                    │     │  user_preferences table     │
└────────────────────┘     └────────────────────────────┘
```

---

## 4. Request Lifecycle

### 4.1 Chat Message Request

```
User types message → [React ChatWindow]
    │
    ▼
chatApi.js POST /api/chat { message: "I want biryani" }
    │
    ▼
[ChatController.sendMessage()]
    │
    ├── IngredientService.getAllIngredients()  → DB query
    │
    ├── PreferenceService.getPreferences()    → DB query
    │
    ├── ClaudeService.chat(message, pantry, prefs)
    │       │
    │       ├── Build system prompt (pantry + prefs injected)
    │       │
    │       └── POST https://api.anthropic.com/v1/messages
    │               { model, system, messages[], max_tokens }
    │
    ├── Parse Claude response → extract content[0].text
    │
    └── Return ChatResponse { reply: "..." }
    │
    ▼
chatApi.js receives response
    │
    ▼
ChatWindow appends AI message bubble to UI
```

### 4.2 Pantry Add Request

```
User fills form → [React PantryManager]
    │
    ▼
pantryApi.js POST /api/pantry { name, quantity, unit }
    │
    ▼
[PantryController.addIngredient()]
    │
    ├── Validate: name is required
    │
    ├── IngredientService.save(ingredientDto)
    │       └── JPA repo.save(entity) → INSERT INTO ingredients
    │
    └── Return 201 + saved Ingredient JSON
    │
    ▼
PantryManager refreshes list
```

### 4.3 Preferences Update Request

```
User changes settings → [React PreferencesPanel]
    │
    ▼
preferencesApi.js PUT /api/preferences { spiceLevel, cuisines, dietary }
    │
    ▼
[PreferenceController.updatePreferences()]
    │
    ├── PreferenceService.upsert(prefsDto)
    │       ├── findFirst() → existing row or new entity
    │       └── repo.save(entity) → INSERT or UPDATE
    │
    └── Return 200 + saved preferences JSON
    │
    ▼
App.jsx updates preferences state
```

---

## 5. AI Interaction Design

### System Prompt Structure

Every Claude API call sends this system prompt, dynamically built:

```
You are PantryChef AI, a warm, knowledgeable, and practical cooking companion.
Your job is to help the user decide what to cook and how to cook it.

=== USER'S PANTRY ===
{ingredient list formatted as: "- {name}: {quantity} {unit}"}

=== USER'S PREFERENCES ===
- Spice level: {spiceLevel}
- Preferred cuisines: {cuisines joined by comma}
- Dietary restrictions: {dietary}
- Disliked ingredients: {dislikes}

=== YOUR BEHAVIOR RULES ===
1. Always suggest dishes the user can make with their CURRENT pantry first.
2. When asked for a recipe, provide: dish name, serving size, ingredient list with quantities, numbered step-by-step instructions.
3. When the user mentions a dish they cannot make, clearly list the MISSING ingredients, one per line. Mark the single most important one to order.
4. Always respect spice level and dietary restrictions — never suggest something that violates them.
5. If the pantry is empty, gently ask the user to add some ingredients first.
6. Keep your tone warm, encouraging, and conversational — like a knowledgeable friend in the kitchen.
7. Keep responses concise unless a full recipe is requested.
```

### Conversation History Strategy
- Chat history is **session-only** (React state, not persisted to DB in v1.0)
- Last **10 messages** maximum sent to Claude per call (to manage token costs)
- Each call always includes the full system prompt (pantry + prefs re-fetched from DB)
- This means pantry changes mid-conversation are reflected immediately in next response

---

## 6. Security Design

| Concern | Approach |
|---------|----------|
| Claude API Key | Backend environment variable only. Never sent to frontend. |
| No Auth needed | Single-user app. No login required per PRD. |
| CORS | Whitelist: localhost:5173 (dev), Vercel URL (prod) |
| SQL Injection | Prevented by JPA parameterized queries |
| Input validation | Server-side: @NotBlank on ingredient name, max lengths enforced |

---

## 7. Deployment Architecture

```
                    [User Browser]
                         │
                    HTTPS (443)
                         │
              ┌──────────▼──────────┐
              │   Vercel CDN Edge   │
              │  pantrychef.vercel  │
              │  (React SPA files)  │
              └──────────┬──────────┘
                         │
                    HTTPS REST API
                         │
              ┌──────────▼──────────┐
              │   Railway.app       │
              │  Spring Boot JAR    │
              │  Port 8080 → 443    │
              └───────┬─────┬───────┘
                      │     │
              ┌───────▼──┐  └──────────────────┐
              │PostgreSQL│                     │
              │Railway   │          ┌───────────▼──────────┐
              │(same     │          │  Anthropic Claude API │
              │project)  │          │  api.anthropic.com    │
              └──────────┘          └──────────────────────┘
```

---

## 8. Environment Variables

### Backend (Railway.app)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://{host}:{port}/pantrychef
SPRING_DATASOURCE_USERNAME={railway_pg_user}
SPRING_DATASOURCE_PASSWORD={railway_pg_password}
CLAUDE_API_KEY=sk-ant-...
ALLOWED_ORIGINS=https://pantrychef.vercel.app,http://localhost:5173
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://{railway-backend-url}
```

---

## 9. Key Design Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Chat history persistence | Session-only (not DB) | Simplifies v1.0. Each conversation starts fresh. Pantry + prefs provide continuity. |
| Single user, no auth | No login | PRD explicit constraint. Saves 1–2 days of implementation. |
| Backend owns Claude calls | Spring Boot → Claude | API key security. Allows server-side prompt engineering. Frontend stays clean. |
| Vite over CRA | Vite | Faster dev experience, modern toolchain, better for beginners to debug. |
| RestTemplate over WebClient | RestTemplate | Simpler synchronous code. WebClient async adds complexity not needed here. |
| CSS only (no Tailwind/MUI) | Plain CSS | Tailwind requires build config. MUI adds heavy bundle. Plain CSS is fully learnable. |
