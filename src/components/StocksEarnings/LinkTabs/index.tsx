import Link from "next/link";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  { value: "sectorPATQoqAvg", title: "Revenue QoQ" },
  { value: "sectorPATYoyAvg", title: "Revenue YoY" },
  { value: "sectorNetSalesQoqAvg", title: "Net Profit QoQ" },
  { value: "sectorNetSalesYoyAvg", title: "Net Profit YoY" },
];

const LinkTabs = ({
  sorting = "",
  sortingValue = "",
  sortHandlerFun,
  sortingLabel = "",
}: any) => {
  const pathName = usePathname();
  const isActive = (tabUrl: string) => {
    return pathName === tabUrl || pathName.startsWith(`${tabUrl}/`);
  };
  const [showSortingMenu, setShowSortingMenu] = useState(false);
  const sortingHandler = () => {
    setShowSortingMenu(!showSortingMenu);
  };
  const sortHandler = (sortData: any) => {
    sortHandlerFun(sortData);
    setShowSortingMenu(false);
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
                <Link href={`${item.url}`}>{item.title}</Link>
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
                          onClick={() => sortHandler(item)}
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
