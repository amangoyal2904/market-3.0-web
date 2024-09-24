import styles from "./style.module.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { APP_ENV } from "../../../utils";
import APIS_CONFIG from "../../../network/api_config.json";
import StockFilterNifty from "@/components/StockFilterNifty";
import { fetchFilters, fetchSelectedFilter } from "@/utils/utility";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../utils/screeners";
import Link from "next/link";

import { getStockUrl } from "@/utils/utility";
import useDebounce from "@/hooks/useDebounce";

const latestResult = [
  { title: "Latest Results", value: "latest-results" },
  { title: "Sales Gainers", value: "sales-gainers" },
  { title: "Sales Losers", value: "sales-losers" },
  { title: "Profit Gainers", value: "profit-gainers" },
  { title: "Profit Losers", value: "profit-losers" },
];

const UpcomingResults = ({
  tabData,
  selectedFilter,
  niftyFilter = "no",
  searchFilter = "no",
  latestFilter = "no",
  title = "",
  activeResultValue = "",
  setActiveResultHandler,
  type = "",
  upcomingResultTableHandler,
  niftyFIlterHandler,
  showLeftNavigation = "yes",
  bigSearchShow = "no",
  topTabTimeHide = "no",
  showResultTopTxt = "no",
  pageSummary = {},
  queryTitle,
}: any) => {
  const dateListRef = useRef<HTMLUListElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { debounce } = useDebounce();
  const _activeResult = latestResult.find(
    (result) => result.value === activeResultValue,
  );
  const _activeRetustText = _activeResult
    ? _activeResult.title
    : "No result found";
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [showLatestFilterMenu, setShowLatestFilterMenu] = useState(false);
  const latestFilterRef = useRef<HTMLDivElement>(null); // Explicitly define the type
  const [queryResultData, setQueryResultData]: any[] = useState([]);
  const [query, setQuery] = useState(queryTitle);
  const searchRef = useRef<HTMLDivElement>(null);
  const [_payload, setPayload]: any = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectToSelfPage = () => {
    // setQuery("");
    // setQueryResultData([]);
    //router.push(pathname);
    window.location.href = pathname;
  };
  const queryChangeHandler = (e: any) => {
    const _q = e.target.value;
    setQuery(_q);
    debounceFetchData(_q);
  };
  const fetchData = async (_q: string) => {
    console.log("Fetching data for:", _q);
    const API_URL = (APIS_CONFIG as any)?.EARNINGS_SEARCH[APP_ENV];
    const _searchQuery = `?matchCompanyName=true&realstate=false&dvr=false&idr=false&trust=false&mcx=false&mf=false&nps=false&insideet=false&detail=false&forex=false&index=false&mecklai=false&etf=false&nonList=false&forETGraph=false&pagesize=5&outputtype=json&pp=false&earningsFlag=true&ticker=${_q}`;
    // const response: any[] = await commonGetAPIHandler(
    //   `EARNINGS_SEARCH`,
    //   _searchQuery,
    // );
    // response && response.length > 0
    //   ? setQueryResultData([...response])
    //   : setQueryResultData([]);
    // const resData = await fetch(`${API_URL}${_searchQuery}`)
    // const data = await resData.json();
    // console.log("___serch data ", data)
    try {
      const resData = await fetch(`${API_URL}${_searchQuery}`);
      if (!resData.ok) {
        throw new Error(`Error: ${resData.status}`);
      }
      const data = await resData.json();
      if (data && data.length > 0) {
        setQueryResultData([...data]);
      } else {
        setQueryResultData([]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setQueryResultData([]);
    }
  };
  const debounceFetchData = debounce(fetchData, 500);
  const handleClickOutsideSearch = (event: any) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setQueryResultData([]);
      setQuery("");
    }
  };

  const handleClickOutside = (event: any) => {
    if (
      latestFilterRef.current &&
      !latestFilterRef.current.contains(event.target)
    ) {
      setShowLatestFilterMenu(false);
    }
  };
  const handlerClickLatestResultFilter = (value: string) => {
    setActiveResultHandler(value);
    setShowLatestFilterMenu(false);
  };
  const getDateFormate = (value: any) => {
    if (value && value !== "") {
      const date = new Date(value);
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
      };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date,
      );
      return formattedDate;
    }
    return "";
  };
  const getResultFormate = (value: any) => {
    return value === 1 || value === 0 ? `${value} Result` : `${value} Results`;
  };
  const tabClickHandler = (tabIndex: number, date: any) => {
    setActiveTab(tabIndex);
    upcomingResultTableHandler(date, type);
  };
  const scrollLeft = () => {
    if (dateListRef.current) {
      dateListRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (dateListRef.current) {
      dateListRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };
  const showFilterMenu = (value: boolean) => {
    console.log("______valuye", value);
    setShowFilter(value);
  };
  const filterApiCall = async () => {
    const data = await fetchFilters({ all: true, marketcap: true });
    setFilterMenuData(data);
  };
  const handleChangeData = async (
    id: any,
    name: string,
    selectedTab: string,
  ) => {
    setShowFilter(false);
    //filterDataChange(id, name, selectedTab);
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const __id = filter === 0 ? [] : [filter];

    const __selectedFilter = await fetchSelectedFilter(filter);
    console.log("__fitler seclected ", { __id, filter, __selectedFilter });
    setNiftyFilterData(__selectedFilter);
    niftyFIlterHandler(type, __selectedFilter);
    //setPayload({ ..._payload, filterValue: __id, pageNo: 1 });
  };
  const formatUnixTimestamp = (unixTimestamp: any): string => {
    const _unixTime = Number(unixTimestamp);
    const date = new Date(_unixTime);
    console.log(_unixTime);
    if (isNaN(date.getTime())) {
      return "";
    }
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    //return `${hours}:${minutes} ${ampm} | ${day} ${month} ${year}`;
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    filterApiCall();
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (dateListRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = dateListRef.current;
        setIsLeftDisabled(scrollLeft === 0);
        setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth);
      }
    };

    if (dateListRef.current) {
      dateListRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (dateListRef.current) {
        dateListRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [tabData]);

  return (
    <>
      <div className={styles.upComingWrap}>
        <div className={styles.topHead}>{title}</div>
        <div
          className={`${styles.topTabsSec} ${bigSearchShow === "yes" ? styles.fullWidthInput : ""}`}
        >
          {showLeftNavigation === "yes" && topTabTimeHide === "no" ? (
            <div className={styles.tabListItemSec}>
              <ul ref={dateListRef} className={styles.dateList}>
                {tabData && tabData.length > 0
                  ? tabData.map((item: any, index: number) => {
                      const dateFieldSec =
                        index === 0 && type === "upcoming"
                          ? "Today"
                          : getDateFormate(item?.date);
                      //const dateFieldSec =  getDateFormate(item?.date)
                      return (
                        <li
                          key={`tab-${index}-${item?.date}`}
                          className={`${activeTab === index ? styles.active : ""}`}
                          onClick={() => tabClickHandler(index, item?.date)}
                        >
                          <span className={styles.topTxt}>{dateFieldSec}</span>
                          <span className={styles.btnTxt}>
                            {getResultFormate(item?.companyCount)}
                          </span>
                        </li>
                      );
                    })
                  : ""}
              </ul>
              {tabData && tabData.length > 4 && (
                <div className={styles.arrowsec}>
                  <span
                    className={`${styles.arrow} ${styles.arrowLeft} ${isLeftDisabled ? styles.disabled : ""}`}
                    onClick={!isLeftDisabled ? scrollLeft : undefined}
                  ></span>
                  <span
                    className={`${styles.arrow} ${styles.arrowRight} ${isRightDisabled ? styles.disabled : ""}`}
                    onClick={!isRightDisabled ? scrollRight : undefined}
                  ></span>
                </div>
              )}
            </div>
          ) : topTabTimeHide === "yes" &&
            showLeftNavigation === "yes" &&
            showResultTopTxt === "yes" ? (
            <div>
              <span className={styles.showingResult}>
                Showing <strong>{pageSummary?.totalRecords}</strong> results
              </span>
            </div>
          ) : (
            ""
          )}

          <div className={styles.rightSecItem}>
            {latestFilter === "yes" ? (
              <>
                <div className={styles.latestFilter} ref={latestFilterRef}>
                  <div
                    className={styles.filterTxt}
                    onClick={() => setShowLatestFilterMenu(true)}
                  >
                    {_activeRetustText}
                  </div>
                  {showLatestFilterMenu ? (
                    <ul className={styles.itemList}>
                      {latestResult.map((item: any, index: number) => {
                        return (
                          <li
                            key={`${index}-${item.value}`}
                            className={
                              item.value === activeResultValue
                                ? styles.active
                                : ""
                            }
                            onClick={() =>
                              handlerClickLatestResultFilter(item.value)
                            }
                          >
                            {item.title}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            {searchFilter === "yes" ? (
              <>
                <div className={`${styles.searchWrap}`} ref={searchRef}>
                  <div className={styles.fromGroup}>
                    <span
                      className={`eticon_search ${styles.searchIcon}`}
                    ></span>
                    <input
                      className={styles.inputStyle}
                      type="text"
                      placeholder={`${type === "upcoming" ? "Search Upcoming results" : type === "declared" ? "Search Declared results" : ""}`}
                      value={query}
                      onChange={queryChangeHandler}
                    />
                    <span
                      className={`${styles.searchCloseBtn}`}
                      onClick={redirectToSelfPage}
                    ></span>
                  </div>
                  {queryResultData && queryResultData.length > 0 ? (
                    <>
                      <div className={styles.searchListWrap}>
                        <ul>
                          {queryResultData.map((item: any, index: number) => {
                            const linkGenrate =
                              item?.resultStatus === "UPCOMING"
                                ? `/markets/stocks/earnings/upcoming-results?companyid=${item?.tagId}`
                                : item?.resultStatus === "DECLARED"
                                  ? `/markets/stocks/earnings/declared-results/latest?companyid=${item?.tagId}`
                                  : item?.resultStatus === "PENDING"
                                    ? `/markets/stocks/earnings/upcoming-results?companyid=${item?.tagId}`
                                    : "";
                            return (
                              <li key={`${index}-${item?.tagId}`}>
                                <Link
                                  href={linkGenrate}
                                  className={styles.resWrap}
                                  onClick={() => setQueryResultData([])}
                                >
                                  <div className={styles.resLeft}>
                                    <div className={styles.comTxt}>
                                      <span className={styles.comLink}>
                                        {item?.tagName}
                                      </span>
                                    </div>
                                    <div className={styles.dateTxt}>
                                      {formatUnixTimestamp(item?.resultDate)}
                                    </div>
                                  </div>
                                  <div className={styles.resRight}>
                                    <span
                                      className={`${styles.resWrapDec} ${item?.resultStatus === "DECLARED" ? styles.decl : styles.upcl}`}
                                    >
                                      {item?.resultStatus}
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}
            {niftyFilter === "yes" ? (
              <>
                <span
                  className={`${styles.roundBtn} ${styles.filterNseBse}`}
                  onClick={() => showFilterMenu(true)}
                >
                  <i className={`eticon_filter ${styles.mr}`}></i>{" "}
                  {niftyFilterData?.name || "Rohit Nifty"}
                </span>
              </>
            ) : (
              ""
            )}
          </div>
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

export default UpcomingResults;
