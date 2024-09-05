import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { commonPostAPIHandler } from "@/utils/screeners";
import { getCookie } from "@/utils";
import MarketTable from "../../MarketTable";
import { useStateContext } from "@/store/StateContext";
import tableConfig from "@/utils/tableConfig.json";
import DeclaredCards from "../DeclaredCards";
import ViewAllCta from "../ViewAllCta";

const EarningsWatchlist = () => {
  const [processingLoader, setProcessingLoader] = useState(false);
  const [tabActive, setTabActive] = useState(0);
  const [tableData, setTableData]: any = useState([]);
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [activeItem, setActiveItem] = useState(
    "stocks-earnings-watchlist-page",
  );
  const [declareCompanies, setDeclareCompanies] = useState({});
  const [cardLoading, setCardLoading] = useState(false);

  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const config = tableConfig["stocksearningsWatchListTable"];
  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];
  const tabData = [
    { title: "Upcoming Results", id: 0 },
    { title: "Declared Results", id: 1 },
  ];
  const tabHandler = (value: number) => {
    setTabActive(value);
    if (value === 0) {
      // setTabContentData(_tabData?.topSector || []);
    } else {
      // setTabContentData(_tabData?.underSector || []);
    }
  };
  const watchlistAPICall = async () => {
    tabActive ? setCardLoading(true) : setProcessingLoader(true);
    const wathListBodyPayLoad = {
      filterType: "watchlist",
      pageSize: tabActive ? 20 : 150,
      pageNo: 1,
      deviceType: "web",
      sort: [{ field: "R1MonthReturn", order: "DESC" }],
      watchlist: 1,
    };
    const apiType = tabActive ? `DECLARED_COMPANIES` : `UPCOMING_COMPANIES`;

    const ssoid = getCookie("ssoid") || undefined;
    const responseData = await commonPostAPIHandler(
      apiType,
      wathListBodyPayLoad,
    );
    //console.log("ssoid_____________", ssoid, responseData.dataList)
    const _watchlistdata: any = responseData?.dataList || [];
    const _declareWatchlistData: any = responseData || {};
    console.log("_declareWatchlistData", _declareWatchlistData);
    tabActive ? setCardLoading(false) : setProcessingLoader(false);
    tabActive
      ? setDeclareCompanies(_declareWatchlistData)
      : setTableData(_watchlistdata);
  };
  useEffect(() => {
    watchlistAPICall();
  }, [tabActive]);
  return (
    <>
      <div className={styles.watchlistWrap}>
        <div className={styles.headTxt}>My Watchlist Results </div>
        <ul className={styles.sectorTab}>
          {tabData.map((item: any, index: number) => {
            return (
              <li
                onClick={() => tabHandler(index)}
                className={tabActive === index ? styles.active : ""}
                key={`${index}-${item.title}`}
              >
                {item.title}
              </li>
            );
          })}
        </ul>
        <div className={styles.tabContent}>
          <div className={styles.tableSection}>
            {tabActive ? (
              <div className={styles.cardTableSec}>
                <div className={styles.mainCardWrap}>
                  <DeclaredCards
                    typeMode="watchlist"
                    data={declareCompanies}
                    loading={cardLoading}
                  />
                </div>
              </div>
            ) : (
              <>
                <MarketTable
                  highlightLtp={
                    !!currentMarketStatus && currentMarketStatus != "CLOSED"
                  }
                  data={tableData}
                  tableHeaders={tableHeaderData}
                  tableConfig={config}
                  isprimeuser={isPrime}
                  processingLoader={processingLoader}
                  l1NavTracking="Markets"
                  l2NavTracking="Stocks/earnings"
                  l3NavTracking={activeItem}
                  setFallbackWebsocket={setFallbackWebsocket}
                />
                <ViewAllCta
                  text="View all Results"
                  urlInternal="yes"
                  url="/markets/stocks/upcoming-results"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EarningsWatchlist;
