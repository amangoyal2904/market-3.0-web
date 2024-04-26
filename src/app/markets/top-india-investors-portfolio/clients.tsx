"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTabs from "../../../components/BigBullTabs";
import tabsJson from "../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../DataJson/individualFilter.json";
import { commonPostAPIHandler } from "../../../utils/screeners";
import Loader from "@/components/Loader";

const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullClientPage = ({ data }: any) => {
  console.log("__======_data", data);
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
  const [loading, setLoading] = useState<boolean>(false);
  const [__data, setData] = useState(data);
  const fitlerHandler = (value: any) => {
    setActiveFilter(value);
  };
  const callAPIfitler = async () => {
    setLoading(true);
    const payload = {
      ssoId: "",
      investorType: aciveFilter,
      sortBy: "networth",
      orderBy: "DESC",
      primeFlag: 1,
      pageSize: 3,
      pageNo: 1,
    };
    const data = await commonPostAPIHandler(
      `BigBullAllInverstorOverview`,
      payload,
    );
    if (data && data.datainfo) {
      const newData = {
        pageData: data.datainfo,
      };
      setData(newData);
    }
    setLoading(false);
  };
  useEffect(() => {
    callAPIfitler();
  }, [aciveFilter]);
  return (
    <div className={styles.wraper}>
      <div className={styles.topSec}>
        <h1 className={`heading ${styles.head}`}>
          <span className={styles.etprimeLogo}>ETPrime</span>
          <span className={styles.bigLogo}>Big</span>
          <span className={styles.bullTxt}>Bull Portfolio</span>
        </h1>
        <p className={styles.desc}>
          Get to know where the market gurus invest to grow your portfolio.
        </p>
      </div>
      <div className={`prel ${styles.container}`}>
        <BigBullTabs
          data={tabs}
          individualFilter={individualFilter}
          aciveFilter={aciveFilter}
          fitlerHandler={fitlerHandler}
        />
        <BigBullSection
          data={__data?.pageData?.investorlist?.investorData}
          cartLink={`/markets/top-india-investors-portfolio/all-invertors`}
          title="Individual Investors"
          type="card1"
          cartTitle={`View All ${__data?.pageData?.investorlist?.pageSummaryInfo?.totalPages} Investors`}
        />
        <BigBullSection
          title="Changes in Holdings from Last Quarter "
          type="card2"
          data={__data?.pageData?.investorKeyChanges?.investorKeyChangesData}
          cartLink={`/markets/top-india-investors-portfolio/qtr-changes`}
          cartTitle="View All Holding Changes"
        />
        <BigBullSection
          title="Recent Transactions "
          type="card2"
          data={__data?.pageData?.recentDealsInfo?.listRecentDeals}
          cartLink={`/markets/top-india-investors-portfolio/recent-transactions`}
          cartTitle="View All Recent Transactions"
        />
        <BigBullSection
          title="Best Stock Picks "
          type="card2"
          data={__data?.pageData?.bestPicksDataInfo?.bestPicksListInfo}
          cartLink={`/markets/top-india-investors-portfolio/best-picks`}
          cartTitle={`View All ${__data?.pageData?.bestPicksDataInfo?.pageSummaryInfo?.totalPages} Best STock Picks`}
        />
        <BigBullSection
          title="Most Held Stocks "
          type="card3"
          data={__data?.pageData?.mostHoldCompanyInfo?.mostHoldStockData}
          cartLink={`/markets/top-india-investors-portfolio/most-held`}
          cartTitle={`View All ${__data?.pageData?.mostHoldCompanyInfo?.pageSummaryInfo?.totalPages} Most Helds Stocks`}
        />
        {loading && <Loader loaderType="container" />}
      </div>
    </div>
  );
};

export default BigBullClientPage;
