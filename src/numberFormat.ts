//numberFormat.ts
/**
 * NumberFormat lets you quickly get a human readable number back from a normal number
 * @module
 * @example
 * ```
 * run numberFormat 10000
 * returns 10.0k
 * ```
 */
import { NS } from "@ns";
/**
 *
 * @hidden
 */
export async function main(ns: NS) {
  // eslint-disable-next-line prefer-rest-params
  const args_obj = arguments[0];
  const nNumber = args_obj.args[0];
  ns.tprintf("%s", ns.nFormat(nNumber, "(0.0a)"));
}
