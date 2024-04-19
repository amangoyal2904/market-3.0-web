"use client";
import { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import BigBullTabs from "../../../components/BigBullTabs";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTableCard from "../../../components/BigBullTableCard";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullClientPage = ({ data, selectedFilter }: any) => {
  console.log("___data", data);
  const [tabName, setTabName] = useState("overview");
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const tabHandlerClick = (id: string) => {
    setTabName(id);
  };
  const filterDataChangeHander = async (id: any) => {
    //setProcessingLoader(true);

    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    //updateL3NAV(id, _payload.duration);
  };
  const TabContentModule = () => {
    if (tabName === "overview") {
      return (
        <>
          <BigBullSection
            data={data?.pageData?.individualInvestors?.investorData}
            pageSummaryInfo={
              data?.pageData?.individualInvestors?.pageSummaryInfo
            }
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
            pageSummaryInfo={
              data?.pageData?.recentTransactions?.pageSummaryInfo
            }
            lastTitle="Recent Transactions"
          />
          <BigBullSection
            title="Best Stock Picks "
            type="card2"
            data={data?.pageData?.bestPicks?.bestPicksListInfo}
            pageSummaryInfo={data?.pageData?.bestPicks?.pageSummaryInfo}
            lastTitle="Best Stock Picks"
          />
        </>
      );
    } else if (tabName === "allInvestors") {
      return (
        <>
          <BigBullTableCard
            niftyFilterData={niftyFilterData}
            filterDataChange={filterDataChangeHander}
          />
        </>
      );
    } else {
      return <> {tabName} </>;
    }
  };
  return (
    <>
      <BigBullTabs
        data={data.tabs}
        activeTab={tabName}
        tabHandlerClick={tabHandlerClick}
      />
      <div className={styles.tabContent}>{TabContentModule()}</div>
    </>
  );
};

export default BigBullClientPage;
