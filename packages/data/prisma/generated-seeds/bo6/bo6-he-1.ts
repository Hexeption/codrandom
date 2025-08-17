/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../../seed-utils'

export async function seed_bO6_hE1(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "HE-1", category: "launcher", game: "BO6", primary: false, secondary: true })
}
