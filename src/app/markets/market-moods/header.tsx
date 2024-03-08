"use client";
import { useState } from "react";
import styles from "./MarketMoods.module.scss";

const durationOptions = [
  { label: "1M", value: "1M", id: 1 },
  { label: "3M", value: "3M", id: 2 },
  { label: "6M", value: "6M", id: 3 },
  { label: "1Y", value: "1Y", id: 4 },
];

const countPercentageOptions = [
  { label: "Count", value: "count", id: 1 },
  { label: "Percentage", value: "percentage", id: 2 },
];

const monthlyDailyOptions = [
  { label: "Daily", value: "daily", id: 1 },
  { label: "Monthly", value: "monthly", id: 2 },
];

const MarketMoodHeader = ({ heading, niftyFilterData, config }: any) => {
  const {
    showIndexFilter,
    showDuration,
    showCountPercentage,
    showMonthlyDaily,
  } = config;
  const [showFilter, setShowFilter] = useState(false);
  const [duration, setDuration] = useState("1M");
  const [countPercentage, setCountPercentage] = useState("count");
  const [monthlyDaily, setMonthlyDaily] = useState("daily");
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };

  const handleDuration = (item: string) => {
    setDuration(item);
  };

  const handleCountPercentage = (item: string) => {
    setCountPercentage(item);
  };

  const handleMonthlyDaily = (item: string) => {
    setMonthlyDaily(item);
  };

  return (
    <div className={styles.header}>
      <div className={styles.head}>{heading}</div>
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
