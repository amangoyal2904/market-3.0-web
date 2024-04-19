"use client";
import { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTableCard from "../../../components/BigBullTableCard";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTabs from "../../../components/BigBullTabs";

const tabs = [
  {
    title: "Overview",
    id: "overview",
    url: "/markets/top-india-investors-portfolio",
  },
  {
    title: "All Investors",
    id: "allInvestors",
    url: "/markets/top-india-investors-portfolio/all-invertors",
  },
  {
    title: "Qtr. Changes",
    id: "qtrChanges",
    url: "/markets/top-india-investors-portfolio/qtr-changes",
  },
  {
    title: "Recent Transactions",
    id: "recentTransactions",
    url: "/markets/top-india-investors-portfolio/recent-transactions",
  },
  {
    title: "Best Picks",
    id: "bestPicks",
    url: "/markets/top-india-investors-portfolio/best-picks",
  },
  {
    title: "Most Held",
    id: "mostHeld",
    url: "/markets/top-india-investors-portfolio/most-held",
  },
];

const BigBullClientPage = ({ data }: any) => {
  console.log("___data", data);
  return (
    <>
      <div className={styles.container}>
        <BigBullTabs data={tabs} />
        <BigBullSection
          data={data?.pageData?.individualInvestors?.investorData}
          pageSummaryInfo={data?.pageData?.individualInvestors?.pageSummaryInfo}
          title="Individual Investors"
          type="card1"
          lastTitle="Investors"
        />
        <BigBullSection
          title="Changes in Holdings from Last Quarter "
          type="card2"
          data={data?.pageData?.lastQuater?.investorKeyChangesData}
          pageSummaryInfo={data?.pageData?.lastQuater?.pageSummaryInfo}
          lastTitle="Holding Changes"
        />
        <BigBullSection
          title="Recent Transactions "
          type="card2"
          mode="transaction"
          data={data?.pageData?.recentTransactions?.listRecentDeals}
          pageSummaryInfo={data?.pageData?.recentTransactions?.pageSummaryInfo}
          lastTitle="Recent Transactions"
        />
        <BigBullSection
          title="Best Stock Picks "
          type="card2"
          data={data?.pageData?.bestPicks?.bestPicksListInfo}
          pageSummaryInfo={data?.pageData?.bestPicks?.pageSummaryInfo}
          lastTitle="Best Stock Picks"
        />
      </div>
    </>
  );
};

export default BigBullClientPage;
