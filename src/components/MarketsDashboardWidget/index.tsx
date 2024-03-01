import styles from "./DashboardWidget.module.scss";
import { fetchTableData, fetchTabsData } from "./ApiCalls";
import MarketDashBoard from "./MarketDashBoard";

const MarketsDashboardWidget = async ({ searchParams }: any) => {
  const tabsData = await fetchTabsData();
  const tabs =
    (tabsData && tabsData.nav && tabsData.nav[0] && tabsData.nav[0].sub_nav) ||
    [];

  let activeViewId = tabs[0]?.viewId;
  let type = tabs[0]?.type;
  let duration = "1M";
  let tableData = await fetchTableData(type, duration, 2369, activeViewId);

  return (
    <div className={styles.dashboardWrapper}>
      <h1 className="heading">Markets Dashboards</h1>
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
