/**
 * storyui prints out a nice summary of how far you are through the milestones
 * @module
 */
import { CheckMark } from "../../types/CustomTypes";
import { NS, Player } from "@ns";
import { formatMoney } from "/common";
// Total steps needed to be ready to ascend
const maxProgress = 6;
const storyHosts = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
const markers: CheckMark[] = [];
const targetMoney = 100000000000;
const targetSkill = 2500;

function additem(item: CheckMark) {
  const index = markers.findIndex((x) => x.item == item.item);
  if (index === -1) {
    markers.push(item);
  }
}

function hostAssess(ns: NS) {
  storyHosts.forEach((host) => {
    const hostCheck = ns.getServer(host).backdoorInstalled;
    if (hostCheck) {
      additem({ item: host, done: true, component: "Host" });
    } else {
      additem({ item: host, done: false, component: "Host" });
    }
  });
}

function statAssess(ns: NS) {
  const stats: Player = ns.getPlayer();
  const moneyCurrent: number = stats.money;
  if (moneyCurrent >= targetMoney) {
    additem({
      item: "Money met",
      done: true,
      component: "Stat",
      target: formatMoney(ns, targetMoney),
    });
  } else {
    additem({
      item: "Money met",
      done: false,
      component: "Stat",
      target: formatMoney(ns, targetMoney),
    });
  }
  const skillCurrent: number = stats.skills.hacking;
  if (skillCurrent >= targetSkill) {
    additem({
      item: "Skill met",
      done: true,
      component: "Stat",
      target: targetSkill,
    });
  } else {
    additem({
      item: "Skill met",
      done: false,
      component: "Stat",
      target: targetSkill,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
function augCheck(ns: NS) {}

function genUI(ns: NS) {
  let progress = 0;
  const cat = markers
    .map((item) => item.component)
    .filter((value, index, self) => self.indexOf(value) === index);
  markers.forEach((thing: CheckMark) => {
    if (thing.done) {
      progress++;
    }
  });
  cat.forEach((category) => {
    ns.tprintf("%s Checks", category);
    markers
      .filter((x) => x.component == category)
      .map((x) => {
        ns.tprintf("%s %s %s", x.item, x.done, x?.target);
      });
    ns.tprintf("%s", "----");
  });
  ns.tprintf("Total: %s", ns.formatPercent(progress / maxProgress));
}

export async function main(ns: NS) {
  hostAssess(ns);
  statAssess(ns);
  genUI(ns);
}
