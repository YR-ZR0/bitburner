import { formatMoney } from "common";
/**
 * GangManager allows you to see at a glance stats about your gang and also handles
 * purchasing upgrades
 */

import { GangGenInfo, NS } from "@ns";

interface memberStat {
  missingUp: Map<string, number>;
}

const members = new Map<string, memberStat>();

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["keep"], ["monitor"]])];
}

function stattracker(ns: NS, general: GangGenInfo, keep: number) {
  const names = ns.gang.getMemberNames();
  const row = "%-10s | %-18s | %-8s | %-8s";
  ns.printf(row, "Member", "Task", "Earning", "Missing Upgrades");
  names.forEach((member: string) => {
    const memstat = ns.gang.getMemberInformation(member);
    const memberResult = members.get(member)?.missingUp.size;
    ns.printf(
      row,
      memstat.name,
      memstat.task,
      formatMoney(ns, memstat.moneyGain),
      memberResult
    );
  });
  const addrow = "%-10s | %-18s | %-8s | %-8s";
  ns.printf(addrow, "Held Money", "Wanted", "Power", "Territory");
  ns.printf(
    addrow,
    formatMoney(ns, keep),
    ns.formatNumber(general.wantedLevel),
    ns.formatNumber(general.power),
    ns.formatPercent(general.territory)
  );
}

function builder(ns: NS, names: string[]) {
  const everything = ns.gang.getEquipmentNames();
  names.forEach((member) => {
    const memberUpgrades = ns.gang.getMemberInformation(member).upgrades;
    const missing = everything.filter((x) => !memberUpgrades.includes(x));
    const upgrades = new Map<string, number>();
    missing.forEach((upgrade) => {
      const upCost = ns.gang.getEquipmentCost(upgrade);
      upgrades.set(upgrade, upCost);
    });
    const memberObj: memberStat = {
      missingUp: upgrades,
    };
    members.set(member, memberObj);
  });
}

function upgrader(ns: NS, names: string[], keep: number) {
  const currentMoney = ns.getPlayer().money;
  builder(ns, names);
  members.forEach((memberEntry, me) => {
    memberEntry.missingUp.forEach((upgradeCost, currentUpgrade) => {
      if (currentMoney - keep >= upgradeCost) {
        ns.gang.purchaseEquipment(me, currentUpgrade);
      }
    });
  });
}

export async function main(ns: NS) {
  ns.disableLog("ALL");
  const data = ns.flags([
    ["keep", 0],
    ["monitor", false],
  ]);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const general = ns.gang.getGangInformation();
    const names = ns.gang.getMemberNames();
    if (!data.monitor) {
      upgrader(ns, names, data.keep as number);
    } else {
      builder(ns, names);
    }
    stattracker(ns, general, data.keep as number);
    await ns.sleep(400);
    ns.clearLog();
  }
}
