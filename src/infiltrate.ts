/**
 * infiltrate prints out all locations you could infiltrate with stats
 * @module
 */

import { NS } from "@ns";
/** @param {NS} ns */
export async function main(ns: NS) {
  const loc = ns.infiltration.getPossibleLocations();
  const row = "%-15s | %-8s | %-8s | %-8s | %-8s";
  ns.tprintf(row, "Trade $", "SoA Rep", "Name", "Clearance", "City");

  for (const l in loc) {
    const inf = ns.infiltration.getInfiltration(loc[l].name);
    ns.tprintf(
      row,
      ns.formatNumber(inf.reward.tradeRep),
      ns.formatNumber(inf.reward.SoARep),
      inf.location.name,
      inf.difficulty,
      inf.location.city
    );
  }
}
