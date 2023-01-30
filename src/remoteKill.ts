/**
 * Remote kill gathers processes running on a remote machine and gives you a choice fo what to kill
 */

import { NS } from "@ns";
import { killSend } from "./common";

export function autocomplete(data: {
  servers: string[];
  flags: (flags: string[][]) => string[][];
}) {
  data.flags([["target"]]);
  return [...data.servers];
}

export async function main(ns: NS) {
  const data = ns.flags([["target", ""]]);
  const processes = ns.ps(data.target as string);
  const filenames = processes.map((el) => {
    return el.filename;
  });

  if (processes != null) {
    const choice = await ns.prompt("Which thing to kill", {
      type: "select",
      choices: filenames,
    });
    ns.tprint(choice);
    const killStatus = ns.scriptKill(choice as string, data.target as string);
    if (killStatus) {
      ns.tprintf("Killed %s on %s", choice, data.target);
    } else {
      ns.tprintf("No Script %s on %s", choice, data.target);
    }
  }
  killSend(ns, data.target as string, 2);
}
