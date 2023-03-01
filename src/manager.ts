/**
 * manager gets the income of scripts from all breached hosts
 */

import { ScriptIncome } from "../types/CustomTypes";
import { NS } from "@ns";
import { formatMoney, spider } from "./common";
/** @param {NS} ns */

const globalHosts: ScriptIncome[] = [];

function additem(item: ScriptIncome) {
  const index = globalHosts.findIndex((x) => x.host == item.host);
  if (index === -1) {
    globalHosts.push(item);
  }
}

export async function main(ns: NS) {
  gatherData(ns);
  Render(ns);
}

function gatherData(ns: NS) {
  const all = spider(ns);
  const hosts = all.breached;
  for (const h in hosts) {
    if (ns.ps(hosts[h]).length !== 0) {
      const scrList = ns.ps(hosts[h]);
      for (const scriptEntry in scrList) {
        const fname = scrList[scriptEntry].filename;
        const income = ns.getScriptIncome(fname, hosts[h]);
        additem({ host: hosts[h], script: fname, income: income });
      }
    }
  }
}

function Render(ns: NS) {
  const row = "%-20s | %-12s | %s";
  ns.tprintf(row, "Host", "Script", "Income");
  globalHosts.forEach((item: ScriptIncome) => {
    ns.tprintf(row, item.host, item.script, formatMoney(ns, item.income));
  });
}
