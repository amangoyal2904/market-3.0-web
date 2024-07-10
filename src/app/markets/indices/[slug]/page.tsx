import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import IndicesDetailsClient from "./clients";
import tabConfig from "@/utils/tabConfig.json";
import tableConfig from "@/utils/tableConfig.json";
import { cookies, headers } from "next/headers";
import {
  fetchSelectedIndex,
  fnGenerateMetaData,
  getIndicesFaqs,
  getIndicesNews,
  getIndicesOverview,
  getIndicesTechnicals,
  getMarketsLiveBlog,
  getOtherIndices,
  getPeerIndices,
} from "@/utils/utility";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import BreadCrumb from "@/components/BreadCrumb";
import TextBottom from "@/components/TextBottom";
import dynamic from "next/dynamic";
import IndicesQuickLinks from "@/components/IndicesDetails/IndicesQuickLinks";
import { Fragment } from "react";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

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
  const indexFilterData = await fetchSelectedIndex(params.slug);
  const pageUrl = headersList.get("x-url") || "";
  const overviewData = await getIndicesOverview(indexFilterData.assetId);
  let pageTitle, pageDesc, pageKeywords;
  if (indexFilterData.assetId == 2369) {
    pageTitle = `Nifty 50 Live | NSE Nifty 50 Index Today - S&P CNX Nifty`;
    pageDesc = `Nifty 50 Today | Nifty 50 Live Updates- Nifty 50 Index, S&P CNX Nifty. Find today's trend for Nifty 50 Companies, News, Target Price, Stock Price, Stock Analysis`;
    pageKeywords = `Nifty 50,Nifty,Nifty Today,Nifty Live,Nifty 50 Today,Nifty 50 Live,Nifty 50 Index`;
  } else if (indexFilterData.assetId == 2365) {
    pageTitle = `Sensex Live updates: Sensex ${overviewData.netChange < 0 ? "down" : "up"} by ${overviewData.netChange} - Why sensex is ${overviewData.netChange < 0 ? "falling" : "rising"} today?`;
    pageDesc = `Sensex live news on The Economic Times. Find Why Sensex is ${overviewData.netChange < 0 ? "falling" : "rising"} today? Reasons for Sensex ${overviewData.netChange < 0 ? "fall" : "rise"} today. Latest Sensex Analysis, News and more - ETMarkets`;
    pageKeywords = `Sensex,Sensex Live,Sensex Today,BSE Sensex,Sensex Index,BSE Sensex Today,BSE Sensex Live,Sensex Live Updates`;
  } else {
    pageTitle = `${indexFilterData.assetName} Live | NSE ${indexFilterData.assetName} Index Today - S&P CNX ${indexFilterData.assetName}`;
    pageDesc = `${indexFilterData.assetName} Today | ${indexFilterData.assetName} Live Updates- ${indexFilterData.assetName} Index, S&P CNX NSE. Find today's trend for ${indexFilterData.assetName} Companies, News, Target Price, Stock Price, Stock Analysis`;
    pageKeywords = `${indexFilterData.assetName}, ${indexFilterData.assetName} Today, ${indexFilterData.assetName} Live, ${indexFilterData.assetName} Index`;
  }

  const meta = {
    title: pageTitle,
    desc: pageDesc,
    keywords: pageKeywords,
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
  const indexFilterData = await fetchSelectedIndex(params.slug);
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

  const { liveblog } = await getMarketsLiveBlog();

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
    <Fragment key="indices">
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
        liveblog={liveblog}
        faq={faqData}
      />
      <TextBottom indicesName={overviewData?.assetName} />
      <IndicesQuickLinks />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: overviewData?.assetName, redirectUrl: "" }]}
      />
      <PageRefresh refreshTime={180000} />
    </Fragment>
  );
};

export { generateMetadata, Indices as default };
