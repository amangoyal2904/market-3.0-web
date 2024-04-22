"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTableCard from "../../../components/BigBullTableCard";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTabs from "../../../components/BigBullTabs";
import tabsJson from "../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../DataJson/individualFilter.json";

const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullClientPage = ({ data }: any) => {
  console.log("___data", data);
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
  const fitlerHandler = (value: any) => {
    setActiveFilter(value);
  };
  const callAPIfitler = () => {
    // ====
  };
  useEffect(() => {
    callAPIfitler();
  }, [aciveFilter]);
  return (
    <>
      <div className={styles.container}>
        <BigBullTabs
          data={tabs}
          individualFilter={individualFilter}
          aciveFilter={aciveFilter}
          fitlerHandler={fitlerHandler}
        />
        <BigBullSection
          data={data?.pageData?.individualInvestors?.investorData}
          cartLink={`/markets/top-india-investors-portfolio/all-invertors`}
          title="Individual Investors"
          type="card1"
          cartTitle={`View All ${data?.pageData?.individualInvestors?.pageSummaryInfo?.totalPages} Investors`}
        />
        <BigBullSection
          title="Changes in Holdings from Last Quarter "
          type="card2"
          data={data?.pageData?.lastQuater?.investorKeyChangesData}
          cartLink={`/markets/top-india-investors-portfolio/qtr-changes`}
          cartTitle="View All Holding Changes"
        />
        <BigBullSection
          title="Recent Transactions "
          type="card2"
          data={data?.pageData?.recentTransactions?.listRecentDeals}
          cartLink="/cartLink"
          cartTitle="View All Recent Transactions"
        />
        <BigBullSection
          title="Best Stock Picks "
          type="card2"
          data={data?.pageData?.bestPicks?.bestPicksListInfo}
          cartLink="/cartLink"
          cartTitle={`View All ${data?.pageData?.bestPicks?.pageSummaryInfo?.totalPages} Best STock Picks`}
        />
        <BigBullSection
          title="Most Held Stocks "
          type="card3"
          data={data?.pageData?.mostHeld?.mostHoldStockData}
          cartLink="/cartLink"
          cartTitle={`View All ${data?.pageData?.mostHeld?.pageSummaryInfo?.totalPages} Most Helds Stocks`}
        />
      </div>
    </>
  );
};

export default BigBullClientPage;
