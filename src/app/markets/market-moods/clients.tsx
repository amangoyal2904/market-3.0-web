"use client";

import styles from "./MarketMoods.module.scss";
import { useEffect, useState } from "react";
import MarketMoodTabConfig from "@/utils/marketMoodTabConfig.json";
import MarketMoodHeader from "@/components/MarketMood/SectionHeader";
import FixedTableMarketMood from "@/components/MarketMood/FixedTable";
import ScrollableTableMarketMood from "@/components/MarketMood/ScrollableTable";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Periodic High/Low", key: "periodic" },
  { label: "Advance/Decline", key: "advance-decline" },
  { label: "FAQ", key: "faq" },
];

const faqData = [
  {
    ques: "What is Market Mood?",
    ans: "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
  },
  {
    ques: "How to read Market Mood?",
    ans: "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
  },
  {
    ques: "How it will help you in your investment Journey ?",
    ans: "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
  },
  {
    ques: "What value will Market Mood add to my decision making?",
    ans: "Know the market sentiments. Check the percentage or count of stocks in the selected index with value above the technical indicators.",
  },
];

const MarketMoodsClient = ({
  isprimeuser = false,
  overviewData = {},
  advacneDeclineData = {},
  periodicData = {},
  niftyFilterData = {},
}: any) => {
  const [activeItem, setActiveItem] = useState<string>("overview");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  useEffect(() => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      setActiveItem(hash);
    } else {
      setActiveItem(activeItem);
    }
    const element = document.getElementById(activeItem);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeItem]);

  return (
    <>
      <div className={styles.logo}>
        <div className={styles.icon}>
          <span className="eticon_prime_logo">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </span>
        </div>
        <div className={styles.prime}>ETPrime</div>
        <h1 className={styles.heading}>MarketMood</h1>
      </div>
      <p className={styles.desc}>
        Know the market sentiments. Check the percentage or count of stocks in
        the selected index with value above the technical indicators.
      </p>

      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {tabData.map((item: any, index: number) => {
            return (
              <li
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className={activeItem === item.key ? styles.active : ""}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
      <section id="overview" className={styles.section}>
        <MarketMoodHeader
          heading="Overview"
          niftyFilterData={niftyFilterData}
          config={MarketMoodTabConfig["overview"]}
        />
        <div className={styles.tableWrapper} id="table">
          <FixedTableMarketMood tableData={overviewData?.dataList} />
          <ScrollableTableMarketMood
            tableHeader={overviewData?.labels}
            tableData={overviewData?.dataList}
            type="count"
          />
        </div>
      </section>
      <section id="periodic" className={styles.section}>
        <MarketMoodHeader
          heading="Periodic High/Low"
          niftyFilterData={niftyFilterData}
          config={MarketMoodTabConfig["periodic"]}
        />
        <p>This is the content for Item 2.</p>
      </section>
      <section id="advance-decline" className={styles.section}>
        <MarketMoodHeader
          heading="Advance/Decline"
          niftyFilterData={niftyFilterData}
          config={MarketMoodTabConfig["advanceDecline"]}
        />
        <p>This is the content for Item 3.</p>
      </section>
      <section id="faq" className={styles.faq}>
        <div className={styles.head}>Frequently Asked Questions</div>
        {faqData.map((item: any, index: number) => {
          return (
            <div className={styles.faqItem} key={index}>
              <p className={styles.ques}>{item.ques}</p>
              <p className={styles.ans}>{item.ans}</p>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default MarketMoodsClient;
