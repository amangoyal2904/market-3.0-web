"use client";
import { useState, useRef, useEffect } from "react";

import styles from "./MarketTabs.module.scss";
import ShimmerMenu from "@/components/Shimmer/shimmerMenu";

const LeftMenuTabs = ({ data, activeViewId, tabsViewIdUpdate }: any) => {
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const tabClick = (viewId: any) => {
    tabsViewIdUpdate(viewId);
  };

  const tabDataFitlerBaseOnWidth = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth;
    if (tabsListWidth != null) {
      let currentWidth = 0;
      const filterData =
        data.length > 0 ? data.filter((item: any) => item.selectedFlag) : [];
      const newVisibleTabs: any[] = [];
      const newHiddenTabs: any[] = [];
      for (const tab of filterData) {
        const tabWidth = tab.name.length * 10; // Adjust the width calculation as per your requirement
        if (currentWidth + tabWidth < tabsListWidth) {
          newVisibleTabs.push(tab);
          currentWidth += tabWidth;
        } else {
          newHiddenTabs.push(tab);
        }
      }
      setVisibleTabs(newVisibleTabs);
      setHiddenTabs(newHiddenTabs);
    }
  };

  useEffect(() => {
    tabDataFitlerBaseOnWidth();
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      tabDataFitlerBaseOnWidth();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <ul className={styles.tabsList} ref={tabsListRef}>
        {!visibleTabs.length && <ShimmerMenu />}
        {visibleTabs.map((item: any, index: number) => {
          return (
            <li
              key={item.id + index}
              onClick={() => tabClick(item.viewId)}
              className={activeViewId === item.viewId ? styles.active : ""}
            >
              {item.name}
            </li>
          );
        })}
        {hiddenTabs && hiddenTabs.length > 0 ? (
          <li className={styles.moreTabsListData}>
            <div className={styles.moreTabWrap}>
              <div className={styles.moreSec}>
                More{" "}
                <span
                  className={`eticon_caret_down ${styles.moreCaretDown}`}
                ></span>
              </div>
              <ul className={styles.moreListItem}>
                {hiddenTabs.map((item: any, index: number) => {
                  return (
                    <li
                      key={item.id + index}
                      onClick={() => tabClick(item.viewId)}
                      className={
                        activeViewId === item.viewId ? styles.active : ""
                      }
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ) : null}
      </ul>
    </>
  );
};

export default LeftMenuTabs;
