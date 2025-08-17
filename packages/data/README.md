## @codrandom/loadout-randomizer

Prisma schema and seed generator for CoD loadouts, plus a small loadout randomizer.

### Commands

- Generate Prisma client
  - `pnpm prisma:generate`
- Generate seeds from notes
  - `pnpm gen:seeds`
- Run generated seeds
  - `pnpm seed` (alias of `seed:generated`)
- Start randomizer script (dev)
  - `pnpm start`

### Notes-driven seeding

- Author notes in `weapon-notes/*.md` using simple sections (Gun, Category, Optics, etc.).
- Run `pnpm gen:seeds` to produce files in `prisma/generated-seeds/`.
- Do not edit generated seed files by hand.

### DB

MariaDB is expected for local development. Configure `DATABASE_URL` in `prisma/.env`.

### Local DB quickstart

Start the dev database with the provided compose file and set up Prisma:

```bash
# from the repo root: start MariaDB (dev)
docker compose -f docker-compose.dev.yml up -d

# set DATABASE_URL for this shell session (optional if already in prisma/.env)
export DATABASE_URL="mysql://app:change-me@127.0.0.1:3306/codrandom"

# push Prisma schema (creates tables)
pnpm -C packages/data run prisma:push

# generate Prisma client
pnpm -C packages/data run prisma:generate

# run the generated seeds
DATABASE_URL="$DATABASE_URL" pnpm -C packages/data run seed:generated
```

Inspect with Prisma Studio:

```bash
DATABASE_URL="$DATABASE_URL" pnpm -C packages/data exec prisma studio --schema=packages/data/prisma/schema.prisma
```

If you hit P2021 (table does not exist) after running the seeds, ensure `prisma:push` completed successfully before running seeds. If issues persist, share the exact error output and I'll triage further.
