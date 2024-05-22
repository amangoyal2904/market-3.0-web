import React, { useEffect, useRef, useState } from "react";
import styles from "../MarketTabs/MarketTabs.module.scss";
import ShimmerMenu from "@/components/Shimmer/shimmerMenu";
import useDebounce from "@/hooks/useDebounce";
import DayFitler from "../DayFilter";
import { trackingEvent } from "@/utils/ga";
const tabData = [
  {
    label: "<span>Bullish Moving</span>Average Crossover",
    indicatorName: "EMA20",
    crossoverType: "Bullish",
    key: "bullish-moving-average-crossover",
  },
  {
    label: "<span>Bearish Moving</span>Average Crossover",
    indicatorName: "EMA20",
    crossoverType: "Bearish",
    key: "bearish-moving-average-crossover",
  },
  {
    label: "<span>Bullish MACD</span>Crossover",
    indicatorName: "MACD",
    crossoverType: "Bullish",
    key: "bullish-macd-crossover",
  },
  {
    label: "<span>Bearish MACD</span>Crossover",
    indicatorName: "MACD",
    crossoverType: "Bearish",
    key: "bearish-macd-crossover",
  },
  {
    label: "<span>Bullish Stochastic</span>Crossover",
    indicatorName: "STOCHASTIC",
    crossoverType: "Bullish",
    key: "bullish-stochastic-crossover",
  },
  {
    label: "<span>Bearish Stochastic</span>Crossover",
    indicatorName: "STOCHASTIC",
    crossoverType: "Bearish",
    key: "bearish-stochastic-crossover",
  },
];
const exchangeOptions = [
  {
    label: "NSE",
    value: "nse",
    id: "nse",
  },
  {
    label: "BSE",
    value: "bse",
    id: "bse",
  },
];

const BuySellTab = ({
  activeItem,
  payload,
  dropDownOptions,
  dropDownValue,
  handleExchange,
  tabClick,
  dropDownChangeHandler,
}: any) => {
  const { exchange } = payload;
  const [dayFilterShow, setDayFilterShow] = useState(false);
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const [isAnyInnerActive, setIsAnyInnerActive] = useState(false);
  const { debounce } = useDebounce();

  const filterChangeHandler = (value: any, label: any) => {
    setDayFilterShow(false);
    dropDownChangeHandler(value, label);
  };

  const handleDropDown = () => {
    setDayFilterShow(true);
  };

  const updateTabsVisibility = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth || 0;
    const filterData = tabData;
    let currentWidth = 0;
    const newVisibleTabs: any[] = [];
    const newHiddenTabs: any[] = [];
    for (const tab of filterData) {
      const tabWidth = tab.label.length * 3; // Adjust the width calculation as per your requirement
      if (currentWidth + tabWidth < tabsListWidth) {
        newVisibleTabs.push(tab);
        currentWidth += tabWidth;
      } else {
        newHiddenTabs.push(tab);
      }
    }
    setVisibleTabs(newVisibleTabs);
    setHiddenTabs(newHiddenTabs);
    const found = newHiddenTabs.find((item: any) => item.key == activeItem);
    setIsAnyInnerActive(!!found);
  };

  useEffect(() => {
    updateTabsVisibility();
  }, [tabData]);

  useEffect(() => {
    const handleResize = debounce(() => {
      updateTabsVisibility();
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [debounce, hiddenTabs]);

  useEffect(() => {
    updateTabsVisibility();
  }, [tabsListRef.current?.offsetWidth]);

  return (
    <div className={styles.tabsWrap}>
      <ul className={`${styles.tabsList}`} ref={tabsListRef}>
        {!visibleTabs.length && !hiddenTabs.length && <ShimmerMenu />}
        {visibleTabs.map((item: any, index: number) => (
          <li
            key={index}
            onClick={() => {
              tabClick(item);
              trackingEvent("et_push_event", {
                event_category: "mercury_engagement",
                event_action: "tab_selected",
                event_label: `Buy/Sell ${item.label}`,
              });
              setIsAnyInnerActive(false);
            }}
            className={
              activeItem === item.key
                ? `${styles.active} ${styles.center}`
                : styles.center
            }
            dangerouslySetInnerHTML={{ __html: item.label }}
          ></li>
        ))}
        {hiddenTabs.length > 0 && (
          <li className={`${isAnyInnerActive ? styles.active : ""}`}>
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
                    key={index}
                    onClick={() => {
                      tabClick(item);
                      trackingEvent("et_push_event", {
                        event_category: "mercury_engagement",
                        event_action: "tab_selected",
                        event_label: `Buy/Sell More_${item.label}`,
                      });
                      setIsAnyInnerActive(true);
                    }}
                    className={activeItem === item.key ? styles.active : ""}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  ></li>
                ))}
              </ul>
            </div>
          </li>
        )}
      </ul>

      <div className={styles.rightSide}>
        <div className="prel">
          <span
            className={`${styles.roundBtn} ${styles.fitlerDay} ${!dropDownOptions.length ? styles.noPointer : ""}`}
            onClick={
              dropDownOptions.length > 1 ? () => handleDropDown() : undefined
            }
          >
            {dropDownValue.label}
            {dropDownOptions.length > 1 && (
              <i className="eticon_caret_down"></i>
            )}
          </span>
          {dayFilterShow && dropDownOptions.length > 1 ? (
            <DayFitler
              setDayFilterShow={setDayFilterShow}
              selectedDay={dropDownValue}
              filterHandler={filterChangeHandler}
              intradayDurationOptions={dropDownOptions}
            />
          ) : (
            ""
          )}
        </div>
        <ul className={styles.btnGroup}>
          {exchangeOptions.map((item: any) => {
            return (
              <li
                key={item.id}
                onClick={() => handleExchange(item.value)}
                className={exchange === item.value ? styles.active : ""}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BuySellTab;
