"use client";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const InvestorsTopTabs = ({ data, rightTabTxt = "" }: any) => {
  const pathname = usePathname();
  const isActive = (path: any) => path === pathname;
  return (
    <>
      <div className={styles.tabSec}>
        <ul className={styles.bbtabs}>
          {data.map((tab: any, index: any) => {
            return (
              <li
                className={`${isActive(tab.url) ? styles.active : ""}`}
                key={`${index}-`}
              >
                <Link href={`${tab.url}`}>
                  <span>{tab.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={styles.rigthTab}>{rightTabTxt}</div>
      </div>
    </>
  );
};
export default InvestorsTopTabs;
