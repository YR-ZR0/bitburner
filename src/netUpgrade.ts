/**
 * netUpgrade continually buys hacknet nodes until either the keep threshold is met,
 * at which point it waits until there is money over the keep threshold to buy servers
 * or you max out the pool of nodes,
 */

import { UpgradeServer } from "./../CustomTypes.d";
import { Hacknet, NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["keep"]])];
}

/** @param {NS} ns **/
export async function main(ns: NS) {
  ns.disableLog("ALL");
  const data = ns.flags([["keep", 0]]);

  const poolSize = 100;
  const keep: number = data.keep as number;
  let fullNodes = 0;

  while (fullNodes != poolSize) {
    const balance = getBalance();

    if (canBuyNode(balance)) {
      ns.hacknet.purchaseNode();
    }

    const nodes = getHackNetNodes();

    nodes.forEach((node) => {
      upgradeNode(node, balance);
    });

    displayStats();

    fullNodes = countFullNodes();

    await ns.sleep(100);
  }

  function getBalance() {
    return ns.getServerMoneyAvailable("home") - keep;
  }

  function canBuyNode(balance: number) {
    const price = ns.hacknet.getPurchaseNodeCost();

    return balance > price;
  }

  function getHackNetNodes() {
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
    ns.printf("AVAILABLE: %s", ns.nFormat(getBalance(), "$0.00a"));
    ns.printf("KEEP: %s", ns.nFormat(keep, "$0.00a"));
    ns.printf("NUMBER OF NODES: %d OF %d", ns.hacknet.numNodes(), poolSize);
    ns.printf("NUMBER OF FULL NODES: %d OF %d", fullNodes, poolSize);
    ns.printf(
      "Production rate is: %s",
      ns.nFormat(totalProduction(), "$0.00a")
    );
  }

  function upgradeNode(node: UpgradeServer, balance: number) {
    const stats = ["Level", "Ram", "Core"];

    stats.forEach((stat) => {
      if (canUpgrade(stat, node, balance)) {
        ns.printf("UPGRADING %s ON %s", stat, node.node.name);
        // @ts-expect-error Dynamic method call
        ns.hacknet["upgrade" + stat](node.index);
      }
    });
  }

  function totalProduction(): number {
    let total = 0;
    getHackNetNodes().forEach((host) => {
      total = total + host.node.production;
    });
    return total;
  }

  function canUpgrade(stat: string, node: UpgradeServer, balance: number) {
    // @ts-expect-error Dynamic method call
    const cost = ns.hacknet["get" + stat + "UpgradeCost"](node.index);

    if (cost == Infinity) {
      // @ts-expect-error Dynamic stat look up
      node["max" + stat] = true;

      return false;
    }

    return balance > cost;
  }

  function countFullNodes() {
    const nodes = getHackNetNodes();
    let count = 0;

    nodes.forEach((node) => {
      if (node.maxCore && node.maxLevel && node.maxRam) {
        count += 1;
      }
    });

    return count;
  }
}
