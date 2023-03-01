import { formatMoney } from "common";
import { CorporationInfo, NS } from "@ns";
import { Office } from "./../../NetscriptDefinitions.d";
interface Business {
  OfficeStats: Office[];
}

const regionals = new Map<string, Business>();
let corpInfo: CorporationInfo = {
  name: "",
  funds: 0,
  revenue: 0,
  expenses: 0,
  public: false,
  totalShares: 0,
  numShares: 0,
  shareSaleCooldown: 0,
  issuedShares: 0,
  sharePrice: 0,
  dividendRate: 0,
  dividendTax: 0,
  dividendEarnings: 0,
  state: "",
  divisions: [],
};

/** @param {NS} ns */
function optimiseOffices(ns: NS, regionals: Map<string, Business>) {
  regionals.forEach((industry, index) => {
    industry.OfficeStats.forEach((office) => {
      if (office.avgEne < 70) {
        ns.corporation.buyCoffee(index, office.loc);
      }
      if (office.avgHap < 70 || office.avgMor < 70) {
        ns.corporation.throwParty(index, office.loc, 100000);
      }
    });
  });
}

function gather(ns: NS) {
  corpInfo = ns.corporation.getCorporation();
  let dustData: Business = {
    OfficeStats: [],
  };
  corpInfo.divisions.forEach((industry) => {
    const divisionData = ns.corporation.getDivision(industry);
    divisionData.cities.forEach((City, index) => {
      const officeData = ns.corporation.getOffice(industry, City);
      const officeArr = [];
      officeArr.push(officeData);
      dustData = {
        OfficeStats: officeArr,
      };
    });
    regionals.set(industry, dustData);
  });
}

function render(ns: NS) {
  ns.clearLog();
  const CompanyRows = "%-15s | %-8s | %-8s | %-8s";
  ns.printf(CompanyRows, "Revenue", "Expend", "Funds", "Profit");
  ns.printf(
    CompanyRows,
    formatMoney(ns, corpInfo.revenue),
    formatMoney(ns, corpInfo.expenses),
    formatMoney(ns, corpInfo.funds),
    formatMoney(ns, corpInfo.revenue - corpInfo.expenses)
  );
  const BusinessRows = "%-15s | %-15s | %-8s | %-8s";
  ns.printf(BusinessRows, "Division", "Energy", "Morale", "Happiness");
  regionals.forEach((industry, index) => {
    industry.OfficeStats.forEach((office) => {
      ns.printf(
        BusinessRows,
        index,
        ns.formatNumber(office.avgEne),
        ns.formatNumber(office.avgMor),
        ns.formatNumber(office.avgHap)
      );
    });
  });
}

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    gather(ns);
    optimiseOffices(ns, regionals);
    render(ns);
    await ns.sleep(200);
  }
}
