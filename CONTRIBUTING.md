# Contributing to Thirty

Thank you for your interest in contributing to Thirty! We strive to keep the contribution process simple and clear.

## Getting Started

### Fork the repository

1. Visit the [Thirty GitHub repository](https://github.com/thirtycalendar/thirty).
2. Click the **Fork** button in the top-right corner.

### Clone your fork locally

```bash
git clone https://github.com/thirtycalendar/thirty.git
cd thirty
```

### Add upstream remote

```bash
git remote add upstream https://github.com/thirtycalendar/thirty.git
```

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to add required secrets:

- `BETTER_AUTH_SECRET`: generate with `openssl rand -hex 32`

### Prepare Hooks

```bash
pnpm husky
```

### Initialize database

```bash
pnpm db:push
```

### Start development

```bash
pnpm dev
```

## Making Changes

1. Create a new branch for your feature or fix:

```bash
git checkout -b feat/your-feature
```

2. Make your changes and test locally.

3. Commit changes with **[Conventional Commit](https://www.conventionalcommits.org/)** messages, e.g.:

```bash
git commit -m "feat: add recurring event support"
```

If you need to commit work-in-progress or "safety commits," use the `chore` type:

```bash
git commit -m "chore: save wip progress"
```

4. Keep your fork up to date:

```bash
git fetch upstream
git merge upstream/main
```

## Pull Request Process

1. Push your branch to your fork:

```bash
git push origin feat/your-feature
```

2. Open a Pull Request on the main Thirty repository.

3. Provide a clear description of your changes.

4. Wait for review and respond to any feedback.

## Need Help?

- Open an issue on the repo.
- Comment on an existing issue or PR.

## License

By contributing to Thirty, you agree your contributions will be licensed under the MIT License.
