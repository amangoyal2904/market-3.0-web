"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";

export const IeTab = (props: any) => {
  const { invementIdeaNavResult, activeTab, slug } = props;
  const handleTabTracking = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: "StockRecos_" + tabName,
    });
  };

  return (
    <div className={styles.subHead}>
      {/* <div className={styles.headName}>Most Buys</div> */}
      <ul className={styles.mainTabsList}>
        {invementIdeaNavResult?.tabs.map((item: any, index: any) => (
          <li
            key={`investEdge_main_${index}`}
            className={`${styles.mainTab} ${item.seoPath == activeTab ? styles.active : ""}`}
          >
            {item.label == "Live Stream" ? (
              <Link
                href={item.redirectLink}
                target="_blank"
                onClick={() => handleTabTracking(item.label)}
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                data-tt={item.seoPath}
                href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].list}${item.seoPath}`}
                onClick={() => handleTabTracking(item.label)}
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
