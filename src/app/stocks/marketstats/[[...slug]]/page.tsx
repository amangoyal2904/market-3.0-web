import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { cookies, headers } from "next/headers";
import {
  fetchSelectedFilter,
  fnGenerateMetaData,
  generateIntradayDurations,
  getSearchParams,
} from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import {
  getAllShortUrls,
  getMarketStatsNav,
  getShortUrlMapping,
} from "@/utils/marketstats";
import {
  getBreadcrumbObj,
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import MarketStats from "../client";
import BreadCrumb from "@/components/BreadCrumb";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { shortUrl, pageData } = await getShortUrlMapping(pageUrl);
  let L3NavSubItem, duration, timespan, intFilter, actualUrl;
  if (shortUrl) {
    actualUrl = pageData?.longURL;
    const requestParams = getSearchParams(actualUrl);
    L3NavSubItem = pageData?.requestParams?.type;
    duration = requestParams?.duration;
    timespan = requestParams?.timespan;
    intFilter =
      requestParams.filter !== undefined && !isNaN(Number(requestParams.filter))
        ? parseInt(requestParams.filter)
        : requestParams.filter !== undefined
          ? requestParams.filter
          : 0;
  } else {
    L3NavSubItem = searchParams?.type?.toLowerCase();
    duration = searchParams.duration
      ? searchParams.duration.toUpperCase()
      : null;
    timespan = searchParams.timespan
      ? searchParams.timespan.toUpperCase()
      : null;
    intFilter =
      searchParams.filter !== undefined && !isNaN(Number(searchParams.filter))
        ? parseInt(searchParams.filter)
        : searchParams.filter !== undefined
          ? searchParams.filter
          : 0;
    actualUrl = pageUrl;
  }

  const { metaData } = await getMarketStatsNav({
    L3NavSubItem,
    intFilter,
    duration,
  });

  const seo_title = !!shortUrl ? pageData?.seo_title : metaData[0]?.title;
  const seo_desc = !!shortUrl ? pageData?.seo_desc : metaData[0]?.desc;
  const seo_keywords = !!shortUrl
    ? pageData?.keywords
    : `et, etmarkets, economictimes, ${L3NavSubItem}, ${duration}`;
  const meta = {
    title: seo_title,
    desc: seo_desc,
    keywords: seo_keywords,
    pathname: pageUrl,
    index: shortUrl,
  };
  return fnGenerateMetaData(meta);
}

const Intraday = async ({ searchParams }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { shortUrl, pageData } = await getShortUrlMapping(pageUrl);
  let L3NavMenuItem, L3NavSubItem, duration, timespan, intFilter, actualUrl;
  if (shortUrl) {
    actualUrl = pageData?.longURL;
    const requestParams = getSearchParams(actualUrl);
    L3NavMenuItem = pageData?.l3NavMenuItem;
    L3NavSubItem = requestParams?.type;
    duration = requestParams?.duration;
    timespan = requestParams?.timespan;
    intFilter =
      requestParams.filter !== undefined && !isNaN(Number(requestParams.filter))
        ? parseInt(requestParams.filter)
        : requestParams.filter !== undefined
          ? requestParams.filter
          : 0;
  } else {
    L3NavMenuItem = "intraday";
    L3NavSubItem = searchParams?.type?.toLowerCase();
    duration = searchParams.duration
      ? searchParams.duration.toUpperCase()
      : null;
    timespan = searchParams.timespan
      ? searchParams.timespan.toUpperCase()
      : null;
    intFilter =
      searchParams.filter !== undefined && !isNaN(Number(searchParams.filter))
        ? parseInt(searchParams.filter)
        : searchParams.filter !== undefined
          ? searchParams.filter
          : 0;
    actualUrl = pageUrl;
  }

  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
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
    ...(duration ? { duration } : {}), // Conditional inclusion of duration
    ...(timespan ? { timespan } : {}), // Conditional inclusion of timespan
    filterValue: filter,
    filterType:
      filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(bodyParams, true, ssoid, "MARKETSTATS_INTRADAY");

  const selectedFilter = await fetchSelectedFilter(intFilter);

  const title = !!shortUrl ? pageData?.heading : metaData[0]?.title;
  const desc = !!shortUrl ? pageData?.desc : metaData[0]?.desc;
  const meta = {
    title: title,
    desc: desc,
  };

  const shortUrlMapping = await getAllShortUrls();
  const intradayDurationOptions = await generateIntradayDurations(L3NavSubItem);

  const breadCrumbObj = getBreadcrumbObj(
    l3Nav,
    L3NavMenuItem,
    L3NavSubItem,
    false,
    title,
  );

  breadCrumbObj.push({ label: selectedFilter?.name, redirectUrl: "" });

  return (
    <>
      <MarketStats
        l3Nav={l3Nav}
        metaData={meta}
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
        l3NavMenuItem={L3NavMenuItem}
        l3NavSubItem={L3NavSubItem}
        actualUrl={actualUrl}
        shortUrlMapping={shortUrlMapping}
        intradayDurationOptions={intradayDurationOptions}
      />
      <BreadCrumb pagePath={pageUrl} pageName={breadCrumbObj} />
      <br/>
      <DfpAds adInfo={AdInfo.dfp.btfAd}/>
    </>
  );
};

export default Intraday;
