/**
 * WIP
 */
import { NS } from "@ns";
export function autocomplete(data: {
  flags: (flag: string[][]) => void;
  servers: string[];
}) {
  data.flags([["target"]]);
  return [...data.servers]; // This script autocompletes the list of servers.
}

//Do calcs on server security
/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["target", ""]]);
  const grow_threads = ns.growthAnalyze(data.target as string, 2);
  const hack_threads = ns.hackAnalyzeThreads(
    data.target as string,
    ns.getServerMoneyAvailable(data.target as string) / 2
  );
  const sec_increase =
    ns.hackAnalyzeSecurity(hack_threads) +
    ns.growthAnalyzeSecurity(grow_threads);
  const weaken_threads = 1;
  ns.tprintf(
    "Growth Calc: %s, Hack Threads: %s to get 50%%, Hack Security: %s Weaken %s",
    grow_threads,
    hack_threads,
    sec_increase,
    weaken_threads
  );
}
