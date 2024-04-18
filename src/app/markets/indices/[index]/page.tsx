import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import IndicesClient from "../clients";
import tabConfig from "@/utils/tabConfig.json";
import tableConfig from "@/utils/tableConfig.json";
import { cookies, headers } from "next/headers";
import {
  fetchSelectedFilter,
  fnGenerateMetaData,
  getIndicesNews,
  getIndicesOverview,
  getIndicesTechnicals,
  getOtherIndices,
  getPeerIndices,
} from "@/utils/utility";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";

async function fetchData(indexId: number) {
  return Promise.all([
    getIndicesOverview(indexId),
    getIndicesTechnicals(indexId),
    getPeerIndices(indexId),
    getOtherIndices(indexId),
  ]);
}

async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: `${niftyFilterData.name} Live | NSE ${niftyFilterData.name} Index Today - S&P CNX ${niftyFilterData.name}`,
    desc: `${niftyFilterData.name} Today | ${niftyFilterData.name} Live Updates- ${niftyFilterData.name} Index, S&P CNX NSE. Find today's trend for ${niftyFilterData.name} Companies, News, Target Price, Stock Price, Stock Analysis`,
    keywords: `${niftyFilterData.name}, ${niftyFilterData.name} Today, ${niftyFilterData.name} Live, ${niftyFilterData.name} Index`,
    pathname: pageUrl,
    index: niftyFilterData.indexId == 0 ? false : true,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async ({ params }: any) => {
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;

  const niftyFilterData = await fetchSelectedFilter(params.index);
  if (niftyFilterData.indexId == 0) {
    notFound();
  }
  const [overviewData, technicalsData, peersData, othersData] = await fetchData(
    niftyFilterData.indexId,
  );

  const indicesNews = await getIndicesNews(
    overviewData.assetId,
    overviewData.assetExchangeId,
  );

  const { tabData, activeViewId } = await getCustomViewsTab({
    L3NavSubItem: "watchlist",
    ssoid,
  });
  const pagesize = 13;
  const pageno = 1;
  const sort: any = [];

  const bodyParams = {
    viewId: activeViewId,
    apiType: "index-constituents",
    filterValue: [niftyFilterData.indexId],
    filterType: "index",
    sectorId: null,
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(bodyParams, true, ssoid, "MARKETSTATS_INTRADAY");

  return (
    <IndicesClient
      overview={overviewData}
      technicals={technicalsData}
      peers={peersData}
      others={othersData}
      tabData={tabData}
      activeViewId={activeViewId}
      tableHeaderData={tableHeaderData}
      tableData={tableData}
      pageSummary={pageSummary}
      tableConfig={tableConfig["indicesConstituents"]}
      tabConfig={tabConfig["indicesConstituents"]}
      payload={payload}
      ssoid={ssoid}
      indicesNews={indicesNews}
      selectedFilter={niftyFilterData}
    />
  );
};

export { generateMetadata, Indices as default };
