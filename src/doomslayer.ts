// doomslayer.ts
/**
 * Doomslayer ensures that {@link listen} is up and continuously calls {@link selfHack} to gather new hosts
 * @module
 */

import { NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["money"], ["interval"]])];
}

/**
 *  checkListener ensures that listen is up and running
 * @param ns - the ns import
 */
export function checkListener(ns: NS) {
  const running = ns.isRunning("listen.js");
  if (!running) {
    ns.exec("listen.js", "home");
  }
}
/**
 * stopwatch records the last run time and prints it to the logs
 * @param ns - the standard ns import
 * @param lastrun - the last time that doomslayer ran a interval
 */
export function stopwatch(ns: NS, lastrun: Date) {
  ns.clearLog();
  ns.printf("Last Run: %s", lastrun.toLocaleString());
}
/**
 * Daemon takes in a interval to run and calls {@link stopwatch}
 * @param ns - the standard ns import
 * @param interval - time in ms to run on
 * @param initTime - the time that doomslayer started
 */
export function daemon(ns: NS, interval: number, initTime: Date) {
  stopwatch(ns, initTime);
  ns.exec("ripntear.js", "home", 1, "--script", "selfHack.js");
}

/** calls {@link daemon} to kick things off
 *
 * @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["interval", 5000]]);

  const interval = data.interval as number;
  // ns.disableLog("ALL");
  ns.print("Starting Daemon...");
  ns.print("Starting Listener...");
  checkListener(ns);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const initTime = new Date();
    daemon(ns, interval, initTime);
    await ns.sleep(interval);
  }
}
