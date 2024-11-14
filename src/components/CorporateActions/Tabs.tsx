import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import StockFilterNifty from "../StockFilterNifty";
import CustomDropdown from "../Common/CustomDropdown";
import { trackingEvent } from "@/utils/ga";
import styles from "./styles.module.scss";

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
  }: {
    setNiftyFilterData: any;
    selectedFilter: any;
    activeTab: string;
    niftyData: any;
    setFilters: any;
  }) => {
    const [showFilter, setShowFilter] = useState(false);
    const allFilterData = useMemo(() => niftyData, [niftyData]);
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
        filterValue: id,
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
      <>
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
      </>
    );
  },
);

CorporateActionseTabs.displayName = "CorporateActionseTabs";
export default CorporateActionseTabs;
