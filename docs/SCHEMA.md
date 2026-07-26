# PantryChef AI — Database Schema Design

> **Version:** 1.0 | **Day:** 2 | **Database:** PostgreSQL 15

---

## 1. Overview

PantryChef AI uses a simple two-table relational schema. The design is intentionally minimal — matching the single-user, no-auth constraint from the PRD.

| Table | Purpose | Rows |
|-------|---------|------|
| `ingredients` | User's current pantry contents | Many (one per ingredient) |
| `user_preferences` | User's cooking preferences | Always exactly 1 |

---

## 2. Table: `ingredients`

Stores every ingredient the user has added to their pantry.

### DDL

```sql
CREATE TABLE ingredients (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    quantity    VARCHAR(50),
    unit        VARCHAR(30),
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Index for faster lookups if pantry grows large
CREATE INDEX idx_ingredients_name ON ingredients(name);
```

### Column Definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Ingredient name (e.g., "onion", "basmati rice") |
| `quantity` | VARCHAR(50) | nullable | Amount (e.g., "3", "500", "half") — stored as string for flexibility |
| `unit` | VARCHAR(30) | nullable | Unit of measure (e.g., "pieces", "grams", "cups") |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When ingredient was added |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modified timestamp |

### Design Notes
- `quantity` is VARCHAR not NUMERIC because users say "half", "a bunch", "some" — keeping it human.
- No foreign key to a user table — single-user design per PRD.
- `name` has a 100 char limit — enough for any ingredient name including compound names.
- Soft delete is not used — ingredients are fully removed when deleted.

### Sample Data

```sql
INSERT INTO ingredients (name, quantity, unit) VALUES
    ('onion',        '4',   'pieces'),
    ('tomato',       '3',   'pieces'),
    ('basmati rice', '500', 'grams'),
    ('turmeric',     '1',   'teaspoon'),
    ('cumin seeds',  '2',   'tablespoons'),
    ('ginger',       '1',   'inch piece'),
    ('garlic',       '8',   'cloves'),
    ('cooking oil',  '1',   'bottle');
```

---

## 3. Table: `user_preferences`

Stores the single user's cooking preferences. Always contains exactly one row (created on first save, updated thereafter — upsert pattern).

### DDL

```sql
CREATE TABLE user_preferences (
    id                  BIGSERIAL       PRIMARY KEY,
    spice_level         VARCHAR(20)     NOT NULL DEFAULT 'medium',
    preferred_cuisines  VARCHAR(500),
    dietary_notes       VARCHAR(500),
    disliked_ingredients VARCHAR(500),
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

### Column Definitions

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | — | Auto-incrementing unique identifier |
| `spice_level` | VARCHAR(20) | NOT NULL | 'medium' | One of: mild, medium, hot, very_hot |
| `preferred_cuisines` | VARCHAR(500) | nullable | null | Comma-separated list: "Indian,Chinese,Italian" |
| `dietary_notes` | VARCHAR(500) | nullable | null | Free text: "vegetarian", "no onion", "lactose intolerant" |
| `disliked_ingredients` | VARCHAR(500) | nullable | null | Comma-separated: "bitter gourd,liver" |
| `created_at` | TIMESTAMP | NOT NULL | NOW() | When preferences were first saved |
| `updated_at` | TIMESTAMP | NOT NULL | NOW() | When preferences were last updated |

### Design Notes
- `preferred_cuisines` and `disliked_ingredients` stored as comma-separated strings for simplicity. No need for a junction table in a single-user app.
- `spice_level` uses VARCHAR with application-level enum validation rather than a DB ENUM type — easier to modify without migrations.
- Upsert strategy in Java: `findFirst().orElse(new UserPreference())` — always operate on the one row.
- `dietary_notes` is free text intentionally — users have complex and varied restrictions that dropdowns can't capture.

### Valid Values for `spice_level`

| Value | Meaning |
|-------|---------|
| `mild` | No chilli heat, gentle spices |
| `medium` | Moderate heat, standard Indian home cooking |
| `hot` | Clearly spicy, visible chilli |
| `very_hot` | Very high heat, maximum spice |

### Sample Data

```sql
INSERT INTO user_preferences (spice_level, preferred_cuisines, dietary_notes, disliked_ingredients)
VALUES ('hot', 'Indian,Chinese', 'vegetarian', 'bitter gourd');
```

---

## 4. Entity Relationship Diagram

```
┌─────────────────────────────────┐
│           ingredients           │
├─────────────────────────────────┤
│ id            BIGSERIAL  PK     │
│ name          VARCHAR(100) NN   │
│ quantity      VARCHAR(50)       │
│ unit          VARCHAR(30)       │
│ created_at    TIMESTAMP   NN    │
│ updated_at    TIMESTAMP   NN    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│        user_preferences         │
├─────────────────────────────────┤
│ id                BIGSERIAL PK  │
│ spice_level       VARCHAR(20) NN│
│ preferred_cuisines VARCHAR(500) │
│ dietary_notes     VARCHAR(500)  │
│ disliked_ingredients VARCHAR(500)│
│ created_at        TIMESTAMP  NN │
│ updated_at        TIMESTAMP  NN │
└─────────────────────────────────┘
```

No foreign key relationship — single-user design. Both tables are independent.

---

## 5. JPA Entity Mapping

### Ingredient.java

```java
@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Ingredient name is required")
    private String name;

    @Column(length = 50)
    private String quantity;

    @Column(length = 30)
    private String unit;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### UserPreference.java

```java
@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "spice_level", nullable = false, length = 20)
    private String spiceLevel = "medium";

    @Column(name = "preferred_cuisines", length = 500)
    private String preferredCuisines;

    @Column(name = "dietary_notes", length = 500)
    private String dietaryNotes;

    @Column(name = "disliked_ingredients", length = 500)
    private String dislikedIngredients;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## 6. Hibernate DDL Strategy

In `application.properties`:

```properties
# Development: auto-create tables on startup
spring.jpa.hibernate.ddl-auto=update

# Production (Railway): same setting — safe because schema is additive
spring.jpa.hibernate.ddl-auto=update
```

`update` mode: Hibernate creates tables that don't exist and adds columns that are missing — but never drops existing columns. Safe for this project.

---

## 7. PRD User Story Validation

| PRD Requirement | Table | Column | Satisfied? |
|-----------------|-------|--------|------------|
| F1: User can add ingredients with optional quantity and unit | ingredients | name, quantity, unit | ✅ |
| F1: User can remove ingredients | ingredients | id (for DELETE) | ✅ |
| F1: User can view the full pantry | ingredients | all columns | ✅ |
| F1: Pantry persisted across sessions | ingredients | persisted in PostgreSQL | ✅ |
| F5: Spice level preference | user_preferences | spice_level | ✅ |
| F5: Preferred cuisines | user_preferences | preferred_cuisines | ✅ |
| F5: Dietary restrictions | user_preferences | dietary_notes | ✅ |
| F5: Disliked ingredients | user_preferences | disliked_ingredients | ✅ |
| F5: Preferences persist across sessions | user_preferences | persisted in PostgreSQL | ✅ |
| No auth required | — | No users table needed | ✅ |

All PRD requirements are satisfied by the schema. ✅

---

## 8. Future Schema Considerations (v1.1+, Not in v1.0)

These are intentionally excluded from v1.0 per the PRD Non-Goals:

```sql
-- NOT in v1.0 — listed for awareness only
-- chat_history table (if persistence needed across sessions)
-- users table (if multi-user support added)
-- meal_plans table (if weekly planner added)
-- nutrition_data table (if calorie tracking added)
```
