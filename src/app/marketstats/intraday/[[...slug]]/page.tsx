import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { cookies, headers } from "next/headers";
import { fnGenerateMetaData, getSelectedFilter } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { getMarketStatsNav, getShortUrlMapping } from "@/utils/marketstats";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import MarketStats from "../../client";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { shortUrl, pageData } = await getShortUrlMapping("intraday", pageUrl);
  let L3NavSubItem, duration, intFilter, actualUrl;
  if (shortUrl) {
    L3NavSubItem = pageData?.requestParams?.type;
    duration = pageData?.requestParams?.duration;
    intFilter = pageData?.requestParams.filter
      ? parseInt(pageData.requestParams.filter)
      : 0;
    actualUrl = pageData?.longURL;
  } else {
    L3NavSubItem = searchParams?.type?.toLowerCase();
    duration = searchParams.duration
      ? searchParams.duration.toUpperCase()
      : "1D";
    intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
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
  const { shortUrl, pageData } = await getShortUrlMapping("intraday", pageUrl);
  console.log({ shortUrl });
  console.log({ pageData });
  let L3NavMenuItem, L3NavSubItem, duration, intFilter, actualUrl;
  if (shortUrl) {
    L3NavMenuItem = pageData?.l3NavMenuItem;
    L3NavSubItem = pageData?.requestParams?.type;
    duration = pageData?.requestParams?.duration;
    intFilter = pageData?.requestParams.filter
      ? parseInt(pageData.requestParams.filter)
      : 0;
    actualUrl = pageData?.longURL;
  } else {
    L3NavMenuItem = "intraday";
    L3NavSubItem = searchParams?.type?.toLowerCase();
    duration = searchParams.duration
      ? searchParams.duration.toUpperCase()
      : "1D";
    intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
    actualUrl = pageUrl;
  }

  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
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

  const title = !!shortUrl ? pageData?.heading : metaData[0]?.title;
  const desc = !!shortUrl ? pageData?.desc : metaData[0]?.desc;
  const meta = {
    title: title,
    desc: desc,
  };

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
        isprimeuser={isprimeuser}
        l3NavMenuItem={L3NavMenuItem}
        l3NavSubItem={L3NavSubItem}
        actualUrl={actualUrl}
      />
    </>
  );
};

export default Intraday;
