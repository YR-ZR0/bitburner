/**
 * list waits for the Cncpay load command to sends stats about each host
 * then pretty prints it to the logs in a table
 */

import { parsePayload, StatPayload } from "../types/CustomTypes";
import { NS } from "@ns";
import { formatMoney, showDiff } from "common";

const globalState = new Map();

/** @param {NS} ns */
async function listener(ns: NS) {
  const port = ns.getPortHandle(1);
  const cmd = ns.getPortHandle(2);

  while (!cmd.empty()) {
    const actionMsg = cmd.read();
    ns.tprint(actionMsg);
    await ns.sleep(100);
  }

  while (port.empty()) {
    dispatchMessage(ns, "Empty");
    await ns.sleep(200);
  }
  while (!port.empty()) {
    const strData = port.read() as string;
    const data: StatPayload = JSON.parse(strData);
    globalState.set(data.host, data);
    dispatchMessage(ns, "Full");
    await ns.sleep(100);
  }
}
/**
 * @param {NS} ns
 * @param {string} queueStatus
 */
function dispatchMessage(ns: NS, queueStatus: string) {
  const now = new Date();
  ns.clearLog();
  ns.printf("Queue status is %s", queueStatus);
  const row = "%-15s | %-8s | %-8s | %-8s | %-8s | %-8s | %-25s | %-10s";
  ns.printf(
    row,
    "Host",
    "Act",
    "Sec",
    "Cash",
    "Thres",
    "Max",
    "TimeStamp",
    "Threads"
  );
  globalState.forEach((stat: parsePayload, host: string) => {
    ns.printf(
      row,
      host,
      stat.action,
      ns.formatPercent(stat.chance),
      formatMoney(ns, stat.remain),
      formatMoney(ns, stat.thres),
      formatMoney(ns, stat.max),
      ns.sprintf(
        "Hrs: %(hr)s Mins: %(min)s Secs: %(sec)s",
        showDiff(now, stat.stamp)
      ),
      stat.threads
    );
  });
}

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await listener(ns);
    await ns.sleep(200);
  }
}
