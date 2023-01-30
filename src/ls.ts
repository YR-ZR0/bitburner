/**
 * a simple recursive ls script to get every file on every breached host
 */
import { spider } from "common";
import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const hostList = spider(ns);
  hostList.breached.forEach((host) => {
    const list = ns.ls(host);
    ns.tprintf("Files on %s are %s", host, list);
  });
}
