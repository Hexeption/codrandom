/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../seed-utils'

export async function seed_bO6_cIGMA2B(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "CIGMA 2B", category: "launcher", game: "BO6", primary: false, secondary: true })
}
