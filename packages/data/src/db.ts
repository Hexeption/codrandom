import {
  PrismaClient,
  Weapon,
  Attachment,
  Perk,
  Equipment,
  Game,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function getWeapons(filter?: {
  primary?: boolean;
  secondary?: boolean;
  game?: Game | string;
}): Promise<Weapon[]> {
  const where: any = {};
  if (filter?.primary !== undefined) where.primary = filter.primary;
  if (filter?.secondary !== undefined) where.secondary = filter.secondary;
  if (filter?.game) where.game = filter.game;
  return prisma.weapon.findMany({ where });
}

export async function getMeleeWeapons(filter?: {
  game?: Game | string;
}): Promise<Weapon[]> {
  const where: any = { category: "melee" };
  if (filter?.game) where.game = filter.game;
  return prisma.weapon.findMany({ where });
}

export async function getAttachmentsForWeapon(
  weaponId: bigint | number,
): Promise<Attachment[]> {
  // Prisma models use BigInt IDs. Accept number or bigint and normalize.
  const id = typeof weaponId === "bigint" ? weaponId : BigInt(weaponId);
  const rows = await prisma.weaponAttachment.findMany({
    where: { weaponId: id },
    include: { attachment: true },
  });
  return rows.map((r: { attachment: Attachment }) => r.attachment);
}

export async function getPerksBySlot(slot: string): Promise<Perk[]> {
  return prisma.perk.findMany({ where: { slot } });
}

export async function getEquipmentByType(type: string): Promise<Equipment[]> {
  return prisma.equipment.findMany({ where: { type } });
}

export type { Perk } from "@prisma/client";

export async function getWiledCards(): Promise<
  Array<{ id: bigint; name: string }>
> {
  // Use `as any` to access the generated delegate; return a narrow shape
  return (prisma as any).wiledCard.findMany();
}

export default prisma;
