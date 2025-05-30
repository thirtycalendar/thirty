```text
src/
├── lib/
│   ├── client/                   # Frontend client-related code
│   │   ├── components/           # Reusable Svelte components
│   │   ├── features/             # Feature-based UI logic (pages, modules)
│   │   ├── stores/               # Svelte stores for state management
│   │   ├── utils/                # Frontend-only utilities/helpers
│   │
│   ├── server/                   # Backend/server-only code
│   │   ├── api/                  # Outgoing API clients, integrations
│   │   ├── auth/                 # Authentication logic
│   │   ├── db/                   # Database clients, ORM logic
│   │   ├── upstash/              # Upstash-related backend helpers
│   │   ├── services/             # Business logic (shared backend logic)
│   │
│   ├── types/                    # Central types definitions
│   │   ├── server.ts             # Server-related types
│   │   ├── ui.ts                 # UI-related types
│   │   └── index.ts              # Shared/global types
│   │
│   ├── utils/                    # Universal utilities (shared frontend & backend)
│
├── routes/                       # SvelteKit route handlers (pages + endpoints)
│   ├── api/                      # API endpoints (e.g. +server.ts)
│   └── ...                      # Other pages and layouts
```
