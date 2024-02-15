import MarketTabs from "@/components/MarketTabs";
import APIS_CONFIG from "../../../network/api_config.json";
import styles from "../Marketstats.module.css";

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
  console.log("tabledata", res);
  return res;
};

const Intraday = async () => {
  const tabData = await fetchTabsData("gainers");
  let activeViewId = tabData[0].viewId;
  // let tableData = await fetchTableData(activeViewId);
  // const tableHeaderData =
  //   (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Top Gainers</h1>
      <div className="container">
        <div className="lhs"></div>
        <div className="rhs">
          <MarketTabs data={tabData} activeViewId={activeViewId} />
        </div>
      </div>
    </div>
  );
};

export default Intraday;
