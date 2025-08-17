/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../../seed-utils'

export async function seed_bO6_sWAT556(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "SWAT 5.56", category: "marksman rifle", game: "BO6", primary: true, secondary: false })
  { const att = await ensureAttachment(prisma, "OM3 '92 Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "PrismaTech Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Jason Armory 2x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Pinpoint Holoscout", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Redwell Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Remuda Range Finder", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Volzhskiy Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Otero Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Willis 3x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Pinpoint Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Redwell Custom Zoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Otero Thermal 2x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Dobrych 4x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Thermal 6x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "VMF Variable Scope", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Thermal Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "PrismaPoint Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Accu-Spot Ultra Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Remuda Dual Zoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "R&K Multizoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Microflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "PrismaTech 4x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Suppressor", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Compensator", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Muzzle Brake", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ported Compensator", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Monolithic Suppressor", "muzzle"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Long Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Gain-Twist Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Reinforced Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "CHF Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Short Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Precision Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Lightweight Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Vertical Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Marksman Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ranger Foregrip", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Launcher - Standard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Launcher - Smoke", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Launcher - High Explosive", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Launcher - Drill Charge", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Crossbow", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Extended Mag I", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Fast Mag I", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Flip Mag", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Extended Mag II", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Full-Auto Extended Mag", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Quickdraw Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Assault Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Commando Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "CQB Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ergonomic Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Infiltrator Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Light Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Heavy Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Balanced Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Combat Stock", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Steady Aim Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Fast Motion Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Tactical Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Strelok Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Target Laser", "laser"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Recoil Springs", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "5.56 NATO Overpressured", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "5.56 NATO FMJ", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Rapid Fire", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SWAT 5.56 Grau Conversion", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
}
