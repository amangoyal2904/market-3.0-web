import APIS_CONFIG from "../../../network/api_config.json";
import styles from "../Marketstats.module.scss";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketTabs from "@/components/MarketTabs";
import MarketTable from "@/components/MarketTable";

const fetchTabsData = async (statstype: string) => {
  const apiUrl = `${APIS_CONFIG?.watchListTab["development"]}?statstype=${statstype}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return response?.json();
};

const fetchTableData = async (
  firstOperand: any,
  secondOperand: any,
  operationType: any,
  filter: any,
  activeViewId: any,
) => {
  const apiUrl =
    "https://qcbselivefeeds.indiatimes.com/et-screener/moving-averages";
  const bodyParams = {
    filterType: "index",
    filterValue: filter,
    viewId: activeViewId,
    firstOperand: firstOperand,
    operationType: operationType,
    secondOperand: secondOperand,
  };
  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    payload: {},
    body: JSON.stringify(bodyParams),
    params: {},
  });
  return response?.json();
};

const MovingAverages = async ({ searchParams }: any) => {
  const type = searchParams?.type;
  const filter = searchParams.filter ? [parseInt(searchParams.filter)] : [];
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const leftNavApi = (APIS_CONFIG as any)["MARKET_STATS_NAV"][APP_ENV];
  const leftNavPromise = await Service.get({
    url: leftNavApi,
    params: {},
  });
  const leftNavResult = await leftNavPromise?.json();
  const tabData = await fetchTabsData(type);
  const activeViewId = tabData[0].viewId;
  const responseData = await fetchTableData(
    firstOperand,
    secondOperand,
    operationType,
    filter,
    activeViewId,
  );
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
    showNiftyFilter: false,
    showDayFilter: false,
  };

  const TableData: any = {
    data: tableData,
    tableHeaders: tableHeaderData,
  };
  return (
    <>
      <h1 className="heading">Moving Averages</h1>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav leftNavResult={leftNavResult} />
        </aside>
        <div className={styles.rhs}>
          <MarketTabs
            data={TabsData.data}
            activeViewId={TabsData.activeViewId}
            showAddStock={TabsData.showAddStock}
            showEditStock={TabsData.showEditStock}
            showNiftyFilter={TabsData.showNiftyFilter}
            tabsViewIdUpdate={TabsData.tabsViewIdUpdateFun}
            showDayFilter={TabsData.showDayFilter}
          />
          <MarketTable
            data={TableData.data}
            tableHeaders={TableData.tableHeaders}
          />
        </div>
      </div>
    </>
  );
};

export default MovingAverages;
