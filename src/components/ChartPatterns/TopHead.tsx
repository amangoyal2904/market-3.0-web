import { Suspense, useState } from "react";
import styles from "./TopHead.module.scss";
import Loader from "../Loader";
import BottomStickyFilter from "../BottomStickyFilter";
import { getPatternFilterData } from "@/app/stocks/chart-patterns/utilities";
import { fetchFilters } from "@/utils/utility";

type TopHeadProps = {
  payload: any;
  latestPatternRequestDto?: any;
  pageSummary?: any;
  pageType: string;
  handlePayloadChange: (updatedPayload: any) => void;
};

const TopHead: React.FC<TopHeadProps> = ({
  latestPatternRequestDto,
  pageType,
  payload,
  pageSummary,
  handlePayloadChange,
}) => {
  const [durationFilterShow, setDurationFilterShow] = useState(false);
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
  const [selectedDurationFilter, setSelectedDurationFilter] = useState({
    id: payload?.timeFrame || "1m",
    value:
      durationFilterOptions.find((option) => option.id === payload?.timeFrame)
        ?.value || "Last 1 Month",
  });

  const [patternFilterShow, setPatternFilterShow] = useState(false);
  const [patternFilterOptions, setPatternFilterOptions] = useState<any[]>([]);
  const [selectedPatternFilter, setSelectedPatternFilter] = useState({
    id: latestPatternRequestDto?.patternType || "bullish",
    value:
      latestPatternRequestDto?.patternName == "Bullish Patterns"
        ? "All Patterns"
        : latestPatternRequestDto?.patternName || "All Patterns",
  });

  const [indexFilterShow, setIndexFilterShow] = useState(false);
  const [indexFilterOptions, setIndexFilterOptions] = useState<any>({});
  const [selectedIndexFilter, setSelectedIndexFilter] = useState<any>({
    name: "All Stocks",
    indexId: 0,
    seoname: "",
    exchange: "nse",
  });

  // Track if pattern filter data has already been loaded
  const [isPatternDataLoaded, setIsPatternDataLoaded] = useState(false);
  const [isIndexDataLoaded, setIsIndexDataLoaded] = useState(false);

  const toggleBodyScroll = (shouldLock: boolean) => {
    document.body.style.overflow = shouldLock ? "hidden" : "";
  };

  const durationHandler = () => {
    setDurationFilterShow(true);
    toggleBodyScroll(true);
  };

  const patternHandler = async () => {
    try {
      if (!isPatternDataLoaded) {
        const data = await getPatternFilterData();
        setPatternFilterOptions(data);
        setIsPatternDataLoaded(true);
      }
      setPatternFilterShow(true);
      toggleBodyScroll(true);
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
      toggleBodyScroll(value);
    } catch (error) {
      console.error("Error fetching index filter data:", error);
    }
  };

  const handleDurationFilterChange = (key: string, value: string) => {
    const updatedPayload = {
      ...payload,
      pageNo: 1,
      pageSize: 10,
      timeFrame: key,
    };

    setSelectedDurationFilter({ id: key, value: value });
    handlePayloadChange(updatedPayload);
    handleBottomStickyFilterClose();
  };

  const handlePatternFilterChange = (key: string, value: string) => {
    const updatedPayload = {
      ...payload,
      pageNo: 1,
      pageSize: 10,
      patternType: key,
    };

    setSelectedPatternFilter({ id: key, value: value });
    handlePayloadChange(updatedPayload);
    handleBottomStickyFilterClose();
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
    handlePayloadChange({
      ...payload,
      pageNo: 1,
      pageSize: 10,
      filterValue: selectedFilter.indexId,
    });

    filterHandler(false);
  };

  const handleBottomStickyFilterClose = () => {
    setDurationFilterShow(false);
    setPatternFilterShow(false);
    toggleBodyScroll(false);
  };

  // Ensure childMenuTabActive is a string if it's an array
  const childMenuTabActive = Array.isArray(selectedIndexFilter.indexId)
    ? selectedIndexFilter.indexId[0]?.toString()
    : "0";

  return (
    <>
      <div className={`dflex align-item-center space-between ${styles.head}`}>
        {(pageType == "latestPattern" || pageType == "pastPatterns") && (
          <div className={styles.totalRecords}>
            {`${pageSummary?.totalRecords} Trading Ideas`}
          </div>
        )}
        {pageType == "past" && (
          <div className={styles.filterBtn} onClick={durationHandler}>
            <span className={styles.full}>{selectedDurationFilter.value}</span>
            <i className="eticon_caret_down"></i>
          </div>
        )}
        <div className={`dflex ${styles.endWithGap}`}>
          {pageType == "latestPattern" && (
            <div className={styles.filterBtn} onClick={patternHandler}>
              <span>{selectedPatternFilter.value}</span>
              <i className="eticon_caret_down"></i>
            </div>
          )}
          {pageType == "pastPatterns" && (
            <div className={styles.filterBtn} onClick={durationHandler}>
              <span>{selectedDurationFilter.value}</span>
              <i className="eticon_caret_down"></i>
            </div>
          )}
          <div className={styles.filterBtn} onClick={() => filterHandler(true)}>
            <span>{selectedIndexFilter.name}</span>
            <i className="eticon_caret_down"></i>
          </div>
        </div>
      </div>
      {durationFilterShow && (
        <Suspense fallback={<Loader loaderType="global" />}>
          <BottomStickyFilter
            onClose={handleBottomStickyFilterClose}
            heading="Patterns formed during"
            selectedFilter={selectedDurationFilter}
            filterOptions={durationFilterOptions}
            onFilterChange={handleDurationFilterChange}
            filterKey="id"
            filterLabelKey="value"
          />
        </Suspense>
      )}
      {patternFilterShow && (
        <Suspense fallback={<Loader loaderType="global" />}>
          <BottomStickyFilter
            onClose={handleBottomStickyFilterClose}
            heading="Select Pattern"
            selectedFilter={selectedPatternFilter}
            filterOptions={patternFilterOptions}
            onFilterChange={handlePatternFilterChange}
            filterKey="id"
            filterLabelKey="value"
          />
        </Suspense>
      )}
      {indexFilterShow && (
        <Suspense fallback={<Loader loaderType="global" />}></Suspense>
      )}
    </>
  );
};

export default TopHead;
