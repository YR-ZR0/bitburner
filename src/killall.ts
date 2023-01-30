/**
 * killall loops over every host that is breached and kills everything. Useful for testing scripts that have static vars
 */

import { spider } from "common";
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const breached = spider(ns).breached;
  breached.forEach((host) => {
    ns.killall(host);
  });
}
