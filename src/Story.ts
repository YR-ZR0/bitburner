// Story.ts
/**
 * Story loops over the main story targets for progression and asks the user if they would like to attack it
 * @module Story
 */

import { NS } from "@ns";
import { mapout, sendCommand } from "common";
import { storyTarget } from "../types/CustomTypes";

const targetSpecs: Record<string, storyTarget> = {
  CSEC: { lvl: 58, needed: 1 },
  "avmnite-02h": { lvl: 209, needed: 2 },
  "I.I.I.I": { lvl: 352, needed: 3 },
  run4theh111z: { lvl: 529, needed: 4 },
};
/**
 * visits the given host and executes the backdoor command manually
 * @param ns - the standard ns import
 * @param host - the host to breach
 * @param backdoorTime - the delay to sleep after sending the backdoor command
 * @remarks the backdoorTime is needed to prevent commands being sent during the backdoor command
 * doing so results in the terminal printing backdoot in progress.
 * this then throws off the timing of other commands in the list.
 */
export async function visit(ns: NS, host: string, backdoorTime: number) {
  await sendCommand(ns, host);
  await sendCommand(ns, "backdoor");
  await ns.sleep(backdoorTime);
  await sendCommand(ns, "home");
}
/**
 * Loops over the story targets and calls {@link common.mapout} on each one to get a target path.
 *
 * @param ns - the standard ns import
 * @remarks
 * When we call visit we rely on the NS.getHackTime() function to get the best time to wait, we then send this onto the {@link visit} function
 */
export async function main(ns: NS) {
  const targets = Object.keys(targetSpecs);
  for (let i = 0; i < targets.length; ++i) {
    const host = targets[i];
    const specs = targetSpecs[host];
    const ans = ns.prompt(
      ns.sprintf(
        "Do you want to start attacking %s with specs Level:%d and Ports:%d",
        host,
        specs.lvl,
        specs.needed,
      ),
      { type: "boolean" },
    );
    if (await ans) {
      ns.tprint("Proceeding");
      const path = ns.sprintf("%s;", mapout(ns, host));
      const backdoorTime = ns.getHackTime(host);
      await visit(ns, path, backdoorTime);
    } else {
      if (ns.getHostname() !== "home") {
        await sendCommand(ns, "home");
      }
    }
  }
}
