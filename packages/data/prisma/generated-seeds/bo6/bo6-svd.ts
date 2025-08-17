/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../../seed-utils'

export async function seed_bO6_sVD(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "SVD", category: "sniper rifle", game: "BO6", primary: true, secondary: false })
  { const att = await ensureAttachment(prisma, "Pinpoint Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Remuda Dual Zoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Iron Sight", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Redwell Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Otero Thermal 2x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Dobrych 4x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "OM3 '92 Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "R&K Multizoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Blandwell 7x Scope", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "PrismaPoint Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Redwell Custom Zoom", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Accu-Spot Ultra Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "PrismaTech Reflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Thermal 6x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Willis 3x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Red Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "VMF Variable Scope", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "K&S Thermal Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Remuda Range Finder", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kepler Microflex", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
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
  { const att = await ensureAttachment(prisma, "Weighted Handguard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Lightweight Handguard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Precision Handguard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ranger Handguard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Marksman Handguard", "underbarrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Extended Mag I", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Fast Mag I", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Extended Mag II", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Fast Mag II", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Quickdraw Riser", "comb"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Combat Riser", "comb"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Commando Riser", "comb"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "CQB Riser", "comb"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ergonomic Riser", "comb"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
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
  { const att = await ensureAttachment(prisma, "7.62x54mmR Overpressured", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Recoil Springs", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62x54mmR FMJ", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Rapid Fire", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SVD Full Auto Mod", "fire_mod"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
}
