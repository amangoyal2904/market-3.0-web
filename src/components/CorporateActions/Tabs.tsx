import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import StockFilterNifty from "../StockFilterNifty";
import CustomDropdown from "../Common/CustomDropdown";
import { trackingEvent } from "@/utils/ga";
import styles from "./styles.module.scss";

interface TabItem {
  label: string;
  key: string;
}

interface FilterData {
  name: string;
  indexId: string | number;
  seoname: string;
  exchange: string;
}

interface CorporateActionsTabsProps {
  setNiftyFilterData: (data: FilterData) => void;
  selectedFilter: {
    name: string;
    indexId: string | number;
    exchange: string;
  };
  activeTab: string;
  niftyData: any; // Consider typing this based on your data structure
  setFilters: React.Dispatch<React.SetStateAction<any>>; // Consider typing this based on your filter structure
}

const tabData: TabItem[] = [
  { label: "Dividend", key: "dividend" },
  { label: "Bonus", key: "bonus" },
  { label: "Board Meetings", key: "board-meetings" },
  { label: "AGM/EGM", key: "agm-egm" },
  { label: "Splits", key: "splits" },
  { label: "Rights", key: "rights" },
];

const overviewOptions: TabItem[] = [
  { label: "All Time", key: "default" },
  { label: "Upcoming", key: "u" },
  { label: "1 Week", key: "1w" },
  { label: "1 Month", key: "1m" },
  { label: "3 Month", key: "3m" },
  { label: "6 Month", key: "6m" },
  { label: "1 Year", key: "1y" },
];

const CorporateActionseTabs = React.memo(
  ({
    setNiftyFilterData,
    selectedFilter,
    niftyData,
    setFilters,
    activeTab,
  }: CorporateActionsTabsProps) => {
    const [showFilter, setShowFilter] = useState(false);
    const allFilterData = useMemo(() => niftyData, [niftyData]);
    const onDurationChange = useCallback(
      (duration: string) => {
        setFilters((prevState: any) => ({
          ...prevState,
          duration,
        }));
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: `click_${duration}`,
          event_label: duration,
        });
      },
      [setFilters],
    );

    const showFilterMenu = useCallback((value: boolean) => {
      setShowFilter(value);
    }, []);

    const filterDataChangeHander = useCallback(
      async (id: string | number, name: string, selectedTab: string) => {
        setFilters((prevState: any) => ({
          ...prevState,
          filterValue: id,
        }));
        setShowFilter(false);
        setNiftyFilterData({
          name,
          indexId: id,
          seoname: name,
          exchange: selectedTab,
        });
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: `click_${name}`,
          event_label: `${name}_${id}`,
        });
      },
      [setFilters, setNiftyFilterData],
    );

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
                href={`/markets/corporate-actions${item.key === "overview" ? "" : `/${item.key}`}`}
                onClick={() => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "tab_selected",
                    event_label: `${item.label}`,
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
              role="button"
              tabIndex={0}
            >
              <i className="eticon_filter" aria-hidden="true"></i>{" "}
              {selectedFilter?.name}
            </span>
          </div>
          {showFilter && (
            <StockFilterNifty
              childMenuTabActive={selectedFilter.indexId}
              valuechange={filterDataChangeHander}
              selectTab={selectedFilter.exchange}
              onclick={showFilterMenu}
              showFilter={showFilter}
              data={allFilterData}
            />
          )}
          <CustomDropdown
            onFilterChange={onDurationChange}
            filterOptions={overviewOptions}
            filterLabelKey="label"
            filterKey="key"
          />
        </div>
      </div>
    );
  },
);

CorporateActionseTabs.displayName = "CorporateActionseTabs";
export default CorporateActionseTabs;
