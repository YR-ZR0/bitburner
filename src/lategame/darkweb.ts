/**
 * @module lategame/darkweb
 * Try to buy everything from the darkweb.
 */
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  darkweb(ns);
}
/** @param {NS} ns */
function darkweb(ns: NS) {
  const torBought = ns.singularity.purchaseTor();
  let progBought = 0;
  ns.toast(
    ns.sprintf("Tor Bought %s", torBought),
    torBought ? "success" : "error",
  );
  if (torBought) {
    const programs = ns.singularity.getDarkwebPrograms();
    programs.forEach((prog) => {
      const progCost = ns.singularity.getDarkwebProgramCost(prog);
      if (progCost < ns.getPlayer().money) {
        const bought = ns.singularity.purchaseProgram(prog);
        if (bought) {
          progBought++;
        }
      }
    });
    if (progBought != 0) {
      ns.toast(ns.sprintf("Progs bought %d", progBought));
    } else {
      ns.toast("No Programs Bought", "error");
    }
  }
}
