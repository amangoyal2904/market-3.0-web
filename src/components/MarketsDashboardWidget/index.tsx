import styles from "./DashboardWidget.module.scss";
import MarketDashBoard from "./MarketDashBoard";
import {
  getCustomViewTable,
  getIntradayViewsTab,
} from "@/utils/customViewAndTables";
import { cookies } from "next/headers";
import { fetchSelectedFilter } from "@/utils/utility";

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

  return (
    <div className={styles.dashboardWrapper}>
      <h1 className="heading marginhead">Markets Dashboards</h1>
      <MarketDashBoard
        tabsData={tabData}
        tableData={tableData}
        tableHeaderData={tableHeaderData}
        activeViewId={activeViewId}
        selectedFilter={selectedFilter}
        bodyparams={payload}
      />
    </div>
  );
};

export default MarketsDashboardWidget;
