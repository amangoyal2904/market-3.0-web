"use client";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackingEvent } from "@/utils/ga";
const BigBullTabs = ({
  data,
  individualFilter,
  aciveFilter,
  fitlerHandler,
  pageType = "",
}: any) => {
  const pathname = usePathname();
  const isActive = (path: any) => path === pathname;
  const gaTrackingEvent = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: tabName,
    });
  };
  const gaTrackingEventFilter = (value: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: value,
    });
    fitlerHandler(value);
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
                onClick={() => gaTrackingEvent(tab.title)}
              >
                <Link href={`${tab.url}`} title={tab.title}>
                  <span>{tab.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {pageType !== "mostHeld" ? (
          <ul className={styles.rigthTab}>
            {individualFilter.map((filter: any, index: number) => {
              return (
                <li
                  onClick={() => {
                    gaTrackingEventFilter(filter.value);
                  }}
                  className={`${aciveFilter === filter.value ? styles.active : ""}`}
                  key={`${index}-${filter.id}`}
                >
                  <span>{filter.lable}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default BigBullTabs;
