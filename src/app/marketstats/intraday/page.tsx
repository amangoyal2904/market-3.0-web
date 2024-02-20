import APIS_CONFIG from "../../../network/api_config.json";
import styles from "../Marketstats.module.scss";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketStatsIntraDay from "../../../containers/IntraDay/index";

const fetchTabsData = async (statstype: string) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}?statstype=${statstype}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });

  return response?.json();
};

const fetchTableData = async (
  type: any,
  duration: any,
  filter: any,
  activeViewId: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.["marketStatsIntraday"][APP_ENV];
  const bodyParams: any = {
    viewId: activeViewId,
    apiType: type.toLowerCase(),
    duration: duration.toUpperCase(),
    filterValue: filter,
    sort: [],
  };

  if (!!filter && filter.length) {
    bodyParams.filterType = "index";
  }

  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(bodyParams),
    params: {},
  });
  return response?.json();
};

const Intraday = async ({ searchParams }: any) => {
  const type = searchParams?.type;
  const duration = searchParams.duration ? searchParams.duration : "1D";
  const filter = searchParams.filter ? [searchParams.filter] : [];
  const leftNavApi = (APIS_CONFIG as any)["MARKET_STATS_NAV"][APP_ENV];
  const leftNavPromise = await Service.get({
    url: leftNavApi,
    cache: "no-store",
    params: {},
  });
  const leftNavResult = await leftNavPromise?.json();
  const tabData = await fetchTabsData(type);
  const activeViewId = tabData[0].viewId;
  const responseData = await fetchTableData(
    type,
    duration,
    filter,
    activeViewId,
  );

  const ivKey = responseData?.iv;

  const tableData = responseData?.dataList
    ? responseData.dataList
    : responseData;
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
          <MarketStatsIntraDay
            tabsData={TabsData}
            tableData={TableData}
            ivKey={ivKey}
          />
        </div>
      </div>
    </>
  );
};

export default Intraday;
