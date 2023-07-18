// common.ts
/**
 * Common functions that can be reused across the project
 * @module common
 */

import { actionFlags, cncCmd, parsePayload } from "../types/CustomTypes";
import { StatPayload, diffTime } from "../types/CustomTypes";
import { NS } from "@ns";

/**
 * sendCommand inputs text into the terminal as if the user was physically typing it
 * @param cmd - is the command we want to type into the terminal
 */
export async function sendCommand(ns: NS, cmd: string) {
  const terminalInput = document.getElementById("terminal-input");
  // @ts-expect-error value will always exist in the UI stack
  terminalInput.value = cmd;
  // @ts-expect-error Depends on the above
  const handler = Object.keys(terminalInput)[1];
  // @ts-expect-error Dynamic stat look up
  terminalInput[handler].onChange({ target: terminalInput });
  // @ts-expect-error Dynamic stat look up
  terminalInput[handler].onKeyDown({
    key: "Enter",
    preventDefault: () => null,
  });
}

/**
 * formatMoney returns a currency string. This replaces the nformat calls.
 * @param ns - NS import
 * @param value - value to transform
 * @example
 * formatMoney(ns,10000)
 * "$ 10k"
 * @returns "$ value suffix"
 */

export function formatMoney(ns: NS, value: number) {
  return ns.sprintf("$ %s", ns.formatNumber(value));
}

/* eslint-disable no-empty */
/** hailMary launches every available attack on the target.
 * @remarks
 * We do a blank catch to avoid any issues if the exe doesn't exist on the user machine
 * @example
 * ```
 * hailMary(ns,"n00dles")
 * ```
 * @param target - the machine we want to hail mary
 */
export function hailMary(ns: NS, target: string) {
  try {
    ns.brutessh(target);
  } catch {}
  try {
    ns.ftpcrack(target);
  } catch {}
  try {
    ns.relaysmtp(target);
  } catch {}
  try {
    ns.httpworm(target);
  } catch {}
  try {
    ns.sqlinject(target);
  } catch {}
  try {
    ns.nuke(target);
  } catch {}
}

/**
 * Map out the connection route to the given target.
 * returns a string that chain connects to each server needed to connect to the target
 * @param tgt - target we want to reach
 * @example
 * Given the following path `home -> n00dles -> CSEC`
 * ```
 * // returns "connect n00dles; connect CSEC;"
 * mapout(ns,"CSEC")
```
 */
export function mapout(ns: NS, tgt: string) {
  let temp = ns.scan(tgt);
  let path = "";
  let prev = temp[0];
  let done = 0;
  while (done == 0) {
    if (prev == "home") {
      done = 1;
    } else {
      temp = ns.scan(prev);
      path = "connect " + prev + ";" + path;
      prev = temp[0];
    }
  }
  return "\n" + path + "connect " + tgt;
}

/**
 * Spider all hosts in the network
 * @returns - returns breached and non breached servers as a object
 */
export function spider(ns: NS): { breached: string[]; noBreach: string[] } {
  ns.disableLog("scan");
  const purchased = ns.getPurchasedServers();
  const excludes = [purchased + "home"];
  const serversSeen = ["home"];
  for (let i = 0; i < serversSeen.length; i++) {
    const thisScan = ns.scan(serversSeen[i]);
    for (let j = 0; j < thisScan.length; j++) {
      if (serversSeen.indexOf(thisScan[j]) === -1) {
        serversSeen.push(thisScan[j]);
      }
    }
  }

  const noBreach = serversSeen.filter((host) => {
    if (ns.getServer(host).hasAdminRights == false) {
      return host;
    }
  });

  const breached = serversSeen.filter((host) => {
    if (ns.getServer(host).hasAdminRights == true) {
      return !excludes.includes(host);
    }
  });
  return { breached, noBreach };
}

/**
 * Calculates the diff between two dates
 * @param date1 - start date
 * @param date2 - end date
 */
export function showDiff(date1: Date, date2: Date | string): diffTime {
  const date2parsed = new Date(date2);
  let diff = (date2parsed.getTime() - date1.getTime()) / 1000;
  diff = Math.abs(Math.floor(diff));

  const days = Math.floor(diff / (24 * 60 * 60));
  let leftSec = diff - days * 24 * 60 * 60;

  const hrs = Math.floor(leftSec / (60 * 60));
  leftSec = leftSec - hrs * 60 * 60;

  const min = Math.floor(leftSec / 60);
  leftSec = leftSec - min * 60;
  const allVars = {
    day: days,
    hr: hrs,
    min: min,
    sec: leftSec,
  };
  return allVars;
}

//FIXME: The function should take into account if the requested script is running. as it currently will be off by a few threads
//When recommending a thread size e.g. it will calc 204 but due to running programs it is actually 200
//We need to make sure that when we calc the current running script we don't end up returning 0 and breaking things that rely on this func
/**
 * Calculates the maximum copies that a host can run of a script.
 * if the host has no RAM we return 0 early
 * @param script - script to calculate ram for
 * @param host - host to be run on
 * @example
 * myscript consumes 200MB of RAM
 *
 * home has 1GB of  RAM
 * ```
 * // returns 5
 * const max = maxcopies(ns,"myscript.js","home")
 * ```
 * */
export function maxCopies(ns: NS, script: string, host: string): number | 0 {
  const costOne = ns.getScriptRam(script, host);
  const getram = ns.getServerMaxRam(host);
  if (getram == 0) {
    return 0;
  }
  const copies = Math.floor(getram / costOne);
  return copies;
}

/**
 * Report back the stats of a breached host
 * @param action - what action was taken
 * @param stats - the stats of the breached host
 * @param port - the port to send the data to
 */
export async function cncpayload(
  ns: NS,
  action: string,
  stats: StatPayload,
  port: number
) {
  const senderport = ns.getPortHandle(port);
  const server: parsePayload = {
    host: stats.host,
    action: action,
    remain: stats.remain,
    max: stats.max,
    thres: stats.thres,
    chance: stats.chance,
    stamp: new Date(),
    threads: stats.threads,
  };

  while (senderport.full()) {
    ns.print("Waiting for space to write");
    await ns.sleep(1000);
  }
  const StrServer = JSON.stringify(server);
  senderport.write(StrServer);
}

/**
 * getBudget allows a app to get it's budget from the budget file
 * this allows us to set global limits on app spending
 * @param appName - key to look up
 * @param ns - NS import
 */
export function getBudget(ns: NS, appName: string): string | number {
  const budgetFile = "budgets.txt";
  if (ns.fileExists(budgetFile)) {
    const fileContent = ns.read(budgetFile);
    return JSON.parse(fileContent)[appName];
  } else {
    throw new Error("Key file not found");
  }
}

/**
 *  @param {NS} ns
 *  @param {StatPayload} stats
 *  @param {Object} trigger
 * */
export async function runner(ns: NS, stats: StatPayload, trigger: actionFlags) {
  const threads = ns.getRunningScript()?.threads;
  if (threads != undefined) {
    stats.threads = threads;
  } else {
    stats.threads = 0;
  }
  const key = Object?.keys(trigger).find((k): boolean => trigger[k] === true);
  if (key !== undefined) {
    await cncpayload(ns, key, stats, 1);
    switch (key) {
      case "weaken":
        await ns.weaken(stats.host, { threads: threads });
        break;
      case "grow":
        for (let index = 0; index < 1; index++) {
          await ns.grow(stats.host, { threads: threads });
        }
        break;
      case "hunt":
        await ns.hack(stats.host, { threads: threads });
        break;
    }
  }
}

/**
 * @param {NS} ns
 * @param {string} host
 */
export async function decider(
  ns: NS,
  moneyThres: number,
  cncEnable: boolean,
  selfRunner: boolean,
  target?: string
) {
  let host;
  if (selfRunner) {
    host = ns.getHostname();
  } else {
    host = target;
  }
  const remain = ns.getServerMoneyAvailable(host);
  const max = ns.getServerMaxMoney(host);
  const chance = ns.hackAnalyzeChance(host);
  let securityThres = 0.5;

  if (cncEnable) {
    const cncPort = ns.getPortHandle(3);
    if (!cncPort.empty()) {
      const cncData = cncPort.peek() as string;
      const cncJson: cncCmd = JSON.parse(cncData);
      ns.print(cncJson);
      moneyThres = cncJson.moneyThres;
      securityThres = cncJson.securityThres;
    }
  }

  if (moneyThres > max) {
    moneyThres = max / 2;
  }

  if (max == 0) {
    ns.exit();
  }
  const flags: actionFlags = {
    weaken: false,
    grow: false,
    hunt: false,
  };

  const stats: StatPayload = {
    host: host,
    remain: remain,
    chance: chance,
    max: max,
    thres: moneyThres,
  };
  if (chance < securityThres) {
    flags.weaken = true;
  }
  if (remain < moneyThres) {
    flags.grow = true;
  }
  if (flags.grow == false && flags.weaken == false) {
    flags.hunt = true;
  }
  await runner(ns, stats, flags);
}

/**
 * Send a die action to deregister the host
 * @param host
 * @param port
 * @alpha
 */
export async function killSend(ns: NS, host: string, port: number) {
  const senderport = ns.getPortHandle(port);
  const server = {
    host: host,
    action: "die",
  };

  while (senderport.full()) {
    ns.print("Waiting for space to write");
    await ns.sleep(1000);
  }
  senderport.write(server.toString());
}
