/**
 * GangSender Allows you change gang member roles either as a whole or individually
 */

import { NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["member"]])];
}

export async function main(ns: NS) {
  const tasks = ns.gang.getTaskNames();
  let members = ns.gang.getMemberNames();
  const data = ns.flags([["member", ""]]);
  if (data.member != "") {
    if (!members.includes(data.member as string)) {
      throw new Error("No Member exists");
    } else {
      members = [data.member as string];
    }
  }
  const taskChoice = await ns.prompt("Which task to set", {
    type: "select",
    choices: tasks,
  });
  members.forEach((person) => {
    ns.gang.setMemberTask(person, taskChoice as string);
  });
}
