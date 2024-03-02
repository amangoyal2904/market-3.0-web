import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { cookies } from "next/headers";
import { fnGenerateMetaData, getSelectedFilter } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { getMarketStatsNav } from "@/utils/marketstats";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import MarketStats from "../client";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const L3NavSubItem = searchParams?.type?.toLowerCase();
  const duration = searchParams.duration
    ? searchParams.duration.toUpperCase()
    : "1D";
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;

  const { metaData } = await getMarketStatsNav({
    L3NavSubItem,
    intFilter,
    duration,
  });

  const meta = {
    title: metaData[0]?.title,
    desc: metaData[0]?.desc,
    keywords: `et, etmarkets, economictimes, ${L3NavSubItem}, ${duration}`,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const Intraday = async ({ searchParams }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const L3NavMenuItem = "intraday";
  const L3NavSubItem = searchParams?.type?.toLowerCase();
  const duration = searchParams.duration
    ? searchParams.duration.toUpperCase()
    : "1D";
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
  const filter = !!intFilter ? [intFilter] : [];
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];

  const { l3Nav, metaData } = await getMarketStatsNav({
    L3NavSubItem,
    intFilter,
    duration,
  });

  const { tabData, activeViewId } = await getCustomViewsTab({
    L3NavSubItem,
    ssoid,
  });

  const bodyParams = {
    viewId: activeViewId,
    apiType: L3NavSubItem,
    duration,
    filterValue: filter,
    filterType: !!filter && filter.length ? "index" : null,
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(
      bodyParams,
      isprimeuser,
      ssoid,
      "marketStatsIntraday",
    );

  const selectedFilter = await getSelectedFilter(intFilter);

  return (
    <>
      <MarketStats
        l3Nav={l3Nav}
        metaData={metaData[0]}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        selectedFilter={selectedFilter}
        isTechnical={false}
        technicalCategory={null}
        tableConfig={tableConfig["marketStatsIntrday"]}
        tabConfig={tabConfig["marketStatsIntrday"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
        l3NavMenuItem={L3NavMenuItem}
        l3NavSubItem={L3NavSubItem}
      />
    </>
  );
};

export default Intraday;
