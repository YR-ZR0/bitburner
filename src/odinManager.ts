/**
 * odinManager sends a job to every odin server you have and also copies the common lib over
 */
import { maxCopies } from "common";
import { NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => void;
  scripts: string[];
}) {
  data.flags([["script"], ["threads"]]);
  return [...data.scripts]; // This script autocompletes the list of scripts.
}

/** @param {NS} ns */
export async function main(ns: NS) {
  // ns.disableLog("scp");
  const data = ns.flags([
    ["script", "none"],
    ["threads", 0],
  ]);
  const workers: string[] = ns.getPurchasedServers();
  workers.forEach((odinServer) => {
    ns.scp("common.js", odinServer, "home");
    ns.scp(data.script as string, odinServer);
    const threads =
      (data.threads as number) ||
      maxCopies(ns, data.script as string, odinServer);
    ns.exec(data.script as string, odinServer, threads);
  });
}
