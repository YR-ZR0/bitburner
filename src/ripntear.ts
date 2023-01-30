/**
 * ripandtear calls {@link common.spider} to gather all hosts that are not breached,breaches them and run the specified script on them
 * @module
 * @example
 * ```
 * run ripntear.js --script selfhack.js [--threads 1]
 * ```
 * @remarks
 * we use {@link ccmmon.maxCopies} to judge the max amount of threads to use for a script if the threads flag is not specified
 */

import { NS, Server } from "@ns";
import { maxCopies, spider, hailMary } from "common";

export function autocomplete(data: {
  flags: (flags: string[][]) => void;
  servers: string[];
  scripts: string[];
}) {
  data.flags([["script"], ["threads"]]);
  return [...data.servers, ...data.scripts];
}

/** @param {NS} ns, @param {Server} stats*/
function breakandenter(ns: NS, stats: Server) {
  const host = stats.hostname;
  const skillLevel = ns.getServerRequiredHackingLevel(host);
  const playerLevel = ns.getPlayer().skills.hacking;
  const assesment = {
    open: stats.openPortCount,
    required: stats.numOpenPortsRequired,
    skillcheck: playerLevel >= skillLevel,
    should:
      stats.openPortCount < stats.numOpenPortsRequired ||
      stats.openPortCount == stats.numOpenPortsRequired,
  };
  if (assesment.should) {
    ns.printf("I need to break %s", host);
  }

  if (assesment.skillcheck) {
    ns.printf("I could break %s", host);
  } else {
    ns.printf(
      "Can't break %s I need %u and player has %u",
      host,
      skillLevel,
      playerLevel
    );
  }
  if (assesment.skillcheck && assesment.should) {
    ns.printf("Lets hailmary %s", host);
    hailMary(ns, host);
  }
}

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("scp");
  const data = ns.flags([
    ["script", "none"],
    ["threads", 0],
  ]);
  const everything = spider(ns);
  const noBreach = everything.noBreach;
  for (const i in noBreach) {
    const hostNoBreach = noBreach[i];
    const stats = ns.getServer(hostNoBreach);
    breakandenter(ns, stats);
  }
  const rescan = spider(ns);
  const breached = rescan.breached;
  ns.clear("NoRam.txt");
  for (const j in breached) {
    const hostBreach = breached[j];
    ns.scp("common.js", hostBreach, "home");
    ns.scp(data.script as string, hostBreach);
    const threads =
      (data.threads as number) ||
      maxCopies(ns, data.script as string, hostBreach);
    if (threads !== 0) {
      ns.exec(data.script as string, hostBreach, threads);
    } else {
      if (hostBreach != "darkweb") {
        ns.write("NoRam.txt", ns.sprintf("%s\n", hostBreach), "a");
      }
    }
  }
}
