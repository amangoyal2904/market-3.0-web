"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./MarketTabs.module.scss";
import { useStateContext } from "../../store/StateContext";
import DayFitler from "../DayFilter/index";
import StockFilterNifty from "../StockFilterNifty";

const BasicTabs = ({
  data,
  activeViewId,
  tabsViewIdUpdate,
  showNiftyFilter = false,
  showDayFilter = false,
  niftyFilterData = {},
  filterDataChange,
  dayFilterHandlerChange,
  type,
}: any) => {
  const [activeViewID, setActiveViewID] = useState(activeViewId);
  const [tabType, setTabType] = useState(type);
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [dayFilterShow, setDayFilterShow] = useState(false);
  const [dayFilterValueSet, setDayFilterValueSet] = useState({
    value: "1d",
    label: "1 Day",
  });
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const { state } = useStateContext();
  const { isLogin } = state.login;

  const tabClick = (viewId: any, type: any) => {
    tabsViewIdUpdate(viewId, type);
    setActiveViewID(viewId);
    setTabType(type);
  };
  const tabDataFitlerBaseOnWidth = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth;
    if (tabsListWidth != null) {
      let currentWidth = 0;
      console.log("@@@@@_---->>", data);
      const filterData =
        data.length > 0 ? data.filter((item: any) => item.viewId) : [];
      const newVisibleTabs: any[] = [];
      const newHiddenTabs: any[] = [];
      for (const tab of filterData) {
        const tabWidth = tab.label.length * 10; // Adjust the width calculation as per your requirement
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
  const dayFilterHandler = () => {
    setDayFilterShow(true);
  };
  const filterChangeHandler = (value: any, label: any) => {
    const filterDataSet = { value, label };
    setDayFilterValueSet(filterDataSet);
    dayFilterHandlerChange(value, label);
    setDayFilterShow(false);
  };
  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChangeData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChange(id, name, selectedTab);
  };
  const filterApiCall = () => {
    try {
      fetch(
        "https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson",
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log("error filer data is not fetch");
          }
        })
        .then((data) => {
          setFilterMenuData(data);
        })
        .catch((err) => {
          console.log("get error", err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (showNiftyFilter) {
      filterApiCall();
    }
  }, [showNiftyFilter]);
  // ====  Here only Filter tabs code end  here
  useEffect(() => {
    const handleResize = () => {
      const tabsListWidth = tabsListRef.current?.offsetWidth;
      if (tabsListWidth != null) {
        const actualTabListWith = tabsListWidth - 400;
        const visibleTabsWidth = visibleTabs.reduce((totalWidth, tab) => {
          return totalWidth + tab.offsetWidth;
        }, 0);
        const hiddenTabsWidth = hiddenTabs.reduce((totalWidth, tab) => {
          return totalWidth + tab.offsetWidth;
        }, 0);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [visibleTabs, hiddenTabs]);

  useEffect(() => {
    tabDataFitlerBaseOnWidth();
  }, [data]);

  useEffect(() => {
    setActiveViewID(activeViewId);
    setTabType(type);
  }, [activeViewId]);

  return (
    <>
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList} ref={tabsListRef}>
          {visibleTabs.map((item: any, index: number) => {
            return (
              <li
                key={item.id}
                onClick={() => tabClick(item.viewId, item.type)}
                className={tabType === item.type ? styles.active : ""}
              >
                {item.label}
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
                        key={item.id}
                        onClick={() => tabClick(item.viewId, item.type)}
                        className={tabType === item.type ? styles.active : ""}
                      >
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ) : null}
        </ul>
        <div className={styles.rightSide}>
          {showNiftyFilter ? (
            <span
              className={`${styles.roundBtn} ${styles.filterNseBse}`}
              onClick={() => showFilterMenu(true)}
            >
              {niftyFilterData?.name}
            </span>
          ) : (
            ""
          )}
          {showDayFilter ? (
            <div
              className={`${styles.roundBtn} ${styles.fitlerDay}`}
              onClick={() => dayFilterHandler()}
            >
              {dayFilterValueSet.label}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {dayFilterShow && (
        <DayFitler
          setDayFilterShow={setDayFilterShow}
          selectedDay={dayFilterValueSet}
          filterHandler={filterChangeHandler}
        />
      )}
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
    </>
  );
};

export default BasicTabs;
