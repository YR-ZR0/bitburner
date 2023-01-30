/**
 * WIP: to send update commands to the selfhack scripts to adjust different thresholds
 */
import { cncCmd } from "./../CustomTypes.d";
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const cncPort = ns.getPortHandle(3);
  const command: cncCmd = { securityThres: 0.5, moneyThres: 500000 };
  const comandString = JSON.stringify(command);

  cncPort.tryWrite(comandString);
}
