# PantryChef AI — API Design

> **Version:** 1.0 | **Day:** 2 | **Base URL (dev):** `http://localhost:8080`
> **Base URL (prod):** `https://{railway-backend-url}`

---

## 1. Overview

All endpoints return JSON. All request bodies must be `Content-Type: application/json`.
No authentication headers required (single-user app per PRD).

### Standard Error Response Format

```json
{
  "error": "Short error code",
  "message": "Human-readable description of what went wrong",
  "timestamp": "2025-07-26T10:30:00"
}
```

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success with response body |
| 201 | Resource created successfully |
| 204 | Success, no response body (delete) |
| 400 | Bad request — validation error |
| 404 | Resource not found |
| 500 | Internal server error (Claude API failure, DB error) |
| 503 | Claude API unavailable |

---

## 2. Chat Endpoints

### POST /api/chat

Send a user message and receive a PantryChef AI response.

**Purpose:** Core feature. Calls Claude API with the user's message, current pantry, and preferences as context. Returns Claude's response.

#### Request

```
POST /api/chat
Content-Type: application/json
```

```json
{
  "message": "I want something spicy with onions and tomatoes",
  "conversationHistory": [
    {
      "role": "user",
      "content": "What can I cook today?"
    },
    {
      "role": "assistant",
      "content": "Based on your pantry, you could make a tomato curry..."
    }
  ]
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `message` | String | ✅ | Not blank, max 500 chars | The user's current message |
| `conversationHistory` | Array | ❌ | Max 10 items | Previous messages for context. Omit on first message. |
| `conversationHistory[].role` | String | — | "user" or "assistant" | Speaker role |
| `conversationHistory[].content` | String | — | Not blank | Message content |

#### Response — 200 OK

```json
{
  "reply": "Great choice! With your onions, tomatoes, and the spices in your pantry, you could make a delicious Tomato Sabzi or a spicy Onion Tomato Bhaji. Would you like the full recipe for either one?",
  "timestamp": "2025-07-26T10:30:00"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `reply` | String | Claude's full response text |
| `timestamp` | String | ISO 8601 server timestamp |

#### Response — 400 Bad Request

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Message cannot be blank",
  "timestamp": "2025-07-26T10:30:00"
}
```

#### Response — 503 Service Unavailable

```json
{
  "error": "AI_UNAVAILABLE",
  "message": "PantryChef AI is temporarily unavailable. Please try again in a moment.",
  "timestamp": "2025-07-26T10:30:00"
}
```

#### Notes
- The backend automatically fetches the current pantry and preferences from the DB before calling Claude.
- `conversationHistory` is limited to the last 10 messages (enforced server-side) to control token costs.
- Claude API errors are caught and returned as 503, never as raw API errors.

---

## 3. Pantry Endpoints

### GET /api/pantry

Retrieve all ingredients currently in the user's pantry.

**Purpose:** Load the pantry list when the app starts or needs refreshing.

#### Request

```
GET /api/pantry
```

No request body.

#### Response — 200 OK

```json
[
  {
    "id": 1,
    "name": "onion",
    "quantity": "4",
    "unit": "pieces",
    "createdAt": "2025-07-26T09:00:00"
  },
  {
    "id": 2,
    "name": "basmati rice",
    "quantity": "500",
    "unit": "grams",
    "createdAt": "2025-07-26T09:01:00"
  }
]
```

Returns an empty array `[]` when pantry is empty. Never returns 404.

| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Database ID |
| `name` | String | Ingredient name |
| `quantity` | String | Amount (nullable) |
| `unit` | String | Unit of measure (nullable) |
| `createdAt` | String | ISO 8601 timestamp |

---

### POST /api/pantry

Add a new ingredient to the pantry.

**Purpose:** User adds an ingredient via the Pantry Manager form.

#### Request

```
POST /api/pantry
Content-Type: application/json
```

```json
{
  "name": "tomato",
  "quantity": "3",
  "unit": "pieces"
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | String | ✅ | Not blank, max 100 chars | Ingredient name |
| `quantity` | String | ❌ | Max 50 chars | Amount — any text value |
| `unit` | String | ❌ | Max 30 chars | Unit of measure |

#### Response — 201 Created

```json
{
  "id": 3,
  "name": "tomato",
  "quantity": "3",
  "unit": "pieces",
  "createdAt": "2025-07-26T10:30:00"
}
```

#### Response — 400 Bad Request

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Ingredient name is required",
  "timestamp": "2025-07-26T10:30:00"
}
```

---

### DELETE /api/pantry/{id}

Remove an ingredient from the pantry by ID.

**Purpose:** User clicks the delete button on an ingredient row.

#### Request

```
DELETE /api/pantry/3
```

No request body. `{id}` is the ingredient's database ID from the GET response.

#### Response — 204 No Content

Empty body. Success.

#### Response — 404 Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "Ingredient with id 3 not found",
  "timestamp": "2025-07-26T10:30:00"
}
```

---

## 4. Preferences Endpoints

### GET /api/preferences

Retrieve the user's current cooking preferences.

**Purpose:** Load preferences when the app starts (to populate the Preferences Panel).

#### Request

```
GET /api/preferences
```

No request body.

#### Response — 200 OK

```json
{
  "id": 1,
  "spiceLevel": "hot",
  "preferredCuisines": "Indian,Chinese",
  "dietaryNotes": "vegetarian",
  "dislikedIngredients": "bitter gourd"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Database ID |
| `spiceLevel` | String | One of: mild, medium, hot, very_hot |
| `preferredCuisines` | String | Comma-separated cuisine names (nullable) |
| `dietaryNotes` | String | Free-text dietary restrictions (nullable) |
| `dislikedIngredients` | String | Comma-separated disliked ingredients (nullable) |

**Note:** Returns default preferences if none have been saved yet:
```json
{
  "id": null,
  "spiceLevel": "medium",
  "preferredCuisines": null,
  "dietaryNotes": null,
  "dislikedIngredients": null
}
```

---

### PUT /api/preferences

Save or update the user's cooking preferences.

**Purpose:** User clicks "Save Preferences" in the Preferences Panel.

#### Request

```
PUT /api/preferences
Content-Type: application/json
```

```json
{
  "spiceLevel": "very_hot",
  "preferredCuisines": "Indian,Chinese,Continental",
  "dietaryNotes": "vegetarian, no onion on Tuesdays",
  "dislikedIngredients": "bitter gourd, fish"
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `spiceLevel` | String | ✅ | One of: mild, medium, hot, very_hot | Spice preference |
| `preferredCuisines` | String | ❌ | Max 500 chars | Comma-separated cuisines |
| `dietaryNotes` | String | ❌ | Max 500 chars | Any dietary restrictions |
| `dislikedIngredients` | String | ❌ | Max 500 chars | Comma-separated dislikes |

#### Response — 200 OK

```json
{
  "id": 1,
  "spiceLevel": "very_hot",
  "preferredCuisines": "Indian,Chinese,Continental",
  "dietaryNotes": "vegetarian, no onion on Tuesdays",
  "dislikedIngredients": "bitter gourd, fish"
}
```

#### Response — 400 Bad Request

```json
{
  "error": "VALIDATION_ERROR",
  "message": "spiceLevel must be one of: mild, medium, hot, very_hot",
  "timestamp": "2025-07-26T10:30:00"
}
```

---

## 5. Health Check Endpoint

### GET /api/health

Simple health check for Railway deployment monitoring.

#### Request

```
GET /api/health
```

#### Response — 200 OK

```json
{
  "status": "UP",
  "timestamp": "2025-07-26T10:30:00"
}
```

---

## 6. Complete Endpoint Summary

| Method | Path | Purpose | Day Implemented |
|--------|------|---------|-----------------|
| POST | /api/chat | Send message, get AI response | Day 3 |
| GET | /api/pantry | List all pantry ingredients | Day 3 |
| POST | /api/pantry | Add ingredient to pantry | Day 3 |
| DELETE | /api/pantry/{id} | Remove ingredient from pantry | Day 3 |
| GET | /api/preferences | Get user preferences | Day 6 |
| PUT | /api/preferences | Save/update preferences | Day 6 |
| GET | /api/health | Health check | Day 2 (stub) |

---

## 7. CORS Configuration

The backend must allow requests from:

| Environment | Origin |
|-------------|--------|
| Development | `http://localhost:5173` (Vite dev server) |
| Production | `https://pantrychef.vercel.app` (or actual Vercel URL) |

```java
// CorsConfig.java — allows all listed origins
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "${ALLOWED_ORIGINS}"  // injected from environment variable
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");
    }
}
```

---

## 8. Claude API Integration (Internal)

This is the internal call made by `ClaudeService.java` — not exposed to the frontend.

```
POST https://api.anthropic.com/v1/messages
x-api-key: {CLAUDE_API_KEY}
anthropic-version: 2023-06-01
Content-Type: application/json
```

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "{dynamically built system prompt with pantry + prefs}",
  "messages": [
    {"role": "user", "content": "previous message"},
    {"role": "assistant", "content": "previous response"},
    {"role": "user", "content": "current user message"}
  ]
}
```

**Response parsing:**
```java
String reply = response.getContent().get(0).getText();
```
