import { seed_core_loadout as w0 } from "./loadout";
import { seed_bO6_9mmPM as w1 } from "./bo6-9mm-pm";
import { seed_bO6_grekhova as w2 } from "./bo6-grekhova";
import { seed_bO6_gS45 as w3 } from "./bo6-gs45";
import { seed_bO6_stryder22 as w4 } from "./bo6-stryder-22";
import { seed_bO6_xM4 as w5 } from "./bo6-xm4";
import { PrismaClient } from "@prisma/client";
export async function runAllGenerated(prisma?: PrismaClient) {
  const p = prisma ?? new PrismaClient();
  await w0(p);
  await w1(p);
  await w2(p);
  await w3(p);
  await w4(p);
  await w5(p);
  if (!prisma) await p.$disconnect();
}
if (require.main === module) {
  runAllGenerated()
    .then(() => {
      console.log("Applied generated seeds");
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
