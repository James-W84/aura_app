# Aura – Gamified Journaling MVP

A minimalist, high-fidelity mobile journaling app that gamifies the blank page problem using a Tinder-style swipe interface for prompts.

**Built with:** React Native + Expo, Node.js + Express, Prisma ORM, Zustand, TypeScript

---

## Project Structure

```
/aura_app
  /api                 # Node.js Express backend
    /src
      /controllers     # Business logic: prompts, choices, entries
      /routes          # API route definitions
      /middleware      # Error handling, CORS
      /prisma          # Database schema & migrations
    package.json
    tsconfig.json
    .env               # Backend configuration

  /mobile              # React Native Expo frontend
    /src
      /features        # Screens: decide, journal, history
      /components      # Reusable UI: CardStack, PromptCard, PebbleCard
      /store           # Zustand stores: prompts, entries, user
      /lib             # API client, theme, utilities
      /types           # TypeScript interfaces
      /navigation      # React Navigation setup
    App.tsx
    app.json           # Expo configuration
    package.json
    tsconfig.json
    .env               # Frontend configuration
```

---

## Quick Start

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn**
- **Expo CLI** (for mobile): `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator, or physical device with Expo Go app

### Setup

#### 1. Backend Setup & Database

```bash
# Enter backend directory
cd api

# Install dependencies
npm install

# Create and seed your database
npx prisma migrate dev --name init    # Use default migrations
npm run prisma:seed                   # Populate with sample prompts

# Verify database
npm run prisma:studio                 # Opens Prisma Studio to inspect DB
```

#### 2. Backend Server

```bash
# From /api directory
npm run dev

# Server should start at http://localhost:5000
# You'll see: "[Aura API] ✅ Server running at http://localhost:5000"
```

#### 3. Mobile Setup

```bash
# Enter mobile directory (in a new terminal)
cd mobile

# Install dependencies
npm install

# Start Expo dev server
npm start

# Follow prompts:
#   - Press 'i' for iOS Simulator (Mac only)
#   - Press 'a' for Android Emulator
#   - Or scan QR code with Expo Go app on physical device
```

---

## Architecture Overview

### Backend (Express + Prisma)

**Endpoints:**

- `GET /health` – Server health check
- `GET /prompts/available/:userId` – Fetch available prompts (excludes recent choices)
- `POST /choices` – Log user decision (ACCEPT, REJECT, DELAY)
- `POST /entries` – Create new journal entry
- `PUT /entries/:entryId` – Auto-save entry content
- `GET /entries/user/:userId` – Paginated entry history
- `GET /entries/:entryId` – Fetch single entry
- `DELETE /entries/:entryId` – Delete entry

**Data Models:**

```
User → (1:N) Entry
User → (1:N) Choice
Prompt → (1:N) Choice
Prompt → (1:N) Entry
```

### Frontend (React Native + Expo)

**Zustand Stores:**

- `usePromptStore`: Manage prompts deck, current index, swipe decisions
- `useEntryStore`: Manage entries, auto-save debounce, pagination
- `useUserStore`: Current user context (hardcoded userId: 1 for MVP)

**Key Features:**

- **Decision Deck** (DecideScreen): Swipe interface with haptic feedback (Expo Haptics)
- **Zen Writer** (JournalScreen): Full-screen text editor with 500ms auto-save debounce
- **Pebble List** (HistoryScreen): Paginated card list of past entries with infinite scroll

**Design System ("Windy Beach" Aesthetic):**

- Background: #F5F5F2 (Soft Sand)
- Cards: white with 1px white border (Frosted Sea Glass)
- Primary: #81D4FA (Light Sky Blue)
- Accent: #FFA726 (Sunlight Orange)
- Text: #37474F (Wet Slate)
- Border-radius: 40px (cards), 32px (pebbles)

---

## Current Status

### ✅ Completed (Phases 0–5)

- [x] **Phase 0:** Project initialization, folder structure, config files
- [x] **Phase 1:** Prisma schema, SQLite database, API controllers & routes
- [x] **Phase 2:** Zustand stores (prompts, entries, user) with error handling
- [x] **Phase 3:** Decision Deck UI (card swiper, haptic feedback, accept/reject/delay logic)
- [x] **Phase 4:** Zen Writer UI (auto-save, character count, prompt display)
- [x] **Phase 5:** Pebble History UI (paginated list, empty states)

### 🚧 In Progress

- [ ] **Phase 6:** Polish & error handling
  - Error boundaries in React components
  - Network error recovery & retry logic
  - Empty state messages
  - Loading skeletons
  - Graceful degradation for haptics

### 📋 Post-MVP (Future Phases)

- User authentication (JWT)
- Prompt personalization & scheduling
- Analytics & telemetry
- Mixed media attachments (voice notes, photos)
- Diary streaks & gamification

---

## Development Commands

### Backend

```bash
cd api

# Development server with auto-reload
npm run dev

# Build for production
npm run build

# Start compiled server
npm start

# Database debugging
npm run prisma:studio       # Open Prisma Studio
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Re-seed data
```

### Mobile

```bash
cd mobile

# Start Expo dev server
npm start

# Type check only
npm run build

# Build for iOS
npm run ios

# Build for Android
npm run android

# Build for web
npm run web
```

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"       # SQLite for local dev
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:8081"  # Expo dev server
```

### Mobile (.env.local)

```env
API_BASE_URL="http://localhost:5000"
```

---

## Testing the Full Flow

1. **Start backend:**

   ```bash
   cd api && npm run dev
   ```

2. **Start mobile (new terminal):**

   ```bash
   cd mobile && npm start
   ```

3. **In the Expo app:**
   - You land on **DecideScreen** with a deck of prompts
   - **Swipe right** (ACCEPT) → Navigate to **JournalScreen** with that prompt
   - **Write in the journal** → Text auto-saves every 500ms
   - **Button "Finish"** → Navigate to **HistoryScreen**
   - See your entry as a "Pebble" card with date & snippet

4. **Verify API:**
   - `curl http://localhost:5000/health` → Returns `{ "status": "ok" }`
   - `curl http://localhost:5000/prompts/available/1` → Returns prompt array

---

## Database Schema

**users**

- id (Int, primary key)
- name (String)

**prompts**

- id (Int, primary key)
- content (String)
- category (String, nullable)

**choices**

- userId (Int, foreign key)
- promptId (Int, foreign key)
- decision (String: ACCEPT, REJECT, DELAY)
- createdAt (DateTime, default now)

**entries**

- id (Int, primary key)
- userId (Int, foreign key)
- promptId (Int, nullable foreign key)
- content (String)
- createdAt (DateTime, default now)
- updatedAt (DateTime)

---

## Common Issues & Troubleshooting

### "Cannot find module" errors in mobile

```bash
# Ensure tsconfig has correct baseUrl
cd mobile
cat tsconfig.json | grep baseUrl  # Should be "./src"

# Rebuild
npm run build
```

### API not accessible from Expo

- Ensure backend is running: `npm run dev` (in /api)
- Check PORT in .env (default 5000)
- On Android emulator, use `10.0.2.2:5000` instead of `localhost:5000`
- On physical device, use machine's local IP (e.g., 192.168.x.x:5000)

### Database locked or reset needed

```bash
cd api
rm prisma/dev.db*                # Delete old DB
npx prisma migrate deploy        # Re-apply migrations
npm run prisma:seed              # Re-populate data
```

### Haptics not working

- Haptics only work on physical iOS/Android devices
- Emulators silently fail (wrapped in try-catch)
- Test on actual device with Expo Go app

---

## Next Steps

1. **Deploy backend** to Heroku / Railway / render with PostgreSQL
2. **Add authentication** via JWT or magic links
3. **Implement analytics** to track user engagement
4. **A/B test prompts** and measure completion rates
5. **Build admin dashboard** for prompt management

---

## License

MIT

---

## Support

For questions or issues, refer to the tech spec Doc or open an issue in the repo.

**Happy journaling! 🌊✨**
