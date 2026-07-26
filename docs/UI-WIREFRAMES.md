# PantryChef AI — UI & User Flow Design

> **Version:** 1.0 | **Day:** 2 | **Frontend:** React 18 + Vite | **Style:** Plain CSS

---

## 1. User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FIRST VISIT                          │
│                                                         │
│  Open App → Chat tab active by default                  │
│              │                                          │
│              ▼                                          │
│  Welcome message from PantryChef AI:                   │
│  "Hi! I'm PantryChef AI. Add some ingredients to       │
│   your pantry and let's figure out what to cook!"       │
└─────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    [Chat Tab]    [Pantry Tab]  [Preferences Tab]
          │              │              │
          ▼              ▼              ▼
    Type message    Add ingredient  Set spice level
    & send          (name+qty+unit) Set cuisines
          │              │         Set dietary notes
          ▼              │              │
    Claude responds ◄────┘◄────────────┘
    with suggestion     (pantry + prefs
          │              always used)
          ▼
    Ask for recipe?
          │
          ▼
    Full recipe shown
    inline in chat
          │
          ▼
    Mention a dish
    you can't make?
          │
          ▼
    Claude lists
    missing ingredients
```

---

## 2. Screen Map

| Screen | Tab | Primary Action | Components |
|--------|-----|----------------|------------|
| Chat | Chat | Type message, receive AI reply | Header, TabNav, ChatWindow, MessageBubble, InputBar |
| Pantry Manager | Pantry | Add/remove ingredients | Header, TabNav, PantryManager, IngredientItem, AddForm |
| Preferences | Preferences | Set cooking preferences | Header, TabNav, PreferencesPanel, SaveButton |

---

## 3. App Layout (Desktop — Two Column)

```
┌────────────────────────────────────────────────────────────────┐
│                        HEADER                                  │
│   🍽️ PantryChef AI        Your personal cooking companion     │
├─────────────────────────────────────────────────────────────── │
│  [Chat]  [Pantry (8)]  [Preferences]        ← TAB NAVIGATION  │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐ │
│  │    PANTRY PANEL         │  │      CHAT PANEL             │ │
│  │    (left, 35%)          │  │      (right, 65%)           │ │
│  │                         │  │                             │ │
│  │  Your Pantry (8 items)  │  │  🤖 Welcome message        │ │
│  │  ─────────────────────  │  │                             │ │
│  │  onion      4 pcs  [×]  │  │  👤 What can I cook?       │ │
│  │  tomato     3 pcs  [×]  │  │                             │ │
│  │  rice      500g    [×]  │  │  🤖 With your onions...    │ │
│  │  turmeric   1 tsp  [×]  │  │     Try tomato sabzi or... │ │
│  │  cumin      2 tbsp [×]  │  │                             │ │
│  │  ginger     1 inch [×]  │  │  👤 Give me the recipe!    │ │
│  │  garlic     8 clvs [×]  │  │                             │ │
│  │  oil        1 btl  [×]  │  │  🤖 Tomato Sabzi Recipe    │ │
│  │                         │  │     Serves: 2               │ │
│  │  ─────────────────────  │  │     Ingredients:            │ │
│  │  + Add Ingredient       │  │     - Tomatoes: 3 pcs      │ │
│  │  [Name    ] [Qty] [Unit]│  │     Steps:                  │ │
│  │  [  Add Button        ] │  │     1. Heat oil in pan...  │ │
│  │                         │  │     2. Add onions...       │ │
│  └─────────────────────────┘  │                             │ │
│                               │  ────────────────────────  │ │
│                               │  [Type your message...] [→]│ │
│                               └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. App Layout (Mobile — Single Column, Stacked)

```
┌─────────────────────────┐
│  🍽️ PantryChef AI      │   ← HEADER (compact)
├─────────────────────────┤
│ [Chat][Pantry(8)][Prefs]│   ← TABS (full width)
├─────────────────────────┤
│                         │
│  ACTIVE TAB CONTENT     │   ← SINGLE PANEL
│  (full width, scrollable│
│   based on active tab)  │
│                         │
│  On Chat tab:           │
│  Message bubbles        │
│  fill the screen        │
│                         │
│  ─────────────────────  │
│  [Message input...] [→] │   ← STICKY INPUT BAR
└─────────────────────────┘
```

**Mobile behavior:**
- Tabs switch between Chat, Pantry, Preferences (one at a time)
- Pantry panel is NOT shown alongside chat on mobile
- Input bar is always sticky at the bottom on Chat tab
- Touch-friendly button sizes (min 44px tap target)

---

## 5. Screen Wireframes

### 5.1 Header Component

```
┌────────────────────────────────────────────────────────────────┐
│  🍽️  PantryChef AI          Your personal cooking companion   │
│                                           [green accent bar]   │
└────────────────────────────────────────────────────────────────┘
```

- Background: dark green (#1B5E20)
- Text: white
- Height: 60px
- Logo emoji + app name on left, tagline on right (hidden on mobile)

---

### 5.2 Tab Navigation

```
┌────────────────────────────────────────────────────────────────┐
│  ┌─────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Chat   │  │  Pantry (8)  │  │  Preferences │             │
│  │ [active]│  │              │  │              │             │
│  └─────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────────────────────────┘
```

- Active tab: green underline border (#2E7D32), bold text
- Inactive tab: grey text, no border
- Pantry tab shows ingredient count badge in parentheses
- Border-bottom separator below tab bar

---

### 5.3 Chat Window

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │  🤖  PantryChef AI                         │    │
│  │  Hi! I'm PantryChef AI. Tell me what       │    │
│  │  you're craving and I'll help you cook      │    │
│  │  something amazing with what you have! 🍳  │    │
│  └────────────────────────────────────────────┘    │
│  [AI bubble: white bg, light grey border, left]    │
│                                                     │
│          ┌────────────────────────────────────┐    │
│          │  What can I make with onions?      │    │
│          └────────────────────────────────────┘    │
│          [User bubble: green bg, white text, right] │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │  🤖  PantryChef AI                         │    │
│  │  With your onions, tomatoes, and spices    │    │
│  │  you can make:                             │    │
│  │  • Tomato Sabzi (15 min)                   │    │
│  │  • Onion Bhaji (20 min)                    │    │
│  │  • Simple Dal with Tadka                   │    │
│  │  Want a full recipe for any of these?      │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │  ● ● ●  PantryChef is thinking...          │    │   ← Loading
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ─────────────────────────────────────────────     │
│  ┌────────────────────────────────────┐  ┌────┐   │
│  │  Type your message...              │  │ →  │   │  ← Input
│  └────────────────────────────────────┘  └────┘   │
└─────────────────────────────────────────────────────┘
```

**Message Bubble Design:**

| Bubble Type | Background | Text Color | Alignment | Border |
|------------|-----------|-----------|-----------|--------|
| AI (bot) | #FFFFFF | #212121 | Left | 1px solid #E0E0E0, border-radius 12px |
| User | #2E7D32 | #FFFFFF | Right | None, border-radius 12px |
| Loading | #F5F5F5 | #9E9E9E | Left | 1px solid #E0E0E0 |

**Input Bar:**
- Sticky at bottom of chat panel
- Text input: full width, border-radius 8px, max 500 chars
- Character counter shows when > 400 chars: "450/500"
- Send button: green (#2E7D32), arrow icon →, disabled when empty

**Recipe Formatting:**
- AI recipe messages use `white-space: pre-wrap` for line breaks
- Numbered steps render with visible line breaks
- Ingredient list indented with • bullets

---

### 5.4 Pantry Manager

```
┌─────────────────────────────────────────┐
│  Your Pantry                            │
│  ─────────────────────────────────────  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Name         Qty    Unit     [×] │  │
│  │  ──────────── ─────  ────     ─── │  │
│  │  onion        4      pieces   [×] │  │
│  │  tomato       3      pieces   [×] │  │
│  │  basmati rice 500    grams    [×] │  │
│  │  turmeric     1      teaspoon [×] │  │
│  │  cumin seeds  2      tbsp     [×] │  │
│  │  ginger       1      inch     [×] │  │
│  │  garlic       8      cloves   [×] │  │
│  │  cooking oil  1      bottle   [×] │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────────────────────────────────  │
│  Add Ingredient                         │
│  ┌──────────────┐ ┌──────┐ ┌────────┐  │
│  │ Name *       │ │ Qty  │ │ Unit   │  │
│  └──────────────┘ └──────┘ └────────┘  │
│  [         Add to Pantry              ] │
│                                         │
│  (empty state)                          │
│  🥘 Your pantry is empty.               │
│     Add some ingredients to get started!│
└─────────────────────────────────────────┘
```

**Design Notes:**
- Delete button [×]: red (#D32F2F) on hover, grey when idle
- Name field is required (marked with *)
- Qty and Unit are optional
- "Add to Pantry" button: green, full width, disabled when name is empty
- Ingredients sorted by creation time (newest last)
- No edit-in-place in v1.0 — delete and re-add to change

---

### 5.5 Preferences Panel

```
┌─────────────────────────────────────────┐
│  Cooking Preferences                    │
│  ─────────────────────────────────────  │
│                                         │
│  Spice Level                            │
│  ┌─────────────────────────────────┐   │
│  │  Hot                         ▼  │   │  ← Dropdown
│  └─────────────────────────────────┘   │
│                                         │
│  Preferred Cuisines                     │
│  ☑ Indian   ☑ Chinese   □ Italian      │
│  □ Continental   □ Mexican   □ Thai     │
│                                         │
│  Dietary Restrictions                   │
│  ┌─────────────────────────────────┐   │
│  │  vegetarian                     │   │  ← Free text textarea
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Disliked Ingredients                   │
│  ┌─────────────────────────────────┐   │
│  │  bitter gourd                   │   │  ← Free text
│  └─────────────────────────────────┘   │
│                                         │
│  [        Save Preferences           ]  │  ← Green button
│                                         │
│  ✓ Preferences saved!  ← Success toast  │
└─────────────────────────────────────────┘
```

**Spice Level Options (dropdown):**
- Mild
- Medium (default)
- Hot
- Very Hot

**Cuisine Checkboxes:**
- Indian
- Chinese
- Italian
- Continental
- Mexican
- Thai
- (user can check multiple)

---

## 6. Component Tree

```
App.jsx
├── Header.jsx
├── TabNavigation.jsx (Chat | Pantry | Preferences)
└── MainContent.jsx
    ├── [Chat Tab] ChatWindow.jsx
    │   ├── MessageBubble.jsx (×N, type: "user" | "ai" | "loading")
    │   └── MessageInput.jsx (textarea + send button + char counter)
    ├── [Pantry Tab] PantryManager.jsx
    │   ├── IngredientList.jsx
    │   │   └── IngredientItem.jsx (×N)
    │   └── AddIngredientForm.jsx
    └── [Preferences Tab] PreferencesPanel.jsx
        ├── SpiceLevelSelect.jsx
        ├── CuisineCheckboxes.jsx
        ├── DietaryTextarea.jsx
        ├── DislikedTextarea.jsx
        └── SaveButton.jsx
```

---

## 7. Navigation Flow

```
App Load
    │
    ▼
Fetch preferences (preferencesApi)
Fetch pantry count (pantryApi)
    │
    ▼
Default tab: CHAT
    │
    ├── User clicks "Pantry" tab → PantryManager shown
    │   ├── Fetch ingredients on mount
    │   ├── User adds ingredient → POST /api/pantry → refresh list
    │   └── User clicks [×] → DELETE /api/pantry/{id} → refresh list
    │
    ├── User clicks "Preferences" tab → PreferencesPanel shown
    │   ├── Form pre-filled with saved preferences
    │   └── User clicks Save → PUT /api/preferences → show toast
    │
    └── User on Chat tab
        ├── Types message → POST /api/chat → append reply
        ├── Loading state shown during API call
        └── Error state shown if API fails
```

---

## 8. Color Palette & Design Tokens

```css
:root {
  /* Primary */
  --color-primary:       #2E7D32;   /* Green — buttons, active states */
  --color-primary-dark:  #1B5E20;   /* Dark green — header, hover */
  --color-primary-light: #4CAF50;   /* Light green — accents */
  --color-primary-pale:  #E8F5E9;   /* Pale green — AI bubble hover */

  /* Neutrals */
  --color-white:         #FFFFFF;
  --color-grey-light:    #F5F5F5;   /* Page background */
  --color-grey-border:   #E0E0E0;   /* Borders */
  --color-grey-mid:      #9E9E9E;   /* Placeholder text */
  --color-grey-dark:     #616161;   /* Secondary text */
  --color-text:          #212121;   /* Primary text */

  /* Functional */
  --color-error:         #D32F2F;   /* Red — delete buttons, errors */
  --color-success:       #388E3C;   /* Success toast */
  --color-user-bubble:   #2E7D32;   /* User chat bubble */
  --color-ai-bubble:     #FFFFFF;   /* AI chat bubble */

  /* Typography */
  --font-family:         'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-base:      16px;
  --font-size-sm:        14px;
  --font-size-lg:        18px;
  --font-size-xl:        24px;

  /* Spacing */
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  16px;
  --spacing-lg:  24px;
  --spacing-xl:  32px;

  /* Layout */
  --border-radius-sm:    6px;
  --border-radius-md:    12px;
  --border-radius-lg:    20px;
  --sidebar-width:       35%;
  --chat-width:          65%;
  --header-height:       60px;
  --tab-height:          48px;
  --input-bar-height:    70px;

  /* Transitions */
  --transition-fast:     0.15s ease;
  --transition-base:     0.2s ease;
}
```

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, tabs switch panels |
| Tablet | 768px–1024px | Single column (same as mobile) |
| Desktop | > 1024px | Two-column: Pantry left + Chat right |

```css
/* Desktop: two columns visible simultaneously */
@media (min-width: 1024px) {
  .main-content { display: flex; }
  .pantry-panel { width: var(--sidebar-width); display: block; }
  .chat-panel   { width: var(--chat-width); }
}

/* Mobile/Tablet: single column, tab controls visibility */
@media (max-width: 1023px) {
  .main-content { display: block; }
  .pantry-panel { display: none; }     /* Hidden unless Pantry tab active */
  .chat-panel   { width: 100%; }
}
```
