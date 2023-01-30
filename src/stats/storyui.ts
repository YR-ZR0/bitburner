/**
 * storyui prints out a nice summary of how far you are through the milestones
 * @module
 */
import { CheckMark } from "../../CustomTypes";
import { NS, Player } from "@ns";
// Total steps needed to be ready to ascend
const maxProgress = 6;
const storyHosts = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
const markers: CheckMark[] = [];

function additem(item: CheckMark) {
  const index = markers.findIndex((x) => x.item == item.item);
  if (index === -1) {
    markers.push(item);
  } else {
    console.log("item exists");
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
  if (moneyCurrent >= 100000000000) {
    additem({ item: "Money met", done: true, component: "Stat" });
  } else {
    additem({ item: "Money met", done: false, component: "Stat" });
  }
  const skillCurrent: number = stats.skills.hacking;
  if (skillCurrent >= 2500) {
    additem({ item: "Skill met", done: true, component: "Stat" });
  } else {
    additem({ item: "Skill met", done: false, component: "Stat" });
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
  cat.forEach((cata) => {
    ns.tprintf("%s Checks", cata);
    markers
      .filter((x) => x.component == cata)
      .map((x) => {
        ns.tprintf("%s %s", x.item, x.done);
      });
    ns.tprintf("%s", "\n");
  });
  ns.tprintf("%s", ns.nFormat(progress / maxProgress, "(0.00)%"));
}

export async function main(ns: NS) {
  hostAssess(ns);
  statAssess(ns);
  genUI(ns);
}
