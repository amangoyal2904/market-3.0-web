import styles from "./DashboardWidget.module.scss";
import { fetchTableData, fetchTabsData } from "./ApiCalls";
import MarketDashBoard from "./MarketDashBoard";
import { getCustomViewsTab } from "@/utils/customViewAndTables";

const MarketsDashboardWidget = async ({ searchParams }: any) => {
  const tabsData = await fetchTabsData({ duration: "1D", intFilter: 2369 });
  const tabs =
    (tabsData && tabsData.nav && tabsData.nav[0] && tabsData.nav[0].sub_nav) ||
    [];
  let type = tabs[0]?.type;
  const { activeViewId } = await getCustomViewsTab(type);

  let duration = "1D";
  let tableData = await fetchTableData(type, duration, 2369, activeViewId);

  return (
    <div className={styles.dashboardWrapper}>
      <h1 className="heading">
        Markets Dashboards
        <span className={`eticon_caret_right headingIcon`} />
      </h1>
      <MarketDashBoard
        tabsData={tabs}
        tableData={tableData}
        activeViewId={activeViewId}
        type={type}
        linkClass={styles.seeAll}
      />
    </div>
  );
};

export default MarketsDashboardWidget;
