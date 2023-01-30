import { Office } from "./../../NetscriptDefinitions.d";
import { Division, NS } from "@ns";

type DivisionMeta = {
  name: string;
  city: string;
  OfficeData: Office;
};

const regionals: DivisionMeta[] = [];

function Optimise(ns: NS) {
  regionals.forEach((office) => {
    ns.tprint(
      office.OfficeData.avgEne,
      office.OfficeData.avgHap,
      office.OfficeData.avgMor
    );
  });
}

export async function main(ns: NS) {
  const divisions = ns.corporation.getCorporation().divisions;
  divisions.forEach((industry: Division) => {
    for (const i in industry.cities) {
      const regional = ns.corporation.getOffice(
        industry.name,
        industry.cities[i]
      );
      const DivisionMeta = {
        name: industry.name,
        city: i,
        OfficeData: regional,
      };
      regionals.push(DivisionMeta);
    }
  });
  Optimise(ns, regionals);
}
