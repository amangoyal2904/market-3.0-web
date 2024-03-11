"use client";

import styles from "./MarketMoods.module.scss";
import React, { useState, useEffect, useRef } from "react";
import MarketMoodTabConfig from "@/utils/marketMoodTabConfig.json";
import MarketMoodHeader from "@/components/MarketMood/SectionHeader";
import FixedTableMarketMood from "@/components/MarketMood/FixedTable";
import ScrollableTableMarketMood from "@/components/MarketMood/ScrollableTable";
import ScrollableBarsTableMarketMood from "@/components/MarketMood/ScrollableBarsTable";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Periodic High/Low", key: "periodic" },
  { label: "Advance/Decline", key: "advanceDecline" },
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
  const [activeItem, setActiveItem] = useState<string>("");
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollDisabledRef = useRef<boolean>(false); // Flag to disable/enable scroll listener

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substr(1);
    if (hash) {
      // If there is, set the active item to the hash value
      setActiveItem(hash);
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Scroll to the active item's content when activeItem changes
    scrollToActiveContent();
  }, [activeItem]);

  const scrollToActiveContent = () => {
    const element = document.getElementById(activeItem);
    if (element) {
      const offset = element.offsetTop - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setTimeout(() => {
        scrollDisabledRef.current = false;
      }, 500);
    }
  };

  const handleScroll = () => {
    if (!scrollDisabledRef.current) {
      for (const [key, value] of Object.entries(contentRefs.current)) {
        if (value) {
          const rect = value.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setActiveItem(key);
          }
        }
      }
    }
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    scrollDisabledRef.current = true;
  };

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
                className={
                  activeItem === item.key ||
                  (activeItem == "" && item.key == "overview")
                    ? styles.active
                    : ""
                }
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        id="overview"
        className={styles.section}
        ref={(ref) => (contentRefs.current["overview"] = ref)}
      >
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
      </div>
      <div
        id="periodic"
        className={styles.section}
        ref={(ref) => (contentRefs.current["periodic"] = ref)}
      >
        <MarketMoodHeader
          heading="Periodic High/Low"
          niftyFilterData={niftyFilterData}
          config={MarketMoodTabConfig["periodic"]}
        />
        <div className={styles.tableWrapper} id="table">
          <FixedTableMarketMood tableData={periodicData?.dataList} />
          <ScrollableBarsTableMarketMood
            tableData={periodicData?.dataList}
            type="periodic"
          />
        </div>
      </div>
      <div
        id="advanceDecline"
        className={styles.section}
        ref={(ref) => (contentRefs.current["advanceDecline"] = ref)}
      >
        <MarketMoodHeader
          heading="Advance/Decline"
          niftyFilterData={niftyFilterData}
          config={MarketMoodTabConfig["advanceDecline"]}
        />
        <div className={styles.tableWrapper} id="table">
          <FixedTableMarketMood tableData={advacneDeclineData?.dataList} />
          <ScrollableBarsTableMarketMood
            tableData={advacneDeclineData?.dataList}
            type="advacneDecline"
          />
        </div>
      </div>
      <div
        id="faq"
        className={styles.faq}
        ref={(ref) => (contentRefs.current["faq"] = ref)}
      >
        <div className={styles.head}>Frequently Asked Questions</div>
        {faqData.map((item: any, index: number) => {
          return (
            <div className={styles.faqItem} key={index}>
              <p className={styles.ques}>{item.ques}</p>
              <p className={styles.ans}>{item.ans}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MarketMoodsClient;
