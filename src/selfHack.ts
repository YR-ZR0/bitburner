/**
 * selfHack is a function that is ran on a breached host. it takes no args.
 * @module
 * @remarks
 * selfHack basically automates early game hacking when combined with {@link ripntear} it allows fast iteration over hosts that can be breached.
 * IT also calls back to {@link listen} to send statstics about the breached host see {@link StatPayload}
 */

import { StatPayload, actionFlags, cncCmd } from "./../CustomTypes.d";
import { NS } from "@ns";
import { cncpayload } from "common";

/**
 *  @param {NS} ns
 *  @param {StatPayload} stats
 *  @param {Object} trigger
 * */
async function runner(ns: NS, stats: StatPayload, trigger: actionFlags) {
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
async function decider(ns: NS, moneyThres: number) {
  const cncPort = ns.getPortHandle(3);
  const host = ns.getHostname();
  const remain = ns.getServerMoneyAvailable(host);
  const max = ns.getServerMaxMoney(host);
  const chance = ns.hackAnalyzeChance(host);
  const securityThres = 0.5;
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
  //TODO: process command
  if (!cncPort.empty()) {
    const cncData = cncPort.read() as string;
    const cncJson: cncCmd = JSON.parse(cncData);
    ns.print(cncJson);
  }
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

/** @param {NS} ns */
export async function main(ns: NS) {
  const moneyThres = 500000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await decider(ns, moneyThres);
  }
}
