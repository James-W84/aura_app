# Aura MVP - Quick Reference

## File Structure Quick Reference

### Backend Key Files

```
/api/src
├── index.ts                      # Express app setup, middleware registration
├── controllers/
│   ├── promptController.ts       # GET /prompts/available/:userId
│   ├── choiceController.ts       # POST /choices (ACCEPT/REJECT/DELAY)
│   └── entryController.ts        # POST/PUT/GET /entries (CRUD)
├── routes/
│   ├── promptRoutes.ts           # Router for prompts
│   ├── choiceRoutes.ts           # Router for choices
│   └── entryRoutes.ts            # Router for entries
└── middleware/
    └── errorHandler.ts           # Error handling, ApiError class
/api/prisma
├── schema.prisma                 # Data models: User, Prompt, Choice, Entry
└── seed.ts                       # Seed data: 1 user, 20 prompts
/api/.env                         # DB_URL, PORT, CORS_ORIGIN
/api/package.json                 # Scripts: dev, build, prisma:*
```

### Mobile Key Files

```
/mobile/src
├── types/index.ts                # Shared TS interfaces (User, Entry, Choice, etc)
├── lib/
│   ├── api.ts                    # Axios HTTP client with interceptors
│   └── theme.ts                  # Design tokens (COLORS, SPACING, etc)
├── store/
│   ├── usePromptStore.ts         # Zustand: prompts[], handleDecision()
│   ├── useEntryStore.ts          # Zustand: entries[], auto-save debounce
│   └── useUserStore.ts           # Zustand: currentUserId (hardcoded: 1)
├── components/
│   ├── CardStack.tsx              # Swipe gesture handler, Animated card deck
│   ├── PromptCard.tsx             # Display prompt text & category
│   ├── PebbleCard.tsx             # Display entry date & snippet
│   └── ErrorBoundary.tsx          # React error boundary wrapper
└── features/
   ├── decide/
   │   └── DecideScreen.tsx         # Swipe deck: Right=Accept, Left=Reject, Up=Delay
   ├── journal/
   │   └── JournalScreen.tsx        # Text editor + auto-save + Finish button
   └── history/
       └── HistoryScreen.tsx        # Paginated pebble list + infinite scroll
/mobile/App.tsx                      # Root: ErrorBoundary → Navigation stack
/mobile/.env                         # API_BASE_URL="http://localhost:5000"
/mobile/package.json                 # Scripts: start, build, ios, android, web
```

---

## API Endpoints Quick Reference

### Prompts

```bash
GET /prompts/available/:userId
# Response: Prompt[]
# Example: curl http://localhost:5000/prompts/available/1
```

### Choices

```bash
POST /choices
# Body: { userId: 1, promptId: 5, decision: "ACCEPT" | "REJECT" | "DELAY" }
# Response: Choice { userId, promptId, decision, createdAt }
```

### Entries

```bash
# Create
POST /entries
# Body: { userId: 1, promptId?: 5, content: "" }
# Response: Entry { id, userId, promptId, content, createdAt, updatedAt }

# Auto-save (debounced)
PUT /entries/:entryId
# Body: { content: "Updated text..." }
# Response: Entry

# Get paginated
GET /entries/user/:userId?page=0&limit=10
# Response: { entries: Entry[], total, page, limit }

# Get single
GET /entries/:entryId
# Response: Entry

# Delete
DELETE /entries/:entryId
# Response: { message: "Entry deleted successfully" }
```

---

## Zustand Store Examples

### usePromptStore

```typescript
const { prompts, currentIndex, loading, error, fetchPrompts, handleDecision } = usePromptStore();

// Load prompts for user
await fetchPrompts(userId: 1);

// Record decision (incrementally updates currentIndex)
await handleDecision(userId: 1, promptId: 5, "ACCEPT");
```

### useEntryStore

```typescript
const {
  entries, currentEntry, currentEntryContent, autoSaveStatus,
  createEntry, updateEntry, fetchEntries, clearCurrent
} = useEntryStore();

// Create entry on mount
const entry = await createEntry({ userId: 1, promptId: 5, content: "" });

// Auto-save on text change (500ms debounce)
updateEntry(entryId: 1, "New text...", userId: 1);

// Fetch paginated history
await fetchEntries(userId: 1, pageNumber: 0);

// Clear after navigation
clearCurrent();
```

---

## Design Tokens

### Colors (Windy Beach Palette)

```typescript
// In mobile/src/lib/theme.ts, referenced as COLORS.
COLORS.background; // #F5F5F2 – Soft Sand
COLORS.card; // #FFFFFF – White
COLORS.primary; // #81D4FA – Light Sky Blue
COLORS.accent; // #FFA726 – Sunlight Orange
COLORS.text; // #37474F – Wet Slate
```

### Spacing

```typescript
SPACING.xs   // 4
SPACING.sm   // 8
SPACING.md   // 16
SPACING.lg   // 24
SPACING.xl   // 32
SPACING.2xl  // 48
```

### Border Radius

```typescript
BORDER_RADIUS.glass; // 40px (cards)
BORDER_RADIUS.pebble; // 32px (history entries)
```

---

## Key Flows

### Swipe → Accept → Write → Save → History

```
DecideScreen
  ↓ (user swipes right on prompt)
  → handleDecision(ACCEPT)
    → Zustand: currentIndex++, POST /choices
    → navigate to JournalScreen {promptId}

JournalScreen
  ↓ (user types text)
  → setCurrentEntryContent(text)
    → debounced updateEntry() every 500ms
    → PUT /entries/:entryId {content}
    → autoSaveStatus: idle → saving → saved
  ↓ (user taps Finish)
  → notificationAsync(Success) haptic
  → navigate to HistoryScreen

HistoryScreen
  ↓ (on mount)
  → fetchEntries(userId, page: 0)
    → GET /entries/user/1
    → Display entries as Pebble cards
  ↓ (user scrolls to bottom)
  → fetchEntries(userId, page: 1)
    → Infinite scroll (onEndReached)
```

---

## Environment & Configuration

### Local Development

**Backend (.env):**

```env
DATABASE_URL="file:./dev.db"         # SQLite file path
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:8081"  # Expo app dev port
```

**Mobile (.env):**

```env
API_BASE_URL="http://localhost:5000"
```

### Platform-Specific API URLs (if deploying)

**Android Emulator:**

```env
API_BASE_URL="http://10.0.2.2:5000"  # Special emulator alias
```

**Physical Device:**

```env
API_BASE_URL="http://192.168.1.100:5000"  # Replace with machine IP
```

---

## Development Checklist

- [ ] Backend dependencies installed (`npm install`)
- [ ] Database initialized (`npx prisma migrate dev`)
- [ ] Seed data loaded (`npm run prisma:seed`)
- [ ] Backend server running (`npm run dev` on port 5000)
- [ ] Mobile dependencies installed (`npm install`)
- [ ] TypeScript checks pass (`npm run build`)
- [ ] Expo dev server running (`npm start`)
- [ ] Can see DecideScreen with prompt cards
- [ ] Swipe right → navigates to JournalScreen
- [ ] Text input → auto-saves
- [ ] Finish → navigates to HistoryScreen with entry visible

---

## Common Commands

```bash
# Backend
cd api
npm install                    # Install deps
npm run dev                    # Start server
npm run build                  # TypeScript check
npm run prisma:studio          # Open DB UI
npm run prisma:seed            # Repopulate test data

# Mobile
cd mobile
npm install                    # Install deps
npm run build                  # TypeScript check
npm start                      # Start Expo dev
npm run ios                    # Run iOS simulator
npm run android                # Run Android emulator

# Combined (monorepo-like)
# Terminal 1: cd api && npm run dev
# Terminal 2: cd mobile && npm start
```

---

## Debugging

### Mobile TypeScript Issues

```bash
cd mobile
npm run build  # Shows all TS errors
```

### Backend Logs

```bash
# npm run dev outputs:
# [Aura API] ✅ Server running at http://localhost:5000
# [ISO-DATE] GET /prompts/available/1
# [ERROR] Failed to fetch prompts ...
```

### Database Inspection

```bash
cd api
npm run prisma:studio  # Opens web UI at http://localhost:5555
```

### Check API Endpoints

```bash
curl http://localhost:5000/health
curl http://localhost:5000/prompts/available/1
```

---

## Next: Deploying to Production

**Backend (Heroku / Railway / Render):**

1. Change `DATABASE_URL` to PostgreSQL connection string
2. Run migrations on production: `DATABASE_URL=... npx prisma migrate deploy`
3. Set `NODE_ENV=production`, `PORT` (auto-assigned)
4. Deploy with `git push heroku main`

**Mobile (Expo EAS):**

1. Create Expo account: `expo login`
2. Configure `eas.json` with production API URL
3. Build: `eas build --platform ios/android`
4. Submit to App Store / Play Store

---

## Resource Files

- **Tech Spec:** `../TECH_SPEC.md` (reference implementation guide)
- **README:** `./README.md` (full setup & architecture)
- **This File:** `./QUICK_REFERENCE.md` (quick lookup)

---

**Last Updated:** May 14, 2026 ✨
