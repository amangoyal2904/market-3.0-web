import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import Marketstats from "../marketstats";
import useIntradayTable from "../useIntradayTable";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { Metadata } from "next";
import useSelectedFilter from "../useSelectedFilter";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Intraday",
  description:
    "Share Market Today | Share Market Live updates: Get all the Latest Share Market News and Updates on The Economic Times. Share Market Live Charts, News, Analysis, IPO News and more.",
};

const Intraday = async ({ searchParams }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const type = searchParams?.type;
  const duration = searchParams.duration
    ? searchParams.duration.toUpperCase()
    : "1D";
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

  const { tabData, activeViewId } = await useTechnicalTab({
    type,
    isprimeuser,
    ssoid,
  });

  const { tableHeaderData, tableData, ivKey, payload } = await useIntradayTable(
    {
      activeViewId,
      type,
      duration,
      filter,
      sort,
      pagesize,
      pageno,
      isprimeuser,
      ssoid,
    },
  );

  const selectedFilter = await useSelectedFilter(intFilter);

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
        selectedFilter={selectedFilter}
        isTechnical={false}
        technicalCategory={null}
        tableConfig={tableConfig["marketStatsIntrday"]}
        tabConfig={tabConfig["marketStatsIntrday"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
      />
    </>
  );
};

export default Intraday;
