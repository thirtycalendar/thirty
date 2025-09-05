<div align="center">
  <img src="./src/lib/client/assets/logo.png" alt="Thirty Logo" width="100" />

# Thirty

Thirty is an open-source AI calendar built on familiar foundations. It’s not reinventing the wheel, it's like your regular calendar, just smarter and more effortless with AI.

</div>

> **Notice**: The `main` branch is a complete reboot of the project (now considered `v2`). The original `v1` is available [here](https://github.com/thirtycalendar/thirty/blob/v1/).

## Tech Stack

- **Frontend**: Svelte 5 (SvelteKit), TypeScript, TailwindCSS, DaisyUI
- **Backend**: Hono, Drizzle ORM
- **Database**: Turso (SQLite)
- **Authentication**: Better Auth
- **Cache/Queues**: Upstash (Redis & Vector)
- **Hosting/CDN**: Vercel, Bunny.net
- **AI**: OpenAI (via OpenRouter), Voyage vector embedding
- **Payments**: Polar

## Getting Started

### Prerequisites

- Node.js v24+
- pnpm v10+
- SQLite (Turso recommended)

### Clone and Install

```bash
git clone https://github.com/thirtycalendar/thirty.git
cd thirty
pnpm install
```

### Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

- `BETTER_AUTH_SECRET` (generate with `openssl rand -hex 32`)

See [`.env.example`](./.env.example) for all variables.

### Prepare Hooks

```bash
pnpm prepare
```

### Initialize Database

```bash
pnpm db:push
```

### Start development

```bash
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173).

## Roadmap

WIP

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Commit conventions (Conventional Commits)
- Branch naming
- Pull request process

## License

MIT License
