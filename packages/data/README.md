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

CockroachDB is expected for dev. Configure `DATABASE_URL` in `prisma/.env`.
