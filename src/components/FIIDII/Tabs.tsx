import React from "react";
import styles from "./FIIDII.module.scss";
import Link from "next/link";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Cash Provisional", key: "cash-provisional" },
  { label: "FII Cash", key: "fii-cash" },
  { label: "FII F&O", key: "fii-fno" },
  { label: "MF Cash", key: "mf-cash" },
];

const FiiDiiTabs = React.memo(({ activeTab }: { activeTab: string }) => {
  return (
    <div className={styles.tabsWrap}>
      <ul className={styles.tabsList}>
        {tabData.map((item) => (
          <li
            key={item.key}
            className={`${styles.tabItem} ${
              activeTab === item.key ? styles.active : ""
            }`}
          >
            <Link
              title={item.label}
              href={
                item.key === "overview"
                  ? "/markets/fii-dii-activity"
                  : `/markets/fii-dii-activity/${item.key}`
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <span className={`${styles.roundBtn}`}>
        Cash <i className="eticon_caret_down"></i>
      </span>
    </div>
  );
});

FiiDiiTabs.displayName = "FiiDiiTabs";
export default FiiDiiTabs;
