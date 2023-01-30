/**
 * Try to buy everything from the darkweb
 * @alpha
 */

import { NS } from "@ns";

export async function main(ns: NS) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    darkweb(ns);
    await ns.sleep(60000);
  }
}

function darkweb(ns: NS) {
  ns.singularity.purchaseTor();
  ns.singularity.purchaseProgram("brutessh.exe");
  ns.singularity.purchaseProgram("ftpcrack.exe");
  ns.singularity.purchaseProgram("autolink.exe");
  ns.singularity.purchaseProgram("deepscanv1.exe");
  ns.singularity.purchaseProgram("relaysmtp.exe");
  ns.singularity.purchaseProgram("httpworm.exe");
  ns.singularity.purchaseProgram("deepscanv2.exe");
  ns.singularity.purchaseProgram("sqlinject.exe");
}
