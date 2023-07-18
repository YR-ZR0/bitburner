import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns) {
  const gangFaction = ns.gang.getGangInformation().faction;
  const baseAugs = ns.singularity.getAugmentationsFromFaction(gangFaction);
  baseAugs.forEach((aug) => {
    const price = ns.singularity.getAugmentationPrice(aug);
    if (ns.getPlayer().money > price) {
      ns.singularity.purchaseAugmentation(gangFaction, aug);
    }
  });
}
