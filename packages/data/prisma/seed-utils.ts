import type { PrismaClient } from "@prisma/client";

export async function ensureWeapon(
  prisma: PrismaClient,
  data: {
    name: string;
    category: string;
    game: "BO6" | "MW2" | "MW3";
    primary?: boolean;
    secondary?: boolean;
  },
) {
  const existing = await prisma.weapon.findFirst({
    where: { name: data.name, game: data.game as any },
  });
  if (existing) {
    return prisma.weapon.update({
      where: { id: existing.id },
      data: {
        category: data.category,
        primary: data.primary ?? true,
        secondary: data.secondary ?? false,
      },
    });
  }
  return prisma.weapon.create({
    data: {
      ...data,
      game: data.game as any,
      primary: data.primary ?? true,
      secondary: data.secondary ?? false,
    },
  });
}

export async function ensureAttachment(
  prisma: PrismaClient,
  name: string,
  slot: string,
) {
  const existing = await prisma.attachment.findFirst({ where: { name, slot } });
  if (existing) return existing;
  return prisma.attachment.create({ data: { name, slot } });
}

export async function ensureWeaponAttachment(
  prisma: PrismaClient,
  weaponId: bigint,
  attachmentId: bigint,
) {
  const link = await prisma.weaponAttachment.findFirst({
    where: { weaponId, attachmentId },
  });
  if (link) return link;
  return prisma.weaponAttachment.create({ data: { weaponId, attachmentId } });
}

export async function ensureEquipment(
  prisma: PrismaClient,
  name: string,
  type: "lethal" | "tactical" | "melee",
) {
  const existing = await prisma.equipment.findFirst({ where: { name, type } });
  if (existing) return existing;
  return prisma.equipment.create({ data: { name, type } });
}

export async function ensurePerk(
  prisma: PrismaClient,
  name: string,
  slot: string,
) {
  const existing = await prisma.perk.findFirst({ where: { name, slot } });
  if (existing) return existing;
  return prisma.perk.create({ data: { name, slot } });
}

export async function ensureWiledCard(prisma: PrismaClient, name: string) {
  // @ts-ignore - generated delegate exists after prisma generate
  const existing = await (prisma as any).wiledCard.findFirst({
    where: { name },
  });
  if (existing) return existing;
  return (prisma as any).wiledCard.create({ data: { name } });
}
