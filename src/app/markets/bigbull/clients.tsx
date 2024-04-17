"use client";
import { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import BigBullTabs from "../../../components/BigBullTabs";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTableCard from "../../../components/BigBullTableCard";

const BigBullClientPage = ({ data }: any) => {
  const [tabName, setTabName] = useState("overview");
  const tabHandlerClick = (id: string) => {
    setTabName(id);
  };
  const TabContentModule = () => {
    if (tabName === "overview") {
      return (
        <>
          <BigBullSection data="" title="Individual Investors" type="card1" />
          <BigBullSection
            data=""
            title="Changes in Holdings from Last Quarter "
            type="card2"
          />
          <BigBullSection
            data=""
            title="Recent Transactions "
            type="card2"
            mode="transaction"
          />
        </>
      );
    } else if (tabName === "allInvestors") {
      return (
        <>
          <BigBullTableCard />
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
