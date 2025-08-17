/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../../seed-utils'

export async function seed_bO6_marineSP(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "Marine SP", category: "shotgun", game: "BO6", primary: true, secondary: false })
  { const att = await ensureAttachment(prisma, "Remuda Mini Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Otero Micro Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Microflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Merlin Mini", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Prismatech Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Volzhskiy Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Dobrych MF Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Accu-Spot Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Otero Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "OM3 '92 Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Accu-Spot Ultra Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Willis 3x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Thermal Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Pinpoint Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Jason Armory 2x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Suppressor", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Full Choke", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Modified Choke", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Muzzle Brake", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Monolithic Suppressor", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Long Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Heavy Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Reinforced Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Combat Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Quick Load Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Weighted Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Lightweight Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Precision Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ranger Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Infiltrator Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Quickdraw Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Agility Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ergonomic Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Combat Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Balanced Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Light Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Steady Aim Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Fast Motion Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Tactical Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Sterelok Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Target Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Rapid Fire", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "12 Gauge Slug", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "12 Gauge Gragons Breath", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
}
