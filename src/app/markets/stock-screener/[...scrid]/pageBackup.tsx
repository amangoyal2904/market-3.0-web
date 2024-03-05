import useScreenerNav from "./useScreenerNav";
import useScreenerTab from "./useScreenerTab";
import StocksScreener from "./client";
import useScreenerTable from "./useScreenerTable";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { Metadata } from "next";
import { getSelectedFilter } from "@/utils/utility";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Stock Screener !!",
  description:
    "Share Market Today | Share Market Live updates: Get all the Latest Share Market News and Updates on The Economic Times. Share Market Live Charts, News, Analysis, IPO News and more.",
};

const ScreenerIneerpage = async ({ params, searchParams }: any) => {
  const headersList = headers();
  const referer = headersList.get("referer");

  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
  const filter = !!intFilter ? [intFilter] : [];

  const scrParams = await params.scrid;
  const scridValue = scrParams.find((item: any) => item.startsWith("scrid-"));
  const scrid = scridValue ? scridValue.split("-")[1] : "";
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];
  const { l3Nav, metaData } = await useScreenerNav({
    scrid,
  });
  const { tabData, activeViewId } = await useScreenerTab();

  const {
    tableHeaderData,
    tableData,
    screenerDetail,
    pageSummary,
    allowSortFields,
    payload,
  } = await useScreenerTable({
    scrid,
    sort,
    pagesize,
    pageno,
    activeViewId,
  });

  const selectedFilter = await getSelectedFilter(intFilter);

  return (
    <>
      {referer}
      <hr />
      {JSON.stringify(headersList, null, 2)}
      <StocksScreener
        l3Nav={l3Nav}
        metaData={metaData[0]}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        screenerDetail={screenerDetail}
        pageSummary={pageSummary}
        allowSortFields={allowSortFields}
        selectedFilter={selectedFilter}
        tableConfig={tableConfig["stocksScreener"]}
        tabConfig={tabConfig["stocksScreener"]}
        scrid={scrid}
        payload={payload}
      />
    </>
  );
};

export default ScreenerIneerpage;
