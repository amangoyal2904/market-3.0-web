import { trackingEvent } from "@/utils/ga";
import styles from "./TopNav.module.scss";
import Link from "next/link";
import { Suspense, useState } from "react";
import { getPatternFilterData } from "@/app/stocks/chart-patterns/utilities";
import { fetchFilters } from "@/utils/utility";
import CustomDropDown from "../CustomDropdown";
import Loader from "../Loader";
import dynamic from "next/dynamic";

const StockFilterNifty = dynamic(
  () => import("@/components/StockFilterNifty"),
  {
    ssr: false,
  },
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
    selectedTab: string,
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
      <div className="dflex align-item-center" id={styles.l3Nav}>
        <div className={styles.l3ListWrapper}>
          {tabData.map((item) => (
            <Link
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
            </Link>
          ))}
        </div>
        <div className={styles.filtersContainer}>
          {(pageType === "past" || pageType === "past-pattern") && (
            <CustomDropDown
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
