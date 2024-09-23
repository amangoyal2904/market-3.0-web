import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import SectorsDetailsClient from "./clients";
import tabConfig from "@/utils/tabConfig.json";
import tableConfig from "@/utils/tableConfig.json";
import { cookies, headers } from "next/headers";

import {
  fetchSectors,
  fetchSelectedSectors,
  fnGenerateMetaData,
  getSectorFaqs,
  getSectorsOverview,
  getOtherSectors,
  getPeerSectors,
} from "@/utils/utility";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import BreadCrumb from "@/components/BreadCrumb";
import dynamic from "next/dynamic";
import { Fragment } from "react";
const PageRefresh = dynamic(() => import("@/components/PageRefresh"), {
  ssr: false,
});

async function fetchData(assetId: number) {
  return Promise.all([
    getSectorsOverview(assetId),
    getOtherSectors(assetId),
    getSectorFaqs(assetId),
  ]);
}

async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const indexFilterData = await fetchSelectedSectors(params.slug);
  const pageUrl = headersList.get("x-url") || "";
  const overviewData = await getSectorsOverview(indexFilterData.assetId);
  let pageTitle, pageDesc, pageKeywords;

  pageTitle = `${overviewData.assetName} Sector Stocks & Shares - ${overviewData.assetName} Stocks Listings in India`;
  pageDesc = `${overviewData.assetName} Sector Stocks: Check the list of all ${overviewData.assetName} sector stocks in India with trading volume, price, market cap etc. Make detailed analysis to invest in ${overviewData.assetName} sector stocks at The Economic Times`;
  pageKeywords = `${overviewData.assetName} stocks, ${overviewData.assetName}, ${overviewData.assetName} shares, ${overviewData.assetName} stocks & shares, ${overviewData.assetName} stocks in India`;

  const meta = {
    title: pageTitle,
    desc: pageDesc,
    keywords: pageKeywords,
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const IndividualSectors = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const indexFilterData = await fetchSelectedSectors(params.slug);
  const fetchSectorData = await fetchSectors();
  if (indexFilterData.assetId == 0 || indexFilterData.assetId == null) {
    notFound();
  }
  const [overviewData, othersData, faqData] = await fetchData(
    indexFilterData.assetId,
  );

  const peersData = await getPeerSectors(overviewData.assetId);

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
    filterType: null,
    sectorId: indexFilterData.assetId,
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(bodyParams, true, ssoid, "MARKETSTATS_INTRADAY");
  return (
    <Fragment key="Sectors">
      <SectorsDetailsClient
        overview={overviewData}
        peers={peersData}
        others={othersData}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        tableConfig={tableConfig["sectorsConstituents"]}
        tabConfig={tabConfig["sectorsConstituents"]}
        payload={payload}
        ssoid={ssoid}
        sectorsListData={fetchSectorData}
        faq={faqData}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[
          {
            label: "Sectors",
            redirectUrl: "/stocks/sectors",
          },
          { label: overviewData?.assetName, redirectUrl: "" },
        ]}
      />
      <PageRefresh refreshTime={180000} />
    </Fragment>
  );
};

export { generateMetadata, IndividualSectors as default };
