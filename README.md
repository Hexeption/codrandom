## Cod Random

codrandom is a monorepo that provides a Next.js web app and shared packages to generate randomized Call of Duty loadouts.


Quickstart (development)

1. Install dependencies at repo root:

	pnpm install

2. Start the development server for the web app:

	pnpm dev --filter=@workspace/web

Common tasks

- Build all packages: `pnpm build`
- Run data seed: `pnpm -C packages/data run seed`
- Lint: `pnpm lint`

Where to look
- Web app: `apps/web`
- Data & seed scripts: `packages/data`
- Shared UI: `packages/ui`

```
