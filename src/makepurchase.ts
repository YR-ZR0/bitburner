import { NS } from "@ns";
/**
 * makePurchase purchases servers at the memory and count that you specify
 * @example
 * run makePurhcase.js --amount 2 --memory 2048
 * this buys two servers with 2048GB of ram each named odin and odin-0
 */
export function autocomplete(data: {
  flags: (flags: string[][]) => string[][];
}) {
  return [data.flags([["memory"], ["amount"]])];
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const data = ns.flags([
    ["memory", 0],
    ["amount", 1],
  ]);
  for (let index = 0; index < data.amount; index++) {
    ns.purchaseServer("odin", data.memory as number);
  }
}
