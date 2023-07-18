import { NodeStats } from "../NetscriptDefinitions";

export interface StatPayload {
  host: string;
  remain: number;
  chance: number;
  max: number;
  thres: number;
  threads?: number;
}
export interface UpgradeServer {
  index: number;
  node: NodeStats;
  maxLevel: boolean;
  maxRam: boolean;
  maxCore: boolean;
}
export interface diffTime {
  day: number;
  hr: number;
  min: number;
  sec: number;
}
export interface parsePayload extends StatPayload {
  action: string;
  stamp: Date;
}

/**
 * actionFlags is a type we used to indicate what action a breached host performed
 */
export interface actionFlags {
  /** Did we weaken */
  weaken: boolean;
  /** Did we grow */
  grow: boolean;
  /** Did we hunt */
  hunt: boolean;
  [key: string]: boolean;
}

export interface storyTarget {
  lvl: number;
  needed: number;
}

export interface cncCmd {
  moneyThres: number;
  securityThres: number;
}
export interface ScriptIncome {
  host: string;
  script: string;
  income: number;
}

export interface CheckMark {
  item: string;
  component: "Stat" | "Host" | "Aug";
  done: boolean;
  target?: string | number;
}
