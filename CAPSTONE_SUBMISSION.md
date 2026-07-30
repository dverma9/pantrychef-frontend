# 🍽️ PantryChef AI — Capstone Submission

**AB Talks 60-Day Claude AI Challenge**  
**Days 1–10 Capstone Project**  
**Submitted by:** Deepika Verma

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 Live App | [cookwithpantrychef-ai.vercel.app](https://cookwithpantrychef-ai.vercel.app) |
| 💻 Frontend Repo | [github.com/dverma9/pantrychef-frontend](https://github.com/dverma9/pantrychef-frontend) |
| ⚙️ Backend Repo | [github.com/dverma9/pantrychef-backend](https://github.com/dverma9/pantrychef-backend) |

---

## 🎯 What I Built

**PantryChef AI** is a conversational AI-powered cooking companion for solo cooks.

The core insight behind it: solo cooks often know exactly what they want to eat, but are blocked by one or two missing ingredients. Existing recipe apps ignore your actual pantry and suggest dishes that require a full grocery run. PantryChef AI does the opposite — it starts with what you *have*.

### The app does five things:

1. **Pantry Manager** — Track every ingredient at home with name, quantity, and unit. Persisted to PostgreSQL so it's there every session.

2. **Conversational AI Chat** — Tell the AI your mood, your craving, or your situation. It knows your pantry and responds like a knowledgeable friend who happens to be a great cook.

3. **Recipe Generator** — Ask for a full recipe and get numbered step-by-step instructions, ingredient quantities, serving size — all tailored to what you actually have.

4. **Missing Ingredient Finder** — Say "I want biryani" and the AI tells you exactly which ingredients you're missing, which one to order first, and what you can substitute.

5. **Preference Memory** — Set your spice level, preferred cuisines, dietary restrictions, and ingredients you dislike. The AI applies these to every single response without you having to repeat yourself.

---

## 🛠 What I Built It With

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite | Fast, component-based, easy to deploy |
| Styling | Plain CSS with design tokens | No framework dependency, full control |
| Backend | Java 17 + Spring Boot 3.x | Strong typing, production-grade REST APIs |
| Database | PostgreSQL | Reliable relational storage, Railway-native |
| AI | Google Gemini API (free tier) | Free, capable, easy to integrate |
| Frontend Deploy | Vercel | Instant deploys from GitHub, free tier |
| Backend Deploy | Railway.app | Managed Java + PostgreSQL, free tier |
| Co-builder | Claude (Anthropic) | Pair programmer, code reviewer, debugger |

**Total cost: ₹0.** Every tool and service used is on a free tier.

---

## 📅 10-Day Build Log

| Day | What Was Built |
|-----|---------------|
| Day 1 | Project planning, PRD, Blueprint, tech stack decisions |
| Day 2 | Spring Boot project setup, PostgreSQL schema, entity classes, empty controller stubs |
| Day 3 | Full Pantry CRUD API + Gemini AI integration, system prompt design |
| Day 4 | React frontend initialized, Pantry Manager UI — add, delete, persist |
| Day 5 | Chat UI complete — message bubbles, loading state, Gemini-powered responses |
| Day 6 | Preferences Panel, footer attribution, desktop nav, MVP deployed live |
| Day 7 | UI polish — recipe formatting, skeleton loaders, mobile layout, micro-interactions |
| Day 8 | End-to-end testing (7 scenarios), bug fixes, API hardening, timeouts |
| Day 9 | Professional documentation — README for both repos, capstone submission |
| Day 10 | Final demo, screenshots, community showcase |

---

## 🏆 What I'm Most Proud Of

### 1. The Recipe Formatter
AI responses come back as plain text. Getting them to render as a proper recipe card — numbered steps with green badges, bulleted ingredients, bold section headers — required writing a custom text parser in `MessageBubble.jsx`. It makes the AI's output feel like a real app feature, not a chatbot.

### 2. Zero to deployed in 10 days
I had beginner-level React experience at the start of this challenge. By Day 10, I have a fully deployed, publicly accessible application with a Java backend, PostgreSQL database, and live AI integration. That still doesn't feel entirely real.

### 3. Building with AI as a co-builder, not just a tool
Claude helped me write code, debug errors, review decisions, and think through edge cases. But more importantly, I learned *why* the code works the way it does — not just copy-paste. Every file I understand. Every decision I can explain.

### 4. The UX details
- Skeleton shimmer while the pantry loads
- Per-item delete state — only that row fades, not the whole list  
- Textarea that grows as you type
- Error messages that tell you specifically what went wrong
- 404 on delete silently ignored — because the end result is the same

None of these were in the original PRD. They came from thinking about what a real user would experience.

---

## 😓 Biggest Challenges

### CORS in production
Getting the backend to accept requests from the Vercel frontend domain took longer than expected. The fix was switching from `allowedOrigins()` to `allowedOriginPatterns()` in Spring's CORS configuration, and using an environment variable for the allowed origins so it works for both local and production without code changes.

### Gemini API response parsing
The Gemini response structure is nested several layers deep (`candidates[0].content.parts[0].text`). A null at any level crashes the parser. Added null checks at every level with descriptive error messages, but finding this took real debugging time.

### Learning React as I built
I had beginner React experience coming in. Concepts like `useEffect` cleanup, `useRef` for textarea auto-resize, and controlled form inputs all required actual understanding — not just copying. The 10-day deadline was a forcing function to actually learn, not just generate.

---

## 🔮 What I'd Build Next

If this were a real product, the next sprint would include:

- **Grocery delivery integration** — one-tap order for missing ingredients via Blinkit or Swiggy Instamart
- **Meal planning calendar** — plan the week's meals based on pantry + delivery schedule
- **Recipe history** — save recipes you've generated and liked
- **Nutritional information** — calorie count and macros per dish
- **Multi-user support** — family pantry mode
- **Voice input** — describe your craving out loud

---

## 💡 What I Learned

**About building:**
- Ship something working, then polish it. A working MVP taught me more than a perfect plan.
- Error handling is not optional — it's what separates a demo from a product.
- UX details compound. Ten small improvements feel like a completely different product.

**About AI-assisted development:**
- Claude is a co-builder, not a code generator. You still need to understand what you're building.
- The best prompt is a specific one. Vague asks get vague code.
- AI won't catch business logic errors — you have to test the real scenarios yourself.

**About me:**
- I can build a full-stack AI product from scratch in 10 days.
- I didn't know that before this challenge started.

---

## 🙏 Thank You

To the AB Talks community for the structure and accountability that made this possible.  
To Claude for being the best pair programmer I've ever had.  
To everyone who follows along — you make building in public worth it.

---

*PantryChef AI — Built in 10 days as part of the AB Talks 60-Day Claude AI Challenge*  
*Live at: [cookwithpantrychef-ai.vercel.app](https://cookwithpantrychef-ai.vercel.app)*
