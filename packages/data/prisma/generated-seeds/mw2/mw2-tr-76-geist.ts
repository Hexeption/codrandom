/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from '@prisma/client'
import { ensureWeapon, ensureAttachment, ensureWeaponAttachment } from '../../seed-utils'

export async function seed_mW2_tR76Geist(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, { name: "TR-76 Geist", category: "assault rifle", game: "MW2", primary: true, secondary: false })
  { const att = await ensureAttachment(prisma, "Slimline Pro", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Mini", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Cronen Mini Dot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Cronen Mini Pro", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Sigma-IV Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Minitac-40", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "XRK On-Point Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "AIM OP-V4", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "DF105 Relfex Sight", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Monocle CT90", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Corvus SOL-76", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Recharge-DX", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ SRO-7", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Corio RE-X Pro", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Corio Enforcer Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Lonewolf Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Kazan-Holo", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Battle Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Corvus Downrage-00", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "XTEN Angel-40", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Holotherm", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "VLK 4.0 Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Schlager 3.4x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "FORGE TAC Delta 4", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Cronen Zero-P Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Bullseye Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Aggressor-IR Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Schlager Night View", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "VX350 Thermal Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Teplo-OP3 Scope", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "DR582 Hybrid Sight", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Hybrid Firepoint", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Vortex-90", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "BPZ40 Hybrid", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "SZ Oscar-9", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Angel-40 4.8x", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Thermo-Optic x9", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Teplo Clear Shot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "FTAC Charlie7", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "HMW-20 Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Luca Bandera Scope", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "DS Farsight 11", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "3x RFL-Optic", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Drexsom Prime-90", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Ares Clear Shot", "optic"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Bruen Bridle 60", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "LOC.5 Long Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "LOC.2 Short Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Bruen Bridle Heavy", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Freight-40 Barrel", "barrel"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Geist Single-Tap Mod", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "45 Round Mag", "magazine"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Stip-66 grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Cronen Resistor Grip", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Tactical Grip Tape", "rear_grip"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Scout-LD Stock Pad", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Expedite grid Pad", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Demo Tac Pad", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "Schlager Honor Comb", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "EXF Trapper Comb", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "FSS Hardtop Comb", "stock"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62 Frangible", "ammo"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62 Hollowpoint", "ammo"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62 Armor Piercing", "ammo"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62 Overpressured +P", "ammo"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
  { const att = await ensureAttachment(prisma, "7.62 High Velocity", "ammo"); await ensureWeaponAttachment(prisma, weapon.id, att.id) }
}
