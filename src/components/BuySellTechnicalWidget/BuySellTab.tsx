import React, { useState } from "react";
import styles from "../MarketTabs/MarketTabs.module.scss";
import DayFitler from "../DayFilter";
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

  const filterChangeHandler = (value: any, label: any) => {
    setDayFilterShow(false);
    dropDownChangeHandler(value, label);
  };

  const handleDropDown = () => {
    setDayFilterShow(true);
  };

  return (
    <div className={styles.tabsWrap}>
      <ul className={styles.tabsList}>
        {tabData.map((item: any, index: number) => (
          <li
            key={index}
            onClick={() => {
              tabClick(item);
            }}
            className={
              activeItem === item.key
                ? `${styles.active} ${styles.center}`
                : styles.center
            }
            dangerouslySetInnerHTML={{ __html: item.label }}
          ></li>
        ))}
      </ul>

      <div className={styles.rightSide}>
        <div className="prel">
          <span
            className={`${styles.roundBtn} ${styles.fitlerDay}`}
            onClick={() => handleDropDown()}
          >
            {dropDownValue.label}{" "}
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
