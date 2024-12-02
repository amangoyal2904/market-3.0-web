"use client";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackingEvent } from "@/utils/ga";

const InvestorsTopTabs = ({ data, rightTabTxt = "" }: any) => {
  const pathname = usePathname();
  const isActive = (path: any) => path === pathname;
  const gaTrackingTabsNameClick = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_clicked",
      event_label: "BigBull_" + tabName,
    });
  };
  return (
    <>
      <div className={styles.tabSec}>
        <ul className={styles.bbtabs}>
          {data.map((tab: any, index: any) => {
            return (
              <li
                className={`${isActive(tab.url) ? styles.active : ""}`}
                key={`${index}-`}
                onClick={() => gaTrackingTabsNameClick(tab.title)}
              >
                <Link href={`${tab.url}`} title={tab.title}>
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
