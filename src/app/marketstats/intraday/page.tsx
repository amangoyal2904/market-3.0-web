import APIS_CONFIG from "../../../network/api_config.json";
import styles from "../Marketstats.module.scss";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketStatsIntraDay from "../../../containers/IntraDay/index";

const fetchTabsData = async (statstype: string) => {
  const apiUrl = `${APIS_CONFIG?.watchListTab["development"]}?statstype=${statstype}`;
  const data = await fetch(apiUrl, {
    cache: "no-store",
  });
  const res = await data.json();
  //console.log('res',res)
  return res;
};

const fetchTableData = async (
  type: any,
  duration: any,
  filter: any,
  activeViewId: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.marketStatsIntraday["development"];
  const bodyParams = {
    viewId: activeViewId,
    apiType: type,
    duration: duration,
    filterType: "index",
    filterValue: [parseFloat(filter)],
    sort: [{ field: "R1MonthReturn", order: "DESC" }],
    pagesize: 100,
    pageno: 1,
  };
  //console.log(bodyParams, apiUrl)
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyParams),
  });
  //console.log("data", bodyParams);
  const res = await data.json();

  return res.dataList ? res.dataList : res;
};

const Intraday = async ({ searchParams }: any) => {
  const type = searchParams?.type;
  const duration = searchParams?.duration;
  const filter = searchParams?.filter;
  const leftNavApi = (APIS_CONFIG as any)["MARKET_STATS_NAV"][APP_ENV];
  console.log("Left Nav APi", leftNavApi);
  const leftNavPromise = await service.get({
    url: leftNavApi + "?v=1",
    params: {},
  });
  const leftNavResult = await leftNavPromise?.json();
  const tabData = await fetchTabsData(type);
  let activeViewId = tabData[0].viewId;
  let tableData = await fetchTableData(type, duration, filter, activeViewId);
  const tableHeaderData =
    tableData && tableData.length && tableData[0] && tableData[0]?.data
      ? tableData[0]?.data
      : [];
  const TabsData: any = {
    data: tabData,
    activeViewId: activeViewId,
    showAddStock: false,
    showEditStock: false,
    showNiftyFilter: true,
    showDayFilter: true,
  };
  const TableData: any = {
    data: tableData,
    tableHeaders: tableHeaderData,
  };
  return (
    <>
      <h1 className="heading">Top Gainers</h1>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={leftNavResult} />
        </aside>
        <div className={styles.rhs}>
          <MarketStatsIntraDay tabsData={TabsData} tableData={TableData} />
        </div>
      </div>
    </>
  );
};

export default Intraday;
