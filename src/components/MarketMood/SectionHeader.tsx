"use client";
import { useState } from "react";
import styles from "./MarketMood.module.scss";
import {
  countPercentageOptions,
  durationOptions,
  monthlyDailyOptions,
} from "./config";

const MarketMoodHeader = ({
  heading,
  niftyFilterData,
  config,
  countPercentage,
  handleCountPercentage,
  duration,
  handleDuration,
  monthlyDaily,
  handleMonthlyDaily,
}: any) => {
  const {
    showIndexFilter,
    showDuration,
    showCountPercentage,
    showMonthlyDaily,
  } = config;
  const [showFilter, setShowFilter] = useState(false);
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };

  return (
    <div className={styles.header}>
      <div className={styles.head}>
        {heading}
        <span className={styles.subHeading}>{niftyFilterData.name}</span>
      </div>
      <div className={styles.options}>
        {showIndexFilter && (
          <span
            className={`${styles.roundBtn} ${styles.filterNseBse}`}
            onClick={() => showFilterMenu(true)}
          >
            <i className="eticon_filter"></i> {niftyFilterData?.name}
          </span>
        )}

        {showDuration && (
          <ul className={styles.btnGroup}>
            {durationOptions.map((item: any) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleDuration(item.value)}
                  className={duration === item.value ? styles.active : ""}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}

        {showCountPercentage && (
          <ul className={styles.btnGroup}>
            {countPercentageOptions.map((item: any) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleCountPercentage(item.value)}
                  className={
                    countPercentage === item.value ? styles.active : ""
                  }
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}

        {showMonthlyDaily && (
          <ul className={styles.btnGroup}>
            {monthlyDailyOptions.map((item: any) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleMonthlyDaily(item.value)}
                  className={monthlyDaily === item.value ? styles.active : ""}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MarketMoodHeader;
