import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackingEvent } from "@/utils/ga";

const tabsLinkData = [
  { url: "/markets/stocks/earnings", title: "Summary" },
  {
    url: "/markets/stocks/earnings/upcoming-results",
    title: "Upcoming Results",
  },
  {
    url: "/markets/stocks/earnings/declared-results/latest",
    title: "Declared Results",
  },
  {
    url: "/markets/stocks/earnings/sector-aggregate/top-performing",
    title: "Sector Aggregates",
  },
];
const sortDataTab = [
  { value: "sectorNetSalesQoqAvg", title: "Revenue QoQ" },
  { value: "sectorNetSalesYoyAvg", title: "Revenue YoY" },
  { value: "sectorPATQoqAvg", title: "Net Profit QoQ" },
  { value: "sectorPATYoyAvg", title: "Net Profit YoY" },
];

const LinkTabs = ({
  sorting = "",
  sortingValue = "",
  sortHandlerFun,
  sortingLabel = "",
}: any) => {
  const pathName = usePathname();
  const isActive = (tabUrl: string) => {
    if (pathName === tabUrl) {
      return true;
    }
    // Check if the pathname contains the specific string for sector-aggregate
    if (
      tabUrl === "/markets/stocks/earnings/sector-aggregate/top-performing" &&
      pathName.includes("/markets/stocks/earnings/sector-aggregate/")
    ) {
      return true;
    }

    if (
      tabUrl === "/markets/stocks/earnings/declared-results/latest" &&
      pathName.includes("/markets/stocks/earnings/declared-results/")
    ) {
      return true;
    }

    return false;
  };
  const [showSortingMenu, setShowSortingMenu] = useState(false);
  const sortingHandler = () => {
    setShowSortingMenu(!showSortingMenu);
  };
  const sortHandler = (sortData: any) => {
    sortHandlerFun(sortData);
    setShowSortingMenu(false);
  };
  const gaTrackingClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_filter_click",
      event_category: "mercury_engagement",
      event_label: `Filter Click ${value}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  const gaTrackingClickTabHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "tab_selected",
      event_category: "mercury_engagement",
      event_label: `Earnings_${value}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  return (
    <>
      <div className={styles.linkTabWrap}>
        <ul>
          {tabsLinkData.map((item: any, index: number) => {
            return (
              <li
                key={`${index}-${item.title}`}
                className={`${isActive(item.url) ? styles.active : ""}`}
              >
                <a
                  onClick={() => gaTrackingClickTabHandler(item?.title)}
                  href={`${item.url}`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
        {sorting === "yes" && (
          <div className={styles.sortingWrap}>
            <div className={styles.txtSec}>
              <div className={styles.lable} onClick={sortingHandler}>
                Sort By: {sortingLabel}
              </div>
              {showSortingMenu && (
                <>
                  <ul className={styles.sortingList}>
                    {sortDataTab.map((item: any, index: number) => {
                      return (
                        <li
                          className={`${sortingValue === item.value ? styles.active : ""}`}
                          onClick={() => {
                            sortHandler(item),
                              gaTrackingClickHandler(item.title);
                          }}
                          key={`${index}-${item.title}`}
                        >
                          {item.title}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LinkTabs;
