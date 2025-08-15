import { seed_core_loadout as w0 } from './loadout'
import { seed_bO6_9mmPM as w1 } from './bo6-9mm-pm'
import { seed_bO6_aBRA1 as w2 } from './bo6-abr-a1'
import { seed_bO6_aEK973 as w3 } from './bo6-aek-973'
import { seed_bO6_aK74 as w4 } from './bo6-ak-74'
import { seed_bO6_aMES85 as w5 } from './bo6-ames-85'
import { seed_bO6_aMRMod4 as w6 } from './bo6-amr-mod-4'
import { seed_bO6_aSVAL as w7 } from './bo6-as-val'
import { seed_bO6_aSG89 as w8 } from './bo6-asg-89'
import { seed_bO6_c9 as w9 } from './bo6-c9'
import { seed_bO6_cIGMA2B as w10 } from './bo6-cigma-2b'
import { seed_bO6_cR56AMAX as w11 } from './bo6-cr-56-amax'
import { seed_bO6_cypher091 as w12 } from './bo6-cypher-091'
import { seed_bO6_dM10 as w13 } from './bo6-dm-10'
import { seed_bO6_essexModel07 as w14 } from './bo6-essex-model-07'
import { seed_bO6_feng82 as w15 } from './bo6-feng-82'
import { seed_bO6_fFAR1 as w16 } from './bo6-ffar-1'
import { seed_bO6_goblinMk2 as w17 } from './bo6-goblin-mk2'
import { seed_bO6_gPMG7 as w18 } from './bo6-gpmg-7'
import { seed_bO6_gPR91 as w19 } from './bo6-gpr-91'
import { seed_bO6_grekhova as w20 } from './bo6-grekhova'
import { seed_bO6_gS45 as w21 } from './bo6-gs45'
import { seed_bO6_hDR as w22 } from './bo6-hdr'
import { seed_bO6_hE1 as w23 } from './bo6-he-1'
import { seed_bO6_jackalPDW as w24 } from './bo6-jackal-pdw'
import { seed_bO6_kilo141 as w25 } from './bo6-kilo-141'
import { seed_bO6_kompakt92 as w26 } from './bo6-kompakt-92'
import { seed_bO6_krigC as w27 } from './bo6-krig-c'
import { seed_bO6_kSV as w28 } from './bo6-ksv'
import { seed_bO6_ladra as w29 } from './bo6-ladra'
import { seed_bO6_lC10 as w30 } from './bo6-lc10'
import { seed_bO6_lR762 as w31 } from './bo6-lr-7-62'
import { seed_bO6_lW3A1Frostline as w32 } from './bo6-lw3a1-frostline'
import { seed_bO6_maelstrom as w33 } from './bo6-maelstrom'
import { seed_bO6_marineSP as w34 } from './bo6-marine-sp'
import { seed_bO6_modelL as w35 } from './bo6-model-l'
import { seed_bO6_pML556 as w36 } from './bo6-pml-5-56'
import { seed_bO6_pP919 as w37 } from './bo6-pp-919'
import { seed_bO6_pPSh41 as w38 } from './bo6-ppsh-41'
import { seed_bO6_pU21 as w39 } from './bo6-pu-21'
import { seed_bO6_saug as w40 } from './bo6-saug'
import { seed_bO6_stryder22 as w41 } from './bo6-stryder-22'
import { seed_bO6_sVD as w42 } from './bo6-svd'
import { seed_bO6_sWAT556 as w43 } from './bo6-swat-5-56'
import { seed_bO6_tanto22 as w44 } from './bo6-tanto-22'
import { seed_bO6_tR2 as w45 } from './bo6-tr2'
import { seed_bO6_tsarkov762 as w46 } from './bo6-tsarkov-7-62'
import { seed_bO6_xM4 as w47 } from './bo6-xm4'
import { seed_bO6_xMG as w48 } from './bo6-xmg'
import { PrismaClient } from '@prisma/client'
export async function runAllGenerated(prisma?: PrismaClient) {
  const p = prisma ?? new PrismaClient()
  await w0(p)
  await w1(p)
  await w2(p)
  await w3(p)
  await w4(p)
  await w5(p)
  await w6(p)
  await w7(p)
  await w8(p)
  await w9(p)
  await w10(p)
  await w11(p)
  await w12(p)
  await w13(p)
  await w14(p)
  await w15(p)
  await w16(p)
  await w17(p)
  await w18(p)
  await w19(p)
  await w20(p)
  await w21(p)
  await w22(p)
  await w23(p)
  await w24(p)
  await w25(p)
  await w26(p)
  await w27(p)
  await w28(p)
  await w29(p)
  await w30(p)
  await w31(p)
  await w32(p)
  await w33(p)
  await w34(p)
  await w35(p)
  await w36(p)
  await w37(p)
  await w38(p)
  await w39(p)
  await w40(p)
  await w41(p)
  await w42(p)
  await w43(p)
  await w44(p)
  await w45(p)
  await w46(p)
  await w47(p)
  await w48(p)
  if (!prisma) await p.$disconnect()
}
if (require.main === module) {
  runAllGenerated().then(() => {
    console.log('Applied generated seeds')
  }).catch((e) => {
    console.error(e); process.exit(1)
  })
}
