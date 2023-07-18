import { NS } from "@ns";

function upgradeSleeve(ns: NS, targetSleeve: number) {
  const upgrade = ns.sleeve.getSleevePurchasableAugs(targetSleeve);
  upgrade.forEach((up) => {
    if (ns.getPlayer().money >= up.cost) {
      ns.printf("Upgrading %s with Aug: %s", targetSleeve, up.name);
      ns.sleeve.purchaseSleeveAug(targetSleeve, up.name);
    }
  });
}

function assigner(ns: NS, SleevePurpose: string) {
  const maxSleeves = ns.sleeve.getNumSleeves();
  ns.printf("Choice: %s", SleevePurpose);
  for (let currentSleeve = 0; currentSleeve < maxSleeves; currentSleeve++) {
    if (SleevePurpose == "Gang Focus") {
      ns.sleeve.setToCommitCrime(currentSleeve, "Homicide");
    } else if (SleevePurpose == "Upgrade") {
      ns.printf("Sleeve number: %s", currentSleeve);
      upgradeSleeve(ns, currentSleeve);
    }
  }
}
/** @param {NS} ns */
export async function main(ns: NS) {
  const SleevePurpose = await ns.prompt("Task purpose", {
    type: "select",
    choices: ["Gang Focus", "Upgrade"],
  });
  assigner(ns, SleevePurpose as string);
}
