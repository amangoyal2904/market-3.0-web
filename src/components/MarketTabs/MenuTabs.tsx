import { useState, useRef, useEffect } from "react";
import styles from "./MarketTabs.module.scss";
import ShimmerMenu from "@/components/Shimmer/shimmerMenu";
import useDebounce from "@/hooks/useDebounce";

const LeftMenuTabs = ({ data, activeViewId, tabsViewIdUpdate }: any) => {
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const tabClick = (viewId: any) => {
    tabsViewIdUpdate(viewId);
  };

  const { debounce } = useDebounce();

  const updateTabsVisibility = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth || 0;
    const filterData = data.filter((item: any) => item.selectedFlag);
    let currentWidth = 0;
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
  };

  useEffect(() => {
    updateTabsVisibility();
  }, [data]);

  useEffect(() => {
    const handleResize = debounce(() => {
      updateTabsVisibility();
    }, 300); // Adjust the debounce delay as needed

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [debounce]);

  useEffect(() => {
    updateTabsVisibility();
  }, [tabsListRef.current?.offsetWidth]);

  return (
    <ul className={styles.tabsList} ref={tabsListRef}>
      {!visibleTabs.length && !hiddenTabs.length && <ShimmerMenu />}
      {visibleTabs.map((item: any, index: number) => (
        <li
          key={item.id + index}
          onClick={() => tabClick(item.viewId)}
          className={activeViewId === item.viewId ? styles.active : ""}
        >
          {item.name}
        </li>
      ))}
      {hiddenTabs.length > 0 && (
        <li className={styles.moreTabsListData}>
          <div className={styles.moreTabWrap}>
            <div className={styles.moreSec}>
              More{" "}
              <span
                className={`eticon_caret_down ${styles.moreCaretDown}`}
              ></span>
            </div>
            <ul className={styles.moreListItem}>
              {hiddenTabs.map((item: any, index: number) => (
                <li
                  key={item.id + index}
                  onClick={() => tabClick(item.viewId)}
                  className={activeViewId === item.viewId ? styles.active : ""}
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
};

export default LeftMenuTabs;
