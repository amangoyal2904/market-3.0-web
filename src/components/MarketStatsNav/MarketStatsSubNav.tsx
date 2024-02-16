import React from "react";
import styles from "./MarketStatsNav.module.scss";
import Link from "next/link";

interface PageProps {
  item: any;
  index: number;
  toggleItem: any;
}
const MarketStatsSubNav: React.FC<PageProps> = ({
  item,
  index,
  toggleItem,
}) => {
  return (
    <li
      key={`${item.id}-${index}`}
      className={`${styles.navWrapLi} ${item.open ? styles.open : ""}`}
      onClick={(e) => {
        item.sub_nav && toggleItem(e);
      }}
    >
      {item.sub_nav && item.sub_nav.length > 0 && (
        <span className={`eticon_caret_up ${styles.caret_up}`}></span>
      )}
      <span className={styles.labelName}>{item.label}</span>
      {item.sub_nav && (
        <ul className={styles.subNavWrap}>
          {item.sub_nav.map((subItem: any, index: any) => (
            <li
              key={subItem.id}
              className={`${index == 0 ? styles.active : ""}`}
            >
              <Link href={subItem.link}>{subItem.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MarketStatsSubNav;
