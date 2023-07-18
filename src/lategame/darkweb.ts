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
  ns.singularity.purchaseTor();
  const programs = ns.singularity.getDarkwebPrograms();
  programs.forEach((prog) => {
    const progCost = ns.singularity.getDarkwebProgramCost(prog);
    if (progCost < ns.getPlayer().money) {
      ns.singularity.purchaseProgram(prog);
    }
  });
}
