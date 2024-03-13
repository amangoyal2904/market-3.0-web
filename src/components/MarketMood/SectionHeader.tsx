"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./MarketMood.module.scss";
import {
  countPercentageOptions,
  durationOptions,
  monthlyDailyOptions,
} from "./config";
import { fetchFilters } from "@/utils/utility";

const StockFilterNifty = dynamic(
  () => import("@/components/StockFilterNifty"),
  { ssr: false },
);

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
  filterDataChange,
}: any) => {
  const {
    showIndexFilter,
    showDuration,
    showCountPercentage,
    showMonthlyDaily,
    showHelp,
  } = config;
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showPeriodicPopup, setShowPeriodicPopup] = useState(false);
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };

  const togglePeriodicPopup = (value: boolean) => {
    setShowPeriodicPopup(value);
  };

  const handleChangeData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChange(id, name, selectedTab);
  };

  const filterApiCall = async () => {
    const data = await fetchFilters({});
    setFilterMenuData(data);
  };
  useEffect(() => {
    if (showIndexFilter) {
      filterApiCall();
    }
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.head}>
          {heading}
          <span className={styles.subHeading}>{niftyFilterData.name}</span>
          {showHelp && (
            <div className="prel">
              <i
                className="eticon_info"
                onClick={() => togglePeriodicPopup(true)}
              ></i>
              {showPeriodicPopup && (
                <>
                  <div className={styles.popUp}>
                    <div className={styles.header}>
                      Zones
                      <i
                        className="eticon_cross"
                        onClick={() => togglePeriodicPopup(false)}
                      ></i>
                    </div>
                    <div className={styles.wrapper}>
                      <div className={styles.zone}>
                        <p className={styles.head}>
                          <span className={styles.low}></span>Low Zone
                        </p>
                        <p>
                          When a stock is trading at a value which is within 20%
                          of its Low range, it qualifies to be in the Periodic
                          Low Zone
                        </p>
                      </div>
                      <div className={styles.zone}>
                        <p className={styles.head}>
                          <span className={styles.mid}></span>Mid Zone
                        </p>
                        <p>
                          Stocks which are neither in the low nor in the high
                          zones in the specific time period.
                        </p>
                      </div>
                      <div className={styles.zone}>
                        <p className={styles.head}>
                          <span className={styles.high}></span>High Zone
                        </p>
                        <p>
                          When a stock is trading at a value which is within 20%
                          of its High range, it qualifies to be in the Periodic
                          High Zone
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.popUpOverlay}
                    onClick={() => togglePeriodicPopup(false)}
                  ></div>
                </>
              )}
            </div>
          )}
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

export default MarketMoodHeader;
