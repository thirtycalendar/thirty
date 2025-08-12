# Thirty

An AI-powered open-source calendar built to make scheduling faster, smarter, and more personal.

## What is Thirty?

Thirty is an AI-first calendar that helps you manage events, tasks, and holidays with precision and simplicity. It’s designed for people and teams who want a self-hosted, privacy-focused alternative to traditional calendars, with AI-powered features baked in.

## Tech Stack

- **Frontend**: Svelte 5 (SvelteKit), TypeScript, TailwindCSS, DaisyUI
- **Backend**: Hono, Drizzle ORM
- **Database**: Neon (PostgreSQL)
- **Authentication**: Better Auth
- **Cache/Queues**: Upstash (Redis & Vector)
- **Hosting/CDN**: Vercel, Bunny.net
- **AI**: OpenAI (via OpenRouter)
- **Payments**: Polar

## Getting Started

### Prerequisites

- Node.js v24+
- pnpm v10+
- PostgreSQL (Neon recommended)

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

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=thirtycalendar/thirty&type=Date)](https://www.star-history.com/#thirtycalendar/thirty&Date)
