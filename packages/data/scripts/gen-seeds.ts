import { readdir, readFile, mkdir, writeFile } from "fs/promises";
import { join, basename } from "path";

type Parsed = {
  game: "BO6" | "MW2" | "MW3";
  name: string;
  category: string;
  primary: boolean;
  secondary: boolean;
  attachments: Array<{ name: string; slot: string }>;
};

type MeleeEntry = string | { name: string; game: "BO6" | "MW2" | "MW3" };

type LoadoutParsed = {
  tactical: string[];
  lethal: string[];
  wildcards: string[];
  perks: Record<string, string[]>; // e.g. { "Perk 1": [...], "Perk 2": [...], "Perk 3": [...] }
  melee: MeleeEntry[];
};

// NOTE: several small normalization helpers were intentionally inlined where
// needed to keep parsing behavior explicit and avoid global helper mutability.
function classifyRole(category: string): {
  primary: boolean;
  secondary: boolean;
} {
  const c = category.toLowerCase();
  // Treat explicit secondary categories and certain special categories as secondary
  const isSecondary =
    /(handgun|pistol|secondary|sidearm)/.test(c) ||
    /\b(launcher|pistal|special)\b/.test(c);
  return { primary: !isSecondary, secondary: isSecondary };
}

// normalize helpers removed; parsing uses minimal trimming and inline mapping where needed.

function parseSections(
  text: string,
  sections: Record<string, string>,
): Array<{ name: string; slot: string }> {
  const lines = text.split(/\r?\n/);
  const headings = Object.keys(sections);
  const isHeading = (line: string) => {
    const m = line.match(/^([A-Za-z][^:]*):\s*$/);
    if (!m || !m[1]) return null;
    const title = m[1].trim();
    return headings.includes(title) ? title : null;
  };
  let current: string | null = null;
  const out: Array<{ name: string; slot: string }> = [];
  for (const raw of lines) {
    const line = raw.trim();
    const h = isHeading(line);
    if (h) {
      current = h;
      continue;
    }
    if (!current) continue;
    if (line.startsWith("- ")) {
      const name = line.replace(/^-\s*/, "").trim();
      if (name && sections[current])
        out.push({ name, slot: sections[current] as string });
      continue;
    }
    if (line && !line.startsWith("- ") && /^[A-Za-z][^:]*:\s*$/.test(line))
      current = null;
  }
  return out;
}

function parseLoadout(text: string): LoadoutParsed | null {
  const lines = text.split(/\r?\n/);
  let section: "tactical" | "lethal" | "wildcards" | "perks" | null = null;
  let meleeSection = false;
  let currentPerkSlot: string | null = null;
  const tactical: string[] = [];
  const lethal: string[] = [];
  const wildcards: string[] = [];
  const melee: MeleeEntry[] = [];
  const perks: Record<string, string[]> = {
    "Perk 1": [],
    "Perk 2": [],
    "Perk 3": [],
  };
  const heading = (s: string) => s.trim().replace(/\s+/g, " ");

  for (const raw of lines) {
    const line = heading(raw);
    if (!line) continue;
    // Top-level sections
    if (/^Tactical:/i.test(line)) {
      section = "tactical";
      meleeSection = false;
      currentPerkSlot = null;
      continue;
    }
    if (/^Lethal:/i.test(line)) {
      section = "lethal";
      meleeSection = false;
      currentPerkSlot = null;
      continue;
    }
    if (/^Wildcard(s)?:/i.test(line)) {
      section = "wildcards";
      meleeSection = false;
      currentPerkSlot = null;
      continue;
    }
    if (/^Melee:/i.test(line)) {
      section = "perks"; // reuse parsing for list items but flag melee
      meleeSection = true;
      currentPerkSlot = null;
      continue;
    }
    if (/^Perks?:/i.test(line)) {
      section = "perks";
      meleeSection = false;
      currentPerkSlot = null;
      continue;
    }
    // Perk sub-slots
    const perkSlot = line.match(/^Perk\s*(1|2|3):/i);
    if (perkSlot) {
      section = "perks";
      meleeSection = false;
      currentPerkSlot = `Perk ${perkSlot[1]}`;
      if (!perks[currentPerkSlot]) perks[currentPerkSlot] = [];
      continue;
    }
    // Items
    if (/^\-\-/.test(line)) {
      // description line for previous wildcard; ignore for seeding
      continue;
    }
    if (/^\-\s+/.test(line)) {
      const item = line.replace(/^\-\s+/, "").trim();
      if (!item) continue;
      if (section === "tactical") tactical.push(item);
      else if (section === "lethal") lethal.push(item);
      else if (section === "wildcards")
        wildcards.push(item.replace(/\s+—.+$/, ""));
      else if (meleeSection) melee.push(item);
      else if (section === "perks" && currentPerkSlot) {
        if (!perks[currentPerkSlot]) perks[currentPerkSlot] = [];
        perks[currentPerkSlot]!.push(item);
      }
      continue;
    }
  }

  const hasAny =
    tactical.length ||
    lethal.length ||
    wildcards.length ||
    melee.length ||
    Object.values(perks).some((a) => a.length);
  return hasAny ? { tactical, lethal, wildcards, perks, melee } : null;
}

function parseMeleeByGame(
  text: string,
): Array<{ name: string; game: "BO6" | "MW2" | "MW3" }> {
  const out: Array<{ name: string; game: "BO6" | "MW2" | "MW3" }> = [];
  let current: "BO6" | "MW2" | "MW3" | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const gm = line.match(/^#\s*(.+)$/);
    if (gm) {
      const graw = (gm[1] ?? "BO6").trim().replace(/\s+/g, "").toUpperCase();
      current = graw.startsWith("BO6")
        ? "BO6"
        : graw.startsWith("MW2")
          ? "MW2"
          : graw.startsWith("MW3")
            ? "MW3"
            : "BO6";
      continue;
    }
    if (/^\-\s+/.test(line) && current) {
      const name = line.replace(/^\-\s+/, "").trim();
      if (name) out.push({ name, game: current });
    }
  }
  return out;
}

async function parseNotes(text: string): Promise<Parsed> {
  const gameMatch = text.match(/^#\s*(.+)$/m);
  const graw = (gameMatch && gameMatch[1] ? gameMatch[1] : "BO6")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
  const game: "BO6" | "MW2" | "MW3" = graw.startsWith("BO6")
    ? "BO6"
    : graw.startsWith("MW2")
      ? "MW2"
      : graw.startsWith("MW3")
        ? "MW3"
        : "BO6";
  const gunMatch = text.match(/^Gun:\s*(.+)$/m);
  const name = gunMatch && gunMatch[1] ? gunMatch[1].trim() : undefined;
  if (!name) throw new Error("Gun name not found in notes");
  const catMatch = text.match(/^Category:\s*(.+)$/m);
  const category = (catMatch && catMatch[1] ? catMatch[1] : "assault rifle")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  const role = classifyRole(category);
  const sections: Record<string, string> = {
    Optics: "optic",
    Muzzle: "muzzle",
    Barrel: "barrel",
    Underbarrel: "underbarrel",
    Magazine: "magazine",
    "Rear Grip": "rear_grip",
    Stock: "stock",
    "Stock Pad": "stock_pad",
    Comb: "comb",
    Lever: "lever",
    Laser: "laser",
    "Fire Mods": "fire_mod",
  };
  const attachments = parseSections(text, sections);
  return {
    game,
    name,
    category,
    primary: role.primary,
    secondary: role.secondary,
    attachments,
  };
}

function toIdentifier(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toLowerCase());
}

function toFileSlug(game: string, name: string): string {
  const g = game.toLowerCase();
  const n = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${g}-${n}`;
}

function generateSeedModule(p: Parsed): string {
  const comment = `/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */\n\n`;
  const funcName = `seed_${toIdentifier(p.game)}_${toIdentifier(p.name)}`;
  const header = `import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../seed-utils'

export async function ${funcName}(prisma: PrismaClient) {\n`;
  const createWeapon = `  const weapon = await ensureWeapon(prisma, { name: ${JSON.stringify(
    p.name,
  )}, category: ${JSON.stringify(p.category)}, game: ${JSON.stringify(
    p.game,
  )}, primary: ${p.primary}, secondary: ${p.secondary} })\n`;
  const linkAttachments = p.attachments
    .map(
      (a) =>
        `  { const att = await ensureAttachment(prisma, ${JSON.stringify(
          a.name,
        )}, ${JSON.stringify(
          a.slot,
        )}); await ensureWeaponAttachment(prisma, weapon.id, att.id) }`,
    )
    .join("\n");
  const footer = `}\n`;
  return `${comment}${header}${createWeapon}${
    linkAttachments ? linkAttachments + "\n" : ""
  }${footer}`;
}

function generateLoadoutSeedModule(p: LoadoutParsed): string {
  const comment = `/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */\n\n`;
  const header = `import { PrismaClient } from '@prisma/client'
import { ensureEquipment, ensurePerk, ensureWiledCard, ensureWeapon } from '../seed-utils'

export async function seed_core_loadout(prisma: PrismaClient) {\n`;
  const equipTac = p.tactical
    .map(
      (n) =>
        `  await ensureEquipment(prisma, ${JSON.stringify(n)}, 'tactical')`,
    )
    .join("\n");
  const equipLethal = p.lethal
    .map(
      (n) => `  await ensureEquipment(prisma, ${JSON.stringify(n)}, 'lethal')`,
    )
    .join("\n");
  const meleeWeapons = p.melee
    .map((m) => {
      if (typeof m === "object" && m && "name" in m && "game" in m) {
        const name = (m as any).name;
        const game = (m as any).game;
        // Melee has its own slot: not primary, not secondary
        return `  await ensureWeapon(prisma, { name: ${JSON.stringify(name)}, category: 'melee', game: ${JSON.stringify(game)}, primary: false, secondary: false })`;
      }
      // No default game; skip bare names to avoid guessing
      return null;
    })
    .filter(Boolean)
    .join("\n");
  const wilds = p.wildcards
    .map((n) => `  await ensureWiledCard(prisma, ${JSON.stringify(n)})`)
    .join("\n");
  const perks = Object.entries(p.perks)
    .flatMap(([slot, names]) =>
      names.map(
        (n) =>
          `  await ensurePerk(prisma, ${JSON.stringify(n)}, ${JSON.stringify(slot)})`,
      ),
    )
    .join("\n");
  const footer = `}\n`;
  const body = [equipTac, equipLethal, meleeWeapons, wilds, perks]
    .filter(Boolean)
    .join("\n");
  return `${comment}${header}${body}${body ? "\n" : ""}${footer}`;
}

async function main() {
  const notesDir = join(process.cwd(), "weapon-notes");
  const outDir = join(process.cwd(), "prisma", "generated-seeds");
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(notesDir)).filter((f) => f.endsWith(".md"));
  if (!files.length) {
    console.error(`No .md notes found in ${notesDir}`);
    process.exit(1);
  }
  const entries: Array<{ file: string; func: string }> = [];

  // Prefer category-split loadout folder if present
  let loadoutSeedAdded = false;
  try {
    const loadoutDir = join(notesDir, "loadout");
    const loadoutFiles = await readdir(loadoutDir);
    const lower = (s: string) => s.toLowerCase();
    if (loadoutFiles && loadoutFiles.length) {
      const readIf = async (namePart: string) => {
        const f = loadoutFiles.find((x) => lower(x).includes(namePart));
        return f ? await readFile(join(loadoutDir, f), "utf8") : "";
      };
      const txtTac = await readIf("tac");
      const txtLethal = await readIf("lethal");
      const txtWild = await readIf("wild");
      const txtPerk = await readIf("perk");
      const meleeFiles = loadoutFiles.filter((x) => lower(x).includes("melee"));

      const parsed: LoadoutParsed = {
        tactical: [],
        lethal: [],
        wildcards: [],
        perks: { "Perk 1": [], "Perk 2": [], "Perk 3": [] },
        melee: [],
      };

      // Reuse parser behavior on concatenated content by synthesizing headings
      if (txtTac)
        parsed.tactical = parseLoadout(`Tactical:\n${txtTac}`)?.tactical ?? [];
      if (txtLethal)
        parsed.lethal = parseLoadout(`Lethal:\n${txtLethal}`)?.lethal ?? [];
      if (txtWild)
        parsed.wildcards =
          parseLoadout(`Wildcards:\n${txtWild}`)?.wildcards ?? [];
      if (txtPerk)
        parsed.perks =
          parseLoadout(`Perks:\n${txtPerk}`)?.perks ?? parsed.perks;
      if (meleeFiles.length) {
        for (const mf of meleeFiles) {
          const content = await readFile(join(loadoutDir, mf), "utf8");
          const entries = parseMeleeByGame(content);
          for (const e of entries) parsed.melee.push(e);
        }
      }

      const hasAny =
        parsed.tactical.length ||
        parsed.lethal.length ||
        parsed.wildcards.length ||
        parsed.melee.length ||
        Object.values(parsed.perks).some((a) => a.length);
      if (hasAny) {
        const ts = generateLoadoutSeedModule(parsed);
        const outPath = join(outDir, `loadout.ts`);
        await writeFile(outPath, ts, "utf8");
        entries.push({ file: `./loadout`, func: `seed_core_loadout` });
        console.log(
          `Generated loadout seed from split files -> ${basename(outPath)}`,
        );
        loadoutSeedAdded = true;
      }
    }
  } catch (_) {
    // ignore if folder doesn't exist
  }
  for (const f of files) {
    const text = await readFile(join(notesDir, f), "utf8");
    // Special handling for the global loadout lists (no Gun: header)
    if (!/^Gun:\s*/m.test(text)) {
      if (!loadoutSeedAdded) {
        const load = parseLoadout(text);
        if (load) {
          // Do not infer melee from monolithic file; only split melee.md provides melee with explicit game
          const ts = generateLoadoutSeedModule({ ...load, melee: [] });
          const outPath = join(outDir, `loadout.ts`);
          await writeFile(outPath, ts, "utf8");
          entries.push({ file: `./loadout`, func: `seed_core_loadout` });
          console.log(`Generated loadout seed -> ${basename(outPath)}`);
          loadoutSeedAdded = true;
        } else {
          console.warn(`Skipping ${f}: no Gun: header`);
        }
      }
      continue;
    }
    try {
      const parsed = await parseNotes(text);
      const slug = toFileSlug(parsed.game, parsed.name);
      const ts = generateSeedModule(parsed);
      const outPath = join(outDir, `${slug}.ts`);
      await writeFile(outPath, ts, "utf8");
      const funcName = `seed_${toIdentifier(parsed.game)}_${toIdentifier(parsed.name)}`;
      entries.push({ file: `./${slug}`, func: funcName });
      console.log(
        `Generated seed for ${parsed.name} (${parsed.game}) -> ${basename(outPath)}`,
      );
    } catch (e: any) {
      console.warn(`Skipping ${f}: ${e?.message ?? e}`);
    }
  }
  const index = entries
    .map((e, i) => `import { ${e.func} as w${i} } from '${e.file}'`)
    .concat([
      `import { PrismaClient } from '@prisma/client'`,
      `export async function runAllGenerated(prisma?: PrismaClient) {`,
      `  const p = prisma ?? new PrismaClient()`,
      ...entries.map((_, i) => `  await w${i}(p)`),
      `  if (!prisma) await p.$disconnect()`,
      `}`,
      `if (require.main === module) {`,
      `  runAllGenerated().then(() => {`,
      `    console.log('Applied generated seeds')`,
      `  }).catch((e) => {`,
      `    console.error(e); process.exit(1)`,
      `  })`,
      `}`,
    ])
    .join("\n");
  await writeFile(join(outDir, "index.ts"), index + "\n", "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
