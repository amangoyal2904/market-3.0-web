"use client";
import styles from "./InvestEdgeTopVideo.module.scss";
import { trackingEvent } from "@/utils/ga";

export const Tabbing = ({ invementIdeaNavResult }: any) => {
  const handleTabTracking = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: "StockRecos_" + tabName,
    });
  };
  return (
    <>
      <div className={styles.subHead}>
        {/* <div className={styles.headName}>Most Buys</div> */}
        <ul className={styles.mainTabsList}>
          {invementIdeaNavResult?.tabs.map((item: any, index: any) => (
            <li
              key={`investEdge_main_${index}`}
              className={`${styles.mainTab}`}
            >
              {item.label == "Live Stream" ? (
                <a
                  href={item.redirectLink}
                  target="_blank"
                  onClick={() => handleTabTracking(item.label)}
                  title={item.label}
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Tabbing;
