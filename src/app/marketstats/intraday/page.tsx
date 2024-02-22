import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import Marketstats from "../marketstats";
import useIntradayTable from "../useIntradayTable";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intraday",
  description:
    "Share Market Today | Share Market Live updates: Get all the Latest Share Market News and Updates on The Economic Times. Share Market Live Charts, News, Analysis, IPO News and more.",
};

const Intraday = async ({ searchParams }: any) => {
  const type = searchParams?.type;
  const duration = searchParams.duration ? searchParams.duration : "1D";
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
  const filter = !!intFilter ? [intFilter] : [];
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];
  const { l3Nav, metaData } = await useMarketStatsNav({
    type,
    intFilter,
    duration,
  });

  const { tabData, activeViewId } = await useTechnicalTab({ type });

  const { tableHeaderData, tableData, ivKey } = await useIntradayTable({
    activeViewId,
    type,
    duration,
    filter,
    sort,
    pagesize,
    pageno,
  });

  return (
    <>
      <Marketstats
        l3Nav={l3Nav}
        metaData={metaData[0]}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        ivKey={ivKey}
        tableConfig={tableConfig["marketStatsIntrday"]}
        tabConfig={tabConfig["marketStatsIntrday"]}
      />
    </>
  );
};

export default Intraday;
