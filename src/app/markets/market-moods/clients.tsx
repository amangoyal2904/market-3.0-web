"use client";

import styles from "./MarketMoods.module.scss";
import { useEffect, useState } from "react";
import MarketMoodHeader from "./header";
import MarketMoodTabConfig from "@/utils/marketMoodTabConfig.json";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Periodic High/Low", key: "periodic" },
  { label: "Advance/Decline", key: "advance-decline" },
  { label: "FAQ", key: "faq" },
];

const MarketMoodsClient = ({
  isprimeuser = false,
  overviewData = {},
  advacneDeclineData = {},
  periodicData = {},
  niftyFilterData = {},
}) => {
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
        <p>This is the content for Item 1.</p>
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
      <section id="faq">
        <h2>Item 3 Content</h2>
        <p>This is the content for Item 3.</p>
      </section>
    </>
  );
};

export default MarketMoodsClient;
