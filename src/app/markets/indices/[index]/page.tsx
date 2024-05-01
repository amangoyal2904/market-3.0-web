import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import IndicesDetailsClient from "./clients";
import tabConfig from "@/utils/tabConfig.json";
import tableConfig from "@/utils/tableConfig.json";
import { cookies, headers } from "next/headers";
import {
  fetchSelectedFilter,
  fetchSelectedIndex,
  fnGenerateMetaData,
  getIndicesFaqs,
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
import BreadCrumb from "@/components/BreadCrumb";

async function fetchData(assetId: number) {
  return Promise.all([
    getIndicesOverview(assetId),
    getIndicesTechnicals(assetId),
    getOtherIndices(assetId),
    getIndicesFaqs(assetId),
  ]);
}

async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const indexFilterData = await fetchSelectedIndex(params.index);
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: `${indexFilterData.assetName} Live | NSE ${indexFilterData.assetName} Index Today - S&P CNX ${indexFilterData.assetName}`,
    desc: `${indexFilterData.assetName} Today | ${indexFilterData.assetName} Live Updates- ${indexFilterData.assetName} Index, S&P CNX NSE. Find today's trend for ${indexFilterData.assetName} Companies, News, Target Price, Stock Price, Stock Analysis`,
    keywords: `${indexFilterData.assetName}, ${indexFilterData.assetName} Today, ${indexFilterData.assetName} Live, ${indexFilterData.assetName} Index`,
    pathname: pageUrl,
    index:
      indexFilterData.assetId == 0 || indexFilterData.assetId == null
        ? false
        : true,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const indexFilterData = await fetchSelectedIndex(params.index);
  if (indexFilterData.assetId == 0 || indexFilterData.assetId == null) {
    notFound();
  }
  const [overviewData, technicalsData, othersData, faqData] = await fetchData(
    indexFilterData.assetId,
  );

  const peersData = await getPeerIndices(
    overviewData.assetId,
    overviewData.assetExchangeId,
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
    filterValue: [indexFilterData.assetId],
    filterType: "index",
    sectorId: null,
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(bodyParams, true, ssoid, "MARKETSTATS_INTRADAY");

  return (
    <>
      <IndicesDetailsClient
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
        faq={faqData}
        selectedFilter={niftyFilterData}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: overviewData?.assetName, redirectUrl: "" }]}
      />
    </>
  );
};

export { generateMetadata, Indices as default };
