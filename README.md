# NewSwank

A small scaffold for an automated affiliate content platform.

## Auto-publish script

The project includes a lightweight auto-publish scaffold at `scripts/auto-publish.ts` that demonstrates scheduling generation of articles.[{
	"resource": "/workspaces/NewSwank/node_modules/call-bind-apply-helpers/tsconfig.json",
	"owner": "typescript",
	"severity": 8,
	"message": "File '@ljharb/tsconfig' not found.",
	"source": "ts",
	"startLineNumber": 2,
	"startColumn": 13,
	"endLineNumber": 2,
	"endColumn": 31,
	"origin": "extHost2"
}]

Key points:

- The script uses `node-cron` to schedule runs. The default schedule is `0 2 * * *` (daily at 02:00).
- You can override the schedule with the environment variable `AUTO_PUBLISH_SCHEDULE` (cron format).
- For development, you may run the script once with the `--once` flag.

Examples

Install dependencies first:

```bash
npm install
```

Run the script once (development):

```bash
npx ts-node scripts/auto-publish.ts --once
```
with
# NewSwank

A production-ready automated affiliate content platform scaffold with intelligent article generation, product curation, and scheduled publishing.

## Features

- 📝 **AI-Powered Content Generation** — Uses OpenAI to generate value-driven affiliate articles
- 🛍️ **Amazon Product Integration** — Search and curate Amazon products via PAAPI
- ⏰ **Automated Scheduling** — Cron-based auto-publish with flexible scheduling
- 🗄️ **Persistent Storage** — SQLite database with migration support
- ✅ **Type-Safe** — Full TypeScript with strict mode
- 🧪 **Comprehensive Testing** — Vitest with coverage reporting
- 🚀 **CI/CD Ready** — GitHub Actions for lint, test, and build automation
- 📋 **Code Quality** — ESLint + Prettier with pre-commit hooks

## Quick Start

### Prerequisites

- Node.js 18+ (20.x recommended)
- npm or yarn

### Setup

```bash
# Clone and navigate
git clone <repo>
cd NewSwank

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your OpenAI API key and Amazon PAAPI credentials

# Initialize database
npm run db:init

# Run development server
npm run dev
```

## Development

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | Type-check without emitting |
| `npm test` | Run Vitest suite |
| `npm run test:ui` | Interactive test UI |
| `npm run test:coverage` | Generate coverage report |

### Auto-Publish Script

The project includes a lightweight auto-publish scaffold at `scripts/auto-publish.ts` that demonstrates scheduling generation of articles.

**Key points:**

- Uses `node-cron` for scheduling. Default schedule: `0 2 * * *` (daily at 02:00)
- Override with environment variable: `AUTO_PUBLISH_SCHEDULE`
- For development, run once with `--once` flag

**Examples:**

```bash
# Run once (development)
npx ts-node scripts/auto-publish.ts --once

# Run with custom schedule
AUTO_PUBLISH_SCHEDULE="0 */6 * * *" node -r ts-node/register scripts/auto-publish.ts

# Run as daemon
node -r ts-node/register scripts/auto-publish.ts
```

### Database

Database operations use SQLite with migrations:

```bash
# Initialize schema
npm run db:init

# Access database directly
sqlite3 data/app.db

# List tables
.schema
```

**Schema files:** `migrations/001_schema.sql`

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

**Test files:** `tests/**/*.test.ts`

### Code Quality

**Linting:**

```bash
npm run lint           # Check
npm run lint:fix       # Auto-fix
```

**Formatting:**

```bash
npm run format         # Format all files
npm run format:check   # Check formatting
```

**Type checking:**

```bash
npm run type-check
```

### Pre-commit Hooks

Husky + lint-staged automatically:
- Run ESLint (auto-fix if possible)
- Format code
- Prevent commits with violations

To bypass (not recommended):

```bash
git commit --no-verify
```

## Project Structure

```
.
├── src/
│   ├── lib/
│   │   ├── amazon-affiliate.ts    # Amazon PAAPI integration
│   │   ├── content-generator.ts   # OpenAI article generation
│   │   ├── db.ts                  # Database connection
│   │   └── repositories.ts        # Data access layer
│   └── components/
│       └── AffiliateButton.astro  # Astro component
├── scripts/
│   └── auto-publish.ts            # Scheduled publishing
├── tests/
│   ├── amazon-affiliate.test.ts
│   └── content-generator.test.ts
├── migrations/
│   └── 001_schema.sql             # Database schema
├── config/
│   └── niche-config.json          # Niche configurations
├── .github/workflows/
│   └── ci.yml                      # GitHub Actions CI/CD
├── .eslintrc.json                 # ESLint configuration
├── .prettierrc.json               # Prettier configuration
├── tsconfig.json                  # TypeScript configuration
├── vitest.config.ts               # Vitest configuration
└── package.json
```

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```bash
# OpenAI
OPENAI_API_KEY=sk_...

# Amazon PAAPI
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
AMAZON_PARTNER_TAG=...

# Database (optional)
DB_PATH=./data/app.db

# Scheduling
AUTO_PUBLISH_SCHEDULE=0 2 * * *
```

## CI/CD

GitHub Actions runs on every push:

1. **Lint** — ESLint + Prettier
2. **Type Check** — TypeScript strict mode
3. **Test** — Full test suite
4. **Build** — Production build
5. **Coverage** — Upload to Codecov

See `.github/workflows/ci.yml` for details.

## Architecture

### Content Generation Flow

```
generateValueDrivenArticle()
  ├─ Call OpenAI Chat API
  ├─ Generate article structure
  ├─ Search Amazon products
  └─ Return Article object
```

### Database Layer

```
ArticleRepository / ProductRepository
  ├─ Save/retrieve articles
  ├─ Manage products
  └─ Query by filters
```

### Auto-Publish Scheduling

```
cron.schedule()
  ├─ Execute on schedule
  ├─ Generate article
  ├─ Persist to DB
  └─ Handle errors gracefully
```

## Best Practices

- ✅ Use `npm run lint:fix` before committing
- ✅ Write tests for new features
- ✅ Run `npm run type-check` locally
- ✅ Update `.env.example` when adding env vars
- ✅ Keep migrations in `migrations/` directory
- ✅ Follow TypeScript strict mode rules

## Troubleshooting

**ESLint/Prettier conflicts?**

```bash
npm run format        # Format first
npm run lint:fix      # Then lint
```

**Database locked?**

```bash
# Kill any open connections
rm data/app.db-wal data/app.db-shm
```

**Tests failing?**

```bash
npm run test -- --reporter=verbose
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint:fix && npm test`
4. Commit (pre-commit hooks will verify)
5. Push and open PR

## License

MIT

## Notes

- The content generator and Amazon integration are scaffolds — implement real OpenAI and PAAPI calls
- Database schema defined in `migrations/001_schema.sql`
- See `scripts/auto-publish.ts` TODOs for integration points

Notes

- The current script is a scaffold that calls `generateValueDrivenArticle` from `src/lib/content-generator` and prints the title. It does not persist generated articles — see `scripts/auto-publish.ts` TODOs for integration points (DB, caches, product mapping).
- `node-cron` was added as a dependency to enable scheduling.
