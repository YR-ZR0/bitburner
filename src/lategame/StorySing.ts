// StorySing.ts
/**
 * Story loops over the main story targets for progression and uses {@link NetscriptDefinitions.Singularity.connect} to attack automatically
 */

import { NS } from "@ns";
import { singMap } from "common";
import { storyTarget } from "../../types/CustomTypes";

const targetSpecs: Record<string, storyTarget> = {
  CSEC: { lvl: 58, needed: 1 },
  "avmnite-02h": { lvl: 209, needed: 2 },
  "I.I.I.I": { lvl: 352, needed: 3 },
  run4theh111z: { lvl: 529, needed: 4 },
};

/**
 * Loops over the story targets and calls {@link common.singMap} on each one to get a target path.
 *
 * @param ns - the standard ns import
 */
export async function main(ns: NS) {
  const targets = Object.keys(targetSpecs);
  for (let i = 0; i < targets.length; ++i) {
    const host = targets[i];
    const path = singMap(ns, host).reverse()
    ns.print(host);
    path.forEach((host: string) => {
      ns.singularity.connect(host);
    });
    await ns.singularity.installBackdoor();
    ns.singularity.connect("home");
  }
}
