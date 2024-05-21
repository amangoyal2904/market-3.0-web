import MarketDashBoard from "./MarketDashBoard";
import {
  getCustomViewTable,
  getIntradayViewsTab,
} from "@/utils/customViewAndTables";
import { cookies } from "next/headers";
import {
  fetchSelectedFilter,
  generateIntradayDurations,
} from "@/utils/utility";
import { getAllShortUrls, getShortUrlMapping } from "@/utils/marketstats";

const MarketsDashboardWidget = async () => {
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const intFilter = 2369;
  const filter = !!intFilter ? [intFilter] : [];
  const pagesize = 10;
  const pageno = 1;
  const sort: any = [];
  const duration = "1D";

  const { tabData, activeViewId } = await getIntradayViewsTab();

  const bodyParams = {
    viewId: activeViewId,
    apiType: "gainers",
    ...(duration ? { duration } : {}), // Conditional inclusion of duration
    filterValue: filter,
    filterType:
      filter == undefined || !isNaN(Number(filter)) ? "index" : "marketcap",
    sort,
    pagesize,
    pageno,
  };

  const { tableHeaderData, tableData, payload } = await getCustomViewTable(
    bodyParams,
    true,
    ssoid,
    "MARKETSTATS_INTRADAY",
  );

  const selectedFilter = await fetchSelectedFilter(intFilter);
  const intradayDurationOptions = await generateIntradayDurations("gainers");
  const pageUrl = "/stocks/marketstats?type=gainers&duration=1D&filter=2371";
  const shortUrlMapping = await getAllShortUrls();
  const isExist: any = shortUrlMapping?.find(
    (item: any) => item.longURL == pageUrl,
  );
  const updatedUrl = isExist ? isExist.shortUrl : pageUrl;

  return (
    <div className="sectionWrapper">
      <h1 className="heading">Markets Dashboard</h1>
      <MarketDashBoard
        tabsData={tabData}
        tableData={tableData}
        tableHeaderData={tableHeaderData}
        activeViewId={activeViewId}
        selectedFilter={selectedFilter}
        bodyparams={payload}
        durationOptions={intradayDurationOptions}
        shortUrlMapping={shortUrlMapping}
        shortUrl={updatedUrl}
      />
    </div>
  );
};

export default MarketsDashboardWidget;
