<div align="center">

# Thirty

Built to keep you in flow, Thirty is the best way to organize your work and life.

</div>

> **Note**: The `main` branch represents the latest reboot of the project (`v3`).
> You can still access previous versions at [`v1`](https://github.com/thirtycalendar/thirty/tree/v1/) and [`v2`](https://github.com/thirtycalendar/thirty/tree/v2/).

## Tech Stack

- **Frontend**: Svelte 5 (SvelteKit), TypeScript, Tailwind CSS, shadcn-svelte
- **Backend**: SvelteKit Remote Functions, Drizzle ORM
- **Database**: Cloudflare D1
- **Authentication**: Better Auth
- **Caching & Queues**: Cloudflare KV & Vectorize
- **Hosting & CDN**: Cloudflare Workers & CDN
- **AI**: OpenAI (via OpenRouter), Voyage vector embeddings
- **Payments**: Polar

## Getting Started

### Prerequisites

- Node.js v24+
- pnpm v10+

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
pnpm husky
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
