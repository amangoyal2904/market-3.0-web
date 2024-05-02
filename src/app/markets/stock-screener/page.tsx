import APIS_CONFIG from "../../../network/api_config.json";
import styles from "./StockScreener.module.scss";
import Service from "@/network/service";
import { APP_ENV } from "../../../utils/index";
import StockScreenerPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import { redirect } from "next/dist/server/api-utils";

const fetchData = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=40&list=false`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await Service.get({
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
          <h1 className="heading">Stock Screener</h1>
          <p className={styles.desc}>
            Know the market sentiments. Check the percentage or count of stocks
            in the selected index with value above the technical indicators.
          </p>
        </div>

        <div className={styles.container}>
          <StockScreenerPage data={StockScreenerData} />
        </div>
      </div>
      <BreadCrumb pagePath={pageUrl} pageName={breadCrumbObj} />
    </>
  );
};

export default StockScreener;
