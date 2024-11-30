"use client";

import styles from "./styels.module.scss";
import { usePathname } from "next/navigation";
import { trackingEvent } from "@/utils/ga";

const ETLearnTabs = ({ tabData }: any) => {
  const pathname = usePathname();

  const gaTrackingClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "tabClick",
      event_category: "mercury_engagement",
      event_label: `Click ${value}`,
      feature_name: "ETLearn",
      page_template: value,
      product_name: "Mercury_Earnings",
      selected_category: value,
    });
  };
  return (
    <>
      <div className={styles.subHead}>
        <ul className={styles.mainTabsList}>
          {tabData.map((item: any, index: any) => {
            const isActive =
              index === 0
                ? pathname === item?.seoPath
                : pathname.includes(item?.seoPath); // Conditional check based on index

            return (
              <li
                key={`investEdge_main_${index}`}
                className={`${styles.mainTab} ${isActive ? styles.active : ""}`}
              >
                {item.label === "Live Stream" ? (
                  <a
                    href={item?.seoPath}
                    target="_blank"
                    title={item?.label}
                    onClick={() => gaTrackingClickHandler(item?.label)}
                  >
                    {item?.label}
                  </a>
                ) : (
                  <a
                    href={`${item?.seoPath}`}
                    title={item?.label}
                    onClick={() => gaTrackingClickHandler(item?.label)}
                  >
                    {item?.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default ETLearnTabs;
