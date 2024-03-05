import APIS_CONFIG from "../../../network/api_config.json";
import styles from "./StockScreener.module.scss";
import Service from "@/network/service";
import { APP_ENV } from "../../../utils/index";
import StockScreenerPage from "./client";

const fetchData = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=40&list=true`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await Service.get({
    url: API_URL,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const StockScreener = async () => {
  const StockScreenerData = await fetchData();
  return (
    <div className={styles.wraper}>
      <div className={styles.topSec}>
        <h1 className="heading">Stock Screener</h1>
        <p className={styles.desc}>
          Know the market sentiments. Check the percentage or count of stocks in
          the selected index with value above the technical indicators.
        </p>
      </div>

      <div className={styles.container}>
        <StockScreenerPage data={StockScreenerData} />
      </div>
    </div>
  );
};

export default StockScreener;
