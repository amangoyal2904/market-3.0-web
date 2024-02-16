import APIS_CONFIG from "../../../network/api_config.json";
import styles from "../Marketstats.module.scss";
import MarketTabs from "@/components/MarketTabs";
import MarketTable from "@/components/MarketTable";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import MarketStatsNav from "@/components/MarketStatsNav";

const fetchTabsData = async (statstype: string) => {
  const apiUrl = `${APIS_CONFIG?.watchListTab["development"]}?statstype=${statstype}`;
  const data = await fetch(apiUrl, {
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

const fetchTableData = async (viewId: any) => {
  const apiUrl = (APIS_CONFIG as any)?.marketStatsIntraday["development"];
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      viewId: viewId,
      apiType: "gainers",
      duration: "1M",
      filterType: "index",
      filterValue: [2369],
      sort: [{ field: "R1MonthReturn", order: "DESC" }],
      pagesize: 100,
      pageno: 1,
    }),
  });
  const res = await data.json();
  //console.log("tabledata", res);
  return res.dataList ? res.dataList : res;
};

const Intraday = async () => {
  const leftNavApi = (APIS_CONFIG as any)["MARKET_STATS_NAV"][APP_ENV];
  const leftNavPromise = await service.get({
    url: leftNavApi,
    params: {},
  });
  const leftNavResult = await leftNavPromise?.json();

  const tabData = await fetchTabsData("gainers");
  let activeViewId = tabData[0].viewId;
  let tableData = await fetchTableData(activeViewId);
  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  return (
    <>
      <h1 className="heading">Top Gainers</h1>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={leftNavResult} />
        </aside>
        <div className={styles.rhs}>
          <MarketTabs
            data={tabData}
            activeViewId={activeViewId}
            showAddStock={false}
            showEditStock={false}
          />
          <MarketTable data={tableData} tableHeaders={tableHeaderData} />
        </div>
      </div>
    </>
  );
};

export default Intraday;
