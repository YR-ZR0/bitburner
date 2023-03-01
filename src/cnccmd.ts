/**
 * WIP: to send update commands to the selfhack scripts to adjust different thresholds
 */
import { cncCmd } from "../types/CustomTypes";
import { NS } from "@ns";

export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["money"]])];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([["money", 700000]]);
  const cncPort = ns.getPortHandle(3);
  const command: cncCmd = {
    securityThres: 0.5,
    moneyThres: data.money as number,
  };
  const comandString = JSON.stringify(command);
  cncPort.tryWrite(comandString);
}
