import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const factions = ns.getPlayer().factions;
  factions.forEach((faction: string) => {
    const baseAugs = ns.singularity.getAugmentationsFromFaction(faction);
    baseAugs.forEach((aug) => {
      const price = ns.singularity.getAugmentationPrice(aug);
      if (ns.getPlayer().money > price) {
        ns.singularity.purchaseAugmentation(faction, aug);
      }
    });
  });
}
