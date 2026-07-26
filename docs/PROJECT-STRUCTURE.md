# PantryChef AI — Project Structure

> **Version:** 1.0 | **Day:** 2

---

## 1. Repository Structure

Two separate repositories, one GitHub account:

```
GitHub Account
├── pantrychef-backend/    ← Spring Boot backend (deployed to Railway.app)
└── pantrychef-frontend/   ← React frontend (deployed to Vercel)
```

Why two repos? Railway deploys the backend JAR, Vercel deploys the React build. Keeping them separate makes deployment configuration simpler and avoids conflicts.

---

## 2. Backend Repository: `pantrychef-backend`

```
pantrychef-backend/
│
├── .github/                          # GitHub config (optional)
│   └── workflows/                    # CI/CD if added later
│
├── .mvn/                             # Maven wrapper (required for Railway)
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── pantrychef/
│   │   │           │
│   │   │           ├── PantryChefApplication.java     ← Main entry point (@SpringBootApplication)
│   │   │           │
│   │   │           ├── config/                        ← Spring configuration classes
│   │   │           │   ├── CorsConfig.java            ← CORS whitelist (localhost + Vercel)
│   │   │           │   └── AppConfig.java             ← Beans: RestTemplate
│   │   │           │
│   │   │           ├── controller/                    ← REST API layer (HTTP in, JSON out)
│   │   │           │   ├── ChatController.java        ← POST /api/chat
│   │   │           │   ├── PantryController.java      ← GET/POST/DELETE /api/pantry
│   │   │           │   ├── PreferenceController.java  ← GET/PUT /api/preferences
│   │   │           │   └── HealthController.java      ← GET /api/health
│   │   │           │
│   │   │           ├── service/                       ← Business logic layer
│   │   │           │   ├── ClaudeService.java         ← Calls Anthropic API, builds system prompt
│   │   │           │   ├── IngredientService.java     ← Pantry CRUD operations
│   │   │           │   └── PreferenceService.java     ← Preferences upsert logic
│   │   │           │
│   │   │           ├── repository/                    ← JPA data access layer
│   │   │           │   ├── IngredientRepository.java  ← extends JpaRepository<Ingredient, Long>
│   │   │           │   └── PreferenceRepository.java  ← extends JpaRepository<UserPreference, Long>
│   │   │           │
│   │   │           ├── entity/                        ← JPA entities (map to DB tables)
│   │   │           │   ├── Ingredient.java            ← maps to ingredients table
│   │   │           │   └── UserPreference.java        ← maps to user_preferences table
│   │   │           │
│   │   │           ├── dto/                           ← Data Transfer Objects (API contracts)
│   │   │           │   ├── ChatRequest.java           ← { message, conversationHistory[] }
│   │   │           │   ├── ChatResponse.java          ← { reply, timestamp }
│   │   │           │   ├── IngredientDto.java         ← { name, quantity, unit }
│   │   │           │   ├── ConversationMessage.java   ← { role, content }
│   │   │           │   └── PreferenceDto.java         ← { spiceLevel, cuisines, dietary, dislikes }
│   │   │           │
│   │   │           └── exception/                     ← Error handling
│   │   │               ├── GlobalExceptionHandler.java ← @ControllerAdvice for all errors
│   │   │               └── ResourceNotFoundException.java ← 404 errors
│   │   │
│   │   └── resources/
│   │       ├── application.properties                 ← Main config (DB, Claude key, JPA settings)
│   │       └── application-prod.properties            ← Production overrides (if needed)
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── pantrychef/
│                   ├── PantryChefApplicationTests.java  ← Context load test
│                   ├── controller/
│                   │   └── PantryControllerTest.java    ← Day 8 testing
│                   └── service/
│                       └── ClaudeServiceTest.java       ← Day 8 testing
│
├── .gitignore                         ← Ignore: target/, *.class, application-local.properties
├── mvnw                               ← Maven wrapper script (Unix)
├── mvnw.cmd                           ← Maven wrapper script (Windows)
├── pom.xml                            ← Maven project config + dependencies
├── railway.toml                       ← Railway deployment config
└── README.md                          ← Setup instructions (written Day 10)
```

---

## 3. Backend File Responsibilities

### Entry Point
| File | Responsibility |
|------|----------------|
| `PantryChefApplication.java` | Spring Boot entry point. `@SpringBootApplication`. `main()` method. Nothing else. |

### Config Layer
| File | Responsibility |
|------|----------------|
| `CorsConfig.java` | Implements `WebMvcConfigurer`. Whitelists allowed origins for `/api/**`. Reads `ALLOWED_ORIGINS` env var. |
| `AppConfig.java` | Declares `@Bean RestTemplate` used by `ClaudeService`. |

### Controller Layer
| File | Responsibility |
|------|----------------|
| `ChatController.java` | Single endpoint: `POST /api/chat`. Validates `ChatRequest`, delegates to `ClaudeService`, returns `ChatResponse`. |
| `PantryController.java` | Three endpoints: `GET /api/pantry`, `POST /api/pantry`, `DELETE /api/pantry/{id}`. Delegates to `IngredientService`. |
| `PreferenceController.java` | Two endpoints: `GET /api/preferences`, `PUT /api/preferences`. Delegates to `PreferenceService`. |
| `HealthController.java` | One endpoint: `GET /api/health`. Returns `{status: "UP"}`. No service layer needed. |

### Service Layer
| File | Responsibility |
|------|----------------|
| `ClaudeService.java` | Fetches pantry + prefs from DB. Builds system prompt. Calls Anthropic API via `RestTemplate`. Parses response. Returns reply string. Handles API errors. |
| `IngredientService.java` | Wraps `IngredientRepository`. Methods: `getAll()`, `save(dto)`, `deleteById(id)`. Converts between entities and DTOs. |
| `PreferenceService.java` | Wraps `PreferenceRepository`. Methods: `getPreferences()` (returns default if none), `upsert(dto)`. |

### Repository Layer
| File | Responsibility |
|------|----------------|
| `IngredientRepository.java` | `extends JpaRepository<Ingredient, Long>`. No custom methods needed — standard CRUD from JPA. |
| `PreferenceRepository.java` | `extends JpaRepository<UserPreference, Long>`. Custom method: `findFirst()` for the upsert pattern. |

### Entity Layer
| File | Responsibility |
|------|----------------|
| `Ingredient.java` | JPA entity for the `ingredients` table. Lombok `@Data`, `@Builder`. Timestamps via `@CreationTimestamp`, `@UpdateTimestamp`. |
| `UserPreference.java` | JPA entity for the `user_preferences` table. Same Lombok annotations. |

### DTO Layer
| File | Responsibility |
|------|----------------|
| `ChatRequest.java` | Incoming chat request body. Fields: `message` (required), `conversationHistory` (optional list). |
| `ChatResponse.java` | Outgoing chat response. Fields: `reply` (string), `timestamp`. |
| `IngredientDto.java` | Used for both request body (add ingredient) and response body. Fields: `id`, `name`, `quantity`, `unit`, `createdAt`. |
| `ConversationMessage.java` | Nested object inside `ChatRequest.conversationHistory`. Fields: `role`, `content`. |
| `PreferenceDto.java` | Used for both GET and PUT preferences. Fields: `id`, `spiceLevel`, `preferredCuisines`, `dietaryNotes`, `dislikedIngredients`. |

### Exception Layer
| File | Responsibility |
|------|----------------|
| `GlobalExceptionHandler.java` | `@ControllerAdvice`. Catches validation errors (400), not-found errors (404), Claude API errors (503), all others (500). Returns standard error JSON. |
| `ResourceNotFoundException.java` | Custom `RuntimeException`. Thrown by services when ID not found. Caught by `GlobalExceptionHandler` → 404. |

---

## 4. Frontend Repository: `pantrychef-frontend`

```
pantrychef-frontend/
│
├── public/
│   └── favicon.ico                    ← App favicon (cooking emoji or custom)
│
├── src/
│   │
│   ├── api/                           ← All HTTP calls to backend (Axios)
│   │   ├── chatApi.js                 ← postMessage(message, history) → reply
│   │   ├── pantryApi.js               ← getIngredients(), addIngredient(), deleteIngredient()
│   │   └── preferencesApi.js          ← getPreferences(), updatePreferences()
│   │
│   ├── components/                    ← React components (UI building blocks)
│   │   ├── Header.jsx                 ← App header with logo and tagline
│   │   ├── TabNavigation.jsx          ← Tab bar: Chat | Pantry(N) | Preferences
│   │   ├── ChatWindow.jsx             ← Chat panel: message list + input bar
│   │   ├── MessageBubble.jsx          ← Single message bubble (user/ai/loading variant)
│   │   ├── MessageInput.jsx           ← Textarea + send button + char counter
│   │   ├── PantryManager.jsx          ← Pantry panel: list + add form
│   │   ├── IngredientItem.jsx         ← Single ingredient row with delete button
│   │   ├── AddIngredientForm.jsx      ← Name + qty + unit form + add button
│   │   └── PreferencesPanel.jsx       ← Spice dropdown + cuisine checkboxes + text fields
│   │
│   ├── App.jsx                        ← Root component: state, tab routing, layout
│   ├── App.css                        ← All application styles (single CSS file)
│   └── main.jsx                       ← Vite entry point (renders <App /> into #root)
│
├── .env                               ← Dev: VITE_API_BASE_URL=http://localhost:8080
├── .env.production                    ← Prod: VITE_API_BASE_URL=https://railway-url
├── .gitignore                         ← Ignore: node_modules/, dist/, .env.local
├── index.html                         ← Vite HTML shell (root div, script import)
├── package.json                       ← npm scripts + dependencies
├── vite.config.js                     ← Vite configuration
└── README.md                          ← Frontend setup instructions (written Day 10)
```

---

## 5. Frontend File Responsibilities

### API Layer (`src/api/`)
| File | Responsibility |
|------|----------------|
| `chatApi.js` | `postMessage(message, history)` → calls `POST /api/chat` → returns `reply` string. Throws on error. |
| `pantryApi.js` | `getIngredients()`, `addIngredient(dto)`, `deleteIngredient(id)` → wraps backend pantry endpoints. |
| `preferencesApi.js` | `getPreferences()`, `updatePreferences(dto)` → wraps backend preferences endpoints. |

All API files share one Axios instance configured with `VITE_API_BASE_URL` as base URL.

### Component Layer (`src/components/`)
| File | Responsibility |
|------|----------------|
| `Header.jsx` | Static. Renders app name, emoji, tagline. No state. |
| `TabNavigation.jsx` | Renders 3 tabs. Accepts `activeTab`, `pantryCount`, `onTabChange` props. No internal state. |
| `ChatWindow.jsx` | Manages `messages[]` array and `isLoading` state. Calls `chatApi.postMessage()`. Renders `MessageBubble` list. Auto-scrolls. |
| `MessageBubble.jsx` | Accepts `type` ("user"/"ai"/"loading") and `content` props. Renders styled bubble. No state. |
| `MessageInput.jsx` | Manages `inputText` state. Accepts `onSend`, `isDisabled` props. Renders textarea + send button + char counter. |
| `PantryManager.jsx` | Manages `ingredients[]` state. Calls pantryApi. Renders `IngredientItem` list and `AddIngredientForm`. |
| `IngredientItem.jsx` | Accepts `ingredient`, `onDelete` props. Renders name/qty/unit row with delete button. No state. |
| `AddIngredientForm.jsx` | Manages form fields state. Accepts `onAdd` prop. Validates name. Calls parent `onAdd` on submit. |
| `PreferencesPanel.jsx` | Manages form state (loaded from props). Accepts `preferences`, `onSave` props. Renders all pref fields. Calls `onSave` on submit. |

### Root Level
| File | Responsibility |
|------|----------------|
| `App.jsx` | Application root. Manages: `activeTab`, `pantryCount`, `preferences`. Fetches initial data on mount. Routes which panel renders based on `activeTab`. Passes callbacks down to children. |
| `App.css` | All styles. CSS custom properties at `:root`. Styles for every component. Responsive media queries. |
| `main.jsx` | `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`. Nothing else. |

---

## 6. Key Configuration Files

### `pom.xml` — Backend Dependencies

```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<properties>
    <java.version>17</java.version>
</properties>
```

### `application.properties` — Backend Config

```properties
# Server
server.port=8080

# Database
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/pantrychef}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Claude API
claude.api.key=${CLAUDE_API_KEY}
claude.api.url=https://api.anthropic.com/v1/messages
claude.model=claude-sonnet-4-6

# CORS
allowed.origins=${ALLOWED_ORIGINS:http://localhost:5173}
```

### `railway.toml` — Deployment Config

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "java -jar target/pantrychef-0.0.1-SNAPSHOT.jar"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
```

### `vite.config.js` — Frontend Config

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### `package.json` — Frontend Dependencies

```json
{
  "name": "pantrychef-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## 7. `.gitignore` Files

### Backend `.gitignore`

```
target/
*.class
*.jar
*.war
.idea/
*.iml
.DS_Store
application-local.properties
```

### Frontend `.gitignore`

```
node_modules/
dist/
.env.local
.DS_Store
*.log
```

---

## 8. Initial Folder Setup Commands

Run these exactly, in this order, after cloning both repos:

```bash
# Backend (already created by Spring Initializr)
cd pantrychef-backend
mkdir -p src/main/java/com/pantrychef/{config,controller,service,repository,entity,dto,exception}

# Frontend (created by Vite)
cd pantrychef-frontend
mkdir -p src/{api,components}
```
