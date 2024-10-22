import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import CustomDropdown from "../CustomDropdown";
import StockFilterNifty from "../StockFilterNifty";

const tabData = [
  { label: "Dividend", key: "dividend" },
  { label: "Bonus", key: "bonus" },
  { label: "Board Meetings", key: "board-meetings" },
  { label: "AGM/EGM", key: "agm-egm" },
  { label: "Splits", key: "splits" },
  { label: "Rights", key: "rights" },
];

const overviewOptions = [
  { label: "All Time", key: "default" },
  { label: "Upcoming", key: "upcoming" },
  { label: "1 Week", key: "1week" },
  { label: "1 Month", key: "month" },
  { label: "3 Month", key: "3month" },
  { label: "6 Month", key: "6month" },
  { label: "1 Year", key: "year" },
];

const CorporateActionseTabs = React.memo(
  ({
    activeTab,
    allFilters,
    selectedFilter,
    overview,
    setNiftyFilterData,
    setFilters,
    advanceDecline,
    periodic,
  }: {
    activeTab: string;
    allFilters: any;
    selectedFilter: any;
    overview: any;
    setNiftyFilterData: any;
    setFilters: any;
    advanceDecline: any;
    periodic: any;
  }) => {
    const [showFilter, setShowFilter] = useState(false);
    const allFilterData = useMemo(() => allFilters, [allFilters]);
    const onDurationChange = (duration: string) => {
      setFilters((prevState: any) => ({
        ...prevState,
        duration,
      }));
    };

    const showFilterMenu = useCallback((value: boolean) => {
      setShowFilter(value);
    }, []);

    const filterDataChangeHander = async (
      id: any,
      name: string,
      selectedTab: string,
    ) => {
      setFilters((prevState: any) => ({
        ...prevState,
        filterType: id,
      }));
      setShowFilter(false);
      setNiftyFilterData({
        name: name,
        indexId: id,
        seoname: name,
        exchange: selectedTab,
      });
    };

    return (
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {tabData.map((item) => (
            <li
              key={item.key}
              className={`${styles.tabItem} ${
                activeTab === item.key ? styles.active : ""
              }`}
            >
              <Link
                title={item.label}
                href={
                  item.key === "overview"
                    ? "/markets/corporate-actions"
                    : `/markets/corporate-actions/${item.key}`
                }
                onClick={(e) => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "tab_selected",
                    event_label: `FIIDII_${item.label}`,
                  });
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.flex}>
          <div className={styles.marginlr10}>
            <span
              className={`${styles.roundBtn} ${styles.filterNseBse}`}
              onClick={() => showFilterMenu(true)}
            >
              <i className="eticon_filter"></i> {selectedFilter?.name}
            </span>
          </div>
          {showFilter && (
            <StockFilterNifty
              data={allFilterData}
              onclick={showFilterMenu}
              showFilter={showFilter}
              valuechange={filterDataChangeHander}
              selectTab={selectedFilter.exchange}
              childMenuTabActive={selectedFilter.indexId}
            />
          )}
          <CustomDropdown
            onFilterChange={onDurationChange}
            filterOptions={overviewOptions}
            filterKey="key"
            filterLabelKey="label"
          />
        </div>
      </div>
    );
  },
);

CorporateActionseTabs.displayName = "CorporateActionseTabs";
export default CorporateActionseTabs;
