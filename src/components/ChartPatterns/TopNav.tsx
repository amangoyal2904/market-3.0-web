import { trackingEvent } from "@/utils/ga";
import styles from "./TopNav.module.scss";
import { Suspense, useEffect, useState } from "react";
import { getPatternFilterData } from "@/app/stocks/chart-patterns/utilities";
import { fetchFilters } from "@/utils/utility";
import CustomDropDown from "../Common/CustomDropdown";
import Loader from "../Loader";
import dynamic from "next/dynamic";

const StockFilterNifty = dynamic(
  () => import("@/components/StockFilterNifty"),
  {
    ssr: false,
  }
);

const tabData = [
  {
    key: "/stocks/chart-patterns",
    label: "New Patterns",
  },
  {
    key: "/stocks/chart-patterns/closed-patterns",
    label: "Closed Patterns",
  },
  {
    key: "/stocks/chart-patterns/past-performance",
    label: "Past Performance",
  },
  {
    key: "/stocks/chart-patterns/explore",
    label: "Explore by Patterns",
  },
];

interface TopNavProps {
  pageUrl: string;
  payload?: any;
  latestPatternRequestDto?: any;
  pageType?: string;
  handlePayloadChange?: (updatedPayload: any) => void;
}

const TopNav = ({
  pageUrl,
  latestPatternRequestDto,
  pageType = "",
  payload = {},
  handlePayloadChange = () => {},
}: TopNavProps) => {
  const durationFilterOptions = [
    {
      id: "1m",
      value: "Last 1 Month",
    },
    {
      id: "3m",
      value: "Last 3 Months",
    },
    {
      id: "6m",
      value: "Last 6 Months",
    },
  ];

  const defaultSelectedFilter = {
    id: payload?.timeFrame || "6m",
    value:
      durationFilterOptions.find((option) => option.id === payload?.timeFrame)
        ?.value || "Last 6 Months",
  };

  const selectedPatternFilter = {
    id: latestPatternRequestDto?.patternType || "bullish",
    value:
      latestPatternRequestDto?.patternName === "Bullish Patterns"
        ? "All Patterns"
        : latestPatternRequestDto?.patternName || "All Patterns",
  };

  const [indexFilterShow, setIndexFilterShow] = useState(false);
  const [indexFilterOptions, setIndexFilterOptions] = useState<any>({});
  const [selectedIndexFilter, setSelectedIndexFilter] = useState<any>({
    name: "All Stocks",
    indexId: 0,
    seoname: "",
    exchange: "nse",
  });

  const [isIndexDataLoaded, setIsIndexDataLoaded] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1100
  );

  const fetchPatternOptions = async () => {
    try {
      const data = await getPatternFilterData();
      return data;
    } catch (error) {
      console.error("Error fetching pattern filter data:", error);
    }
  };

  const filterHandler = async (value: boolean) => {
    try {
      if (!isIndexDataLoaded) {
        const data = await fetchFilters({ all: true });
        setIndexFilterOptions(data);
        setIsIndexDataLoaded(true);
      }
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      setIndexFilterShow(value);
    } catch (error) {
      console.error("Error fetching index filter data:", error);
    }
  };

  const handleDurationFilterChange = (key: string, value: string) => {
    const updatedPayload = {
      ...payload,
      pageNo: 1,
      pageSize: pageType === "past" ? 10 : 12,
      timeFrame: key,
    };

    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "duration_filter_applied",
      event_label: value,
    });
    handlePayloadChange(updatedPayload);

    // Check if past pattern page, then timeframe search param needs to be updated
    if (payload.sortBy === "closedPatternReturns") {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      if (key === "6m") {
        // Remove the `timeframe` parameter if `key` is "6m"
        params.delete("timeframe");
      } else {
        // Update the `timeframe` parameter if `key` is not "6m"
        params.set("timeframe", key);
      }

      // Push the updated URL to the browser history
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handlePatternFilterChange = (key: string, value: string) => {
    const updatedPayload = {
      ...payload,
      pageNo: 1,
      pageSize: pageType === "past" ? 10 : 12,
      patternType: key,
    };

    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "pattern_filter_applied",
      event_label: value,
    });

    handlePayloadChange(updatedPayload);
  };

  const handleIndexFilterChange = (
    id: any,
    name: string,
    selectedTab: string
  ) => {
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = {
      name: name,
      indexId: !!filter ? [filter] : [],
      seoname: "",
      exchange: selectedTab,
    };

    setSelectedIndexFilter(selectedFilter);

    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "indices_filter_applied",
      event_label: selectedFilter?.name,
    });

    handlePayloadChange({
      ...payload,
      pageNo: 1,
      pageSize: pageType === "past" ? 10 : 12,
      filterValue: selectedFilter.indexId,
    });

    filterHandler(false);
  };

  // Ensure childMenuTabActive is a string if it's an array
  const childMenuTabActive = Array.isArray(selectedIndexFilter.indexId)
    ? selectedIndexFilter.indexId[0]?.toString()
    : "0";

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isSmallScreen = screenWidth <= 1024;
  const showLimitedTabs =
    (pageType === "latest" ||
      pageType === "past" ||
      pageType === "past-pattern") &&
    isSmallScreen;

  const visibleTabs = showLimitedTabs ? tabData.slice(0, 2) : tabData;
  const hiddenTabs = showLimitedTabs ? tabData.slice(2) : [];

  const isActive = (tabKey: string): boolean => {
    // Match the base path /stocks/chart-patterns/past-performance and any dynamic segments first
    if (
      tabKey === "/stocks/chart-patterns/past-performance" &&
      pageUrl.startsWith("/stocks/chart-patterns/past-performance")
    ) {
      return true;
    }

    // Match the base path /stocks/chart-patterns/closed-patterns and any dynamic segments first
    if (
      tabKey === "/stocks/chart-patterns/closed-patterns" &&
      pageUrl.startsWith("/stocks/chart-patterns/closed-patterns")
    ) {
      return true;
    }

    // Exact match for /stocks/chart-patterns/explore
    if (tabKey === "/stocks/chart-patterns/explore" && pageUrl === tabKey) {
      return true;
    }
    // Match the base path /stocks/chart-patterns without past-performance or explore
    if (
      tabKey === "/stocks/chart-patterns" &&
      pageUrl.startsWith("/stocks/chart-patterns") &&
      !pageUrl.startsWith("/stocks/chart-patterns/past") &&
      !pageUrl.startsWith("/stocks/chart-patterns/closed") &&
      !pageUrl.startsWith("/stocks/chart-patterns/explore")
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div id={styles.l3Nav}>
        <div className={styles.l3ListWrapper}>
          {visibleTabs.map((item) => (
            <a
              key={item.key}
              href={item.key}
              className={`${styles.l3List} ${isActive(item.key) ? styles.active : ""}`}
              onClick={() => {
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "tab_selected",
                  event_label: `ChartPatterns_${item.label}`,
                });
              }}
              title={item.label}
            >
              {item.label}
            </a>
          ))}
          {hiddenTabs.length > 0 && (
            <div className={styles.moreTabWrap}>
              <div className={styles.moreSec}>
                <span>More</span>
                <span
                  className={`eticon_caret_down ${styles.moreCaretDown}`}
                ></span>
              </div>
              <div className={styles.moreListItem}>
                {hiddenTabs.map((item: any, index: number) => (
                  <a
                    key={item.key}
                    href={item.key}
                    className={`${styles.l3List} ${isActive(item.key) ? styles.active : ""}`}
                    onClick={() => {
                      trackingEvent("et_push_event", {
                        event_category: "mercury_engagement",
                        event_action: "tab_selected",
                        event_label: `ChartPatterns_${item.label}`,
                      });
                    }}
                    title={item.label}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.filtersContainer}>
          {(pageType === "past" || pageType === "past-pattern") && (
            <CustomDropDown
              selectedFilter={defaultSelectedFilter}
              filterOptions={durationFilterOptions}
              onFilterChange={handleDurationFilterChange}
              filterKey="id"
              filterLabelKey="value"
            />
          )}
          {pageType !== "" && (
            <div
              className={styles.filterBtn}
              onClick={() => filterHandler(true)}
            >
              <i className="eticon_filter"></i>
              <span>{selectedIndexFilter.name}</span>
            </div>
          )}
          {(pageType === "latest" || pageType === "past-pattern") && (
            <CustomDropDown
              selectedFilter={selectedPatternFilter}
              filterOptions={[selectedPatternFilter]}
              onFilterChange={handlePatternFilterChange}
              fetchOptions={fetchPatternOptions}
              filterKey="id"
              filterLabelKey="value"
            />
          )}
        </div>
      </div>

      {indexFilterShow && (
        <Suspense fallback={<Loader loaderType="global" />}>
          <StockFilterNifty
            data={indexFilterOptions}
            onclick={filterHandler}
            showFilter={indexFilterShow}
            valuechange={handleIndexFilterChange}
            selectTab={selectedIndexFilter.exchange}
            childMenuTabActive={childMenuTabActive}
          />
        </Suspense>
      )}
    </>
  );
};

export default TopNav;
