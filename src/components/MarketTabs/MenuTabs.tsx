import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./MarketTabs.module.scss";
import ShimmerMenu from "@/components/Shimmer/shimmerMenu";
import useDebounce from "@/hooks/useDebounce";
import { trackingEvent } from "@/utils/ga";

const LeftMenuTabs = React.memo(
  ({ data, activeViewId, tabsViewIdUpdate, page, widgetName }: any) => {
    const tabsListRef = useRef<HTMLUListElement>(null);
    const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
    const [isAnyInnerActive, setIsAnyInnerActive] = useState(false);

    const tabClick = (viewId: any, tabName: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "tab_selected",
        event_label: widgetName === "" ? tabName : `${widgetName}_${tabName}`,
      });
      tabsViewIdUpdate(viewId);
    };
    const { debounce } = useDebounce();

    const updateTabsVisibility = useCallback(() => {
      const tabsListWidth = tabsListRef.current?.offsetWidth || 0;
      const filterData = data.filter((item: any) => item.selectedFlag);
      let currentWidth = 0;
      const newVisibleTabs: any[] = [];
      const newHiddenTabs: any[] = [];

      for (const tab of filterData) {
        const tabWidth = tab.name.length * 12;
        if (currentWidth + tabWidth < tabsListWidth) {
          newVisibleTabs.push(tab);
          currentWidth += tabWidth;
        } else {
          newHiddenTabs.push(tab);
        }
      }

      setVisibleTabs(newVisibleTabs);
      setHiddenTabs(newHiddenTabs);

      const found = newHiddenTabs.find((item) => item.viewId === activeViewId);
      setIsAnyInnerActive(!!found);
    }, [data, activeViewId]);

    useEffect(() => {
      updateTabsVisibility();
    }, [data, updateTabsVisibility]);

    useEffect(() => {
      const handleResize = debounce(() => {
        updateTabsVisibility();
      }, 300); // Adjust the debounce delay as needed

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [debounce, updateTabsVisibility]);

    useEffect(() => {
      updateTabsVisibility();
    }, []);

    return (
      <ul className={styles.tabsList} ref={tabsListRef}>
        {!visibleTabs.length && !hiddenTabs.length && <ShimmerMenu />}
        {visibleTabs.map((item: any, index: number) => (
          <li
            key={item.id + index}
            onClick={() => {
              tabClick(item.viewId, item.name);
              setIsAnyInnerActive(false);
            }}
            className={activeViewId === item.viewId ? styles.active : ""}
          >
            {item.name}
          </li>
        ))}
        {hiddenTabs.length > 0 && (
          <li className={isAnyInnerActive ? styles.active : ""}>
            <div className={styles.moreTabWrap}>
              <div className={styles.moreSec}>
                More
                <span
                  className={`eticon_caret_down ${styles.moreCaretDown}`}
                ></span>
              </div>
              <ul className={styles.moreListItem}>
                {hiddenTabs.map((item: any, index: number) => (
                  <li
                    key={item.id + index}
                    onClick={() => {
                      tabClick(item.viewId, item.name);
                      setIsAnyInnerActive(true);
                    }}
                    className={
                      activeViewId === item.viewId ? styles.active : ""
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )}
      </ul>
    );
  },
);
LeftMenuTabs.displayName = "LeftMenuTabs";
export default LeftMenuTabs;
