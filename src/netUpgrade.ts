/**
 * netUpgrade continually buys hacknet nodes until either the keep threshold is met,
 * at which point it waits until there is money over the keep threshold to buy servers
 * or you max out the pool of nodes,
 */

import { formatMoney } from "common";
import { UpgradeServer } from "../types/CustomTypes";
import { NodeStats, NS } from "@ns";
import { getBudget } from "./common";

let balance = 0;
let max = 0;

/** @param {NS} ns **/
export async function main(ns: NS) {
  ns.disableLog("ALL");
  const poolSize = 100;
  balance = getBalance();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    max = getBalance();

    const [costNode, canNode] = canBuyNode(balance);
    if (canNode) {
      ns.hacknet.purchaseNode();
      deduct(costNode);
    }

    const nodes = getHackNetNodes();

    nodes.forEach((node) => {
      upgradeNode(node, balance);
    });

    displayStats();

    await ns.sleep(100);
  }

  function deduct(price: number) {
    if (balance > 0) {
      balance = balance - price;
    }
  }
  function increment(production: number) {
    if (balance < max) {
      balance = balance + production;
    }
  }

  function getBalance() {
    return getBudget(ns, "net") as number;
  }

  function canBuyNode(balance: number): [number, boolean] {
    const price = ns.hacknet.getPurchaseNodeCost();
    return [price, balance > price];
  }

  function getHackNetNodes(): {
    index: number;
    node: NodeStats;
    maxLevel: boolean;
    maxRam: boolean;
    maxCore: boolean;
  }[] {
    const nodeCount = ns.hacknet.numNodes();
    const hNodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const hNode = ns.hacknet.getNodeStats(i);

      hNodes.push({
        index: i,
        node: hNode,
        maxLevel: false,
        maxRam: false,
        maxCore: false,
      });
    }

    return hNodes;
  }

  function displayStats() {
    ns.clearLog();
    ns.print("--- UPGRADING HACKNET NODES ---");
    ns.printf("BUDGET: %s", formatMoney(ns, max));
    ns.printf("AVAILABLE: %s", formatMoney(ns, balance));
    ns.printf("NUMBER OF NODES: %d OF %d", ns.hacknet.numNodes(), poolSize);
    ns.printf("Production rate is: %s", formatMoney(ns, totalProduction()));
  }

  function upgradeNode(node: UpgradeServer, balance: number) {
    const stats = ["Level", "Ram", "Core"];
    stats.forEach((stat) => {
      const [cost, can] = canUpgrade(stat, node, balance);
      ns.tprint(can);
      if (can) {
        // @ts-expect-error Dynamic method call
        ns.hacknet["upgrade" + stat](node.index);
        deduct(cost);
      }
    });
  }
  function totalProduction() {
    let total = 0;
    getHackNetNodes().forEach((host) => {
      total = total + host.node.production;
    });
    increment(total);
    return total;
  }

  function canUpgrade(stat: string, node: UpgradeServer, balance: number) {
    // @ts-expect-error Dynamic method call
    const cost = ns.hacknet["get" + stat + "UpgradeCost"](node.index);
    if (cost == Infinity) {
      return [0, false];
    }
    return [cost, balance > cost];
  }
}
