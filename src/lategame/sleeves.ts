import { NS } from "@ns";

/** 
 @param {NS} ns 
 @param {Number} targetSleeve
**/
function upgradeSleeve(ns: NS, targetSleeve: number) {
  const upgrade = ns.sleeve.getSleevePurchasableAugs(targetSleeve);
  upgrade.forEach((up) => {
    if (ns.getPlayer().money >= up.cost) {
      ns.printf("Upgrading %s with Aug: %s", targetSleeve, up.name);
      ns.sleeve.purchaseSleeveAug(targetSleeve, up.name);
    }
  });
}

/** 
 @param {NS} ns 
 @param {String} SleevePurpose
**/
function assigner(ns: NS, SleevePurpose: string) {
  const maxSleeves = ns.sleeve.getNumSleeves();
  ns.printf("Choice: %s", SleevePurpose);
  for (let currentSleeve = 0; currentSleeve < maxSleeves; currentSleeve++) {
    switch (SleevePurpose) {
      case "Gang Focus":
        ns.sleeve.setToCommitCrime(currentSleeve, "Homicide");
        break;
      case "Money":
        ns.sleeve.setToCommitCrime(currentSleeve, "Deal Drugs");
        break;
      case "Upgrade":
        upgradeSleeve(ns, currentSleeve);
        break;
      case "Hack Bump":
        if (ns.sleeve.getSleeve(currentSleeve).city != "Aevum") {
          ns.sleeve.travel(currentSleeve, "Aevum");
        }
        ns.sleeve.setToUniversityCourse(
          currentSleeve,
          "Summit University",
          "Algorithms",
        );
        break;
      case "Cooldown":
        ns.sleeve.setToShockRecovery(currentSleeve);
        break;
    }
  }
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const SleevePurpose = await ns.prompt("Task purpose", {
    type: "select",
    choices: ["Gang Focus", "Upgrade", "Hack Bump", "Cooldown", "Money"],
  });
  assigner(ns, SleevePurpose as string);
}
