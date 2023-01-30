// common.ts
/**
 * Common functions that can be reused across the project
 * @module common
 */

import { parsePayload } from "./../CustomTypes.d";
import { StatPayload, diffTime } from "./../CustomTypes.d";
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
