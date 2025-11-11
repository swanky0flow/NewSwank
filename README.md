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
Run the scheduled daemon (using ts-node register):

```bash
AUTO_PUBLISH_SCHEDULE="0 2 * * *" node -r ts-node/register scripts/auto-publish.ts
```

Notes

- The current script is a scaffold that calls `generateValueDrivenArticle` from `src/lib/content-generator` and prints the title. It does not persist generated articles — see `scripts/auto-publish.ts` TODOs for integration points (DB, caches, product mapping).
- `node-cron` was added as a dependency to enable scheduling.
