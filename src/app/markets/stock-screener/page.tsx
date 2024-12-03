import APIS_CONFIG from "../../../network/api_config.json";
import styles from "./StockScreener.module.scss";
import service from "@/network/service";
import { APP_ENV } from "../../../utils/index";
import StockScreenerPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import DfpAds from "@/components/Ad/DfpAds";

const fetchData = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=40&list=false`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await service.get({
    url: API_URL,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const StockScreener = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const StockScreenerData = await fetchData();
  const breadCrumbObj = [{ label: "Stock Screener", redirectUrl: "" }];
  return (
    <>
      <div className={styles.wraper}>
        <div className={styles.topSec}>
          <h1 className="heading">Stock Screeners</h1>
          <p className={styles.desc}>
            Discover the hidden gems from pre-built screeners or create your own
            with over 700+ data points.
          </p>
        </div>

        <div className={styles.container}>
          <StockScreenerPage data={StockScreenerData} />
        </div>
      </div>

      <BreadCrumb pagePath={pageUrl} pageName={breadCrumbObj} />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default StockScreener;
