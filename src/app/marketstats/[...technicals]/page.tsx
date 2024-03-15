import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { cookies, headers } from "next/headers";
import {
  fetchSelectedFilter,
  fnGenerateMetaData,
  getSearchParams,
} from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import {
  getAllShortUrls,
  getMarketStatsNav,
  getShortUrlMapping,
  getTechincalOperands,
} from "@/utils/marketstats";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import MarketStats from "../client";

export async function generateMetadata(
  { searchParams, params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { shortUrl, pageData } = await getShortUrlMapping(pageUrl);
  let L3NavMenuItem,
    L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
    intFilter,
    actualUrl;
  if (shortUrl) {
    actualUrl = pageData?.longURL;
    const requestParams = getSearchParams(actualUrl);
    L3NavMenuItem = pageData?.l3NavMenuItem;
    L3NavSubItem = requestParams?.type;
    firstOperand = requestParams?.firstoperand;
    operationType = requestParams?.operationtype;
    secondOperand = requestParams?.secondoperand;
    intFilter = requestParams.filter ? parseInt(requestParams.filter) : 0;
  } else {
    L3NavMenuItem = params.technicals[0];
    L3NavSubItem = searchParams?.type?.toLowerCase();
    firstOperand = searchParams?.firstoperand;
    operationType = searchParams?.operationtype;
    secondOperand = searchParams?.secondoperand;
    intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
    actualUrl = pageUrl;
  }

  const { metaData } = await getMarketStatsNav({ L3NavSubItem, intFilter });

  const technicalCategory = await getTechincalOperands(
    L3NavMenuItem,
    L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
  );
  const seo_title = !!shortUrl ? pageData?.seo_title : metaData[0]?.title;
  const seo_desc = !!shortUrl
    ? pageData?.seo_desc
    : `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;
  const seo_keywords = !!shortUrl
    ? pageData?.keywords
    : `et, etmarkets, economictimes, ${L3NavMenuItem}, ${L3NavSubItem}, ${firstOperand}, ${operationType}, ${secondOperand}`;
  const meta = {
    title: seo_title,
    desc: seo_desc,
    keywords: seo_keywords,
    pathname: pageUrl,
    index: shortUrl,
  };
  return fnGenerateMetaData(meta);
}

const Technicals = async ({ params, searchParams }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const { shortUrl, pageData } = await getShortUrlMapping(pageUrl);
  let L3NavMenuItem,
    L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
    intFilter,
    actualUrl;
  if (shortUrl) {
    actualUrl = pageData?.longURL;
    const requestParams = getSearchParams(actualUrl);
    L3NavMenuItem = pageData?.l3NavMenuItem;
    L3NavSubItem = requestParams?.type?.toLowerCase();
    firstOperand = requestParams?.firstoperand;
    operationType = requestParams?.operationtype;
    secondOperand = requestParams?.secondoperand;
    intFilter = requestParams.filter ? parseInt(requestParams.filter) : 0;
  } else {
    L3NavMenuItem = params.technicals[0];
    L3NavSubItem = searchParams?.type?.toLowerCase();
    firstOperand = searchParams?.firstoperand;
    operationType = searchParams?.operationtype;
    secondOperand = searchParams?.secondoperand;
    intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
    actualUrl = pageUrl;
  }

  const cookieStore = cookies();
  const isprimeuser =
    cookieStore.get("isprimeuser") &&
    cookieStore.get("isprimeuser")?.value == "true"
      ? true
      : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const filter = !!intFilter ? [intFilter] : [];
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];

  const { l3Nav, metaData } = await getMarketStatsNav({
    L3NavSubItem,
    intFilter,
  });

  const { tabData, activeViewId } = await getCustomViewsTab({
    firstOperand,
    operationType,
    secondOperand,
    ssoid,
  });

  const bodyParams = {
    viewId: activeViewId,
    apiType: L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
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
      "MARKETSTATS_TECHNICALS",
    );

  const selectedFilter = await fetchSelectedFilter(intFilter);
  const technicalCategory = await getTechincalOperands(
    L3NavMenuItem,
    L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
  );

  const title = !!shortUrl ? pageData?.heading : metaData[0]?.title;
  const desc = !!shortUrl
    ? pageData?.desc
    : `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;

  const meta = {
    title: title,
    desc: desc,
  };

  const shortUrlMapping = await getAllShortUrls();

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
        isTechnical={true}
        technicalCategory={technicalCategory}
        tableConfig={tableConfig["marketStatsTechnical"]}
        tabConfig={tabConfig["marketStatsTechnical"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
        l3NavMenuItem={L3NavMenuItem}
        l3NavSubItem={L3NavSubItem}
        actualUrl={actualUrl}
        shortUrlMapping={shortUrlMapping}
      />
    </>
  );
};

export default Technicals;
