/**
 * Generated seed modules live here. Do not edit by hand — run pnpm gen:seeds in the package to regenerate from weapon-notes/*.md.
 */

import { PrismaClient } from "@prisma/client";
import {
  ensureWeapon,
  ensureAttachment,
  ensureWeaponAttachment,
} from "../seed-utils";

export async function seed_bO6_stryder22(prisma: PrismaClient) {
  const weapon = await ensureWeapon(prisma, {
    name: "Stryder .22",
    category: "pistol",
    game: "BO6",
    primary: false,
    secondary: true,
  });
  {
    const att = await ensureAttachment(prisma, "Remuda Mini Reflex", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Otero Micro Dot", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Kepler Microflex", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Merlin Mini", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Accu-Spot Reflex", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Kepler Pistol Scope", "optic");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Suppressor", "muzzle");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Compensator", "muzzle");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Muzzle Brake", "muzzle");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Ported Compensator", "muzzle");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(
      prisma,
      "Monolithic Suppressor",
      "muzzle",
    );
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Gain-Twist Barrel", "barrel");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Long Barrel", "barrel");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Reinforced Barrel", "barrel");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Short Barrel", "barrel");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "CHF Barrel", "barrel");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Extended Mag I", "magazine");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Fast Mag I", "magazine");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Extended Mag II", "magazine");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Fast Mag II", "magazine");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Quickdraw Grip", "rear_grip");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Assault Grip", "rear_grip");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Commando Grip", "rear_grip");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Ergonomic Grip", "rear_grip");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "CQB Grip", "rear_grip");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Akimbo Stryder .22", "stock");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Steady Aim Laser", "laser");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Fast Motion Laser", "laser");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Tactical Laser", "laser");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Strelok Laser", "laser");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Target Laser", "laser");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Rapid Fire", "fire_mod");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(
      prisma,
      ".22 WMR Overpressured",
      "fire_mod",
    );
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, "Recoil Springs", "fire_mod");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(prisma, ".22 WMR FMJ", "fire_mod");
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
  {
    const att = await ensureAttachment(
      prisma,
      "Stryder .22 3-Round Burst Mod",
      "fire_mod",
    );
    await ensureWeaponAttachment(prisma, weapon.id, att.id);
  }
}
