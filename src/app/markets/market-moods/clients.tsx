"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./MarketMoods.module.scss";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MarketMoodHeader from "@/components/MarketMood/SectionHeader";
import FixedTableMarketMood from "@/components/MarketMood/FixedTable";
import ScrollableTableMarketMood from "@/components/MarketMood/ScrollableTable";
import ScrollableBarsTableMarketMood from "@/components/MarketMood/ScrollableBarsTable";
import { APP_ENV, initSSOWidget } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";
import {
  faqData,
  tabData,
  payWallMarketMood,
} from "@/components/MarketMood/config";
import MarketMoodTabConfig from "@/components/MarketMood/tabConfig.json";
import {
  fetchSelectedFilter,
  getAdvanceDeclineData,
  getPeriodicData,
} from "@/utils/utility";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useStateContext } from "@/store/StateContext";
import Blocker from "@/components/Blocker";
import dynamic from "next/dynamic";
import useDebounce from "@/hooks/useDebounce";
import { goToPlansPage } from "@/utils/ga";

const StockFilterNifty = dynamic(
  () => import("@/components/StockFilterNifty"),
  { ssr: false },
);

const MarketMoodsClient = ({
  selectedFilter = {},
  overview = {},
  advanceDecline = {},
  periodic = {},
  allFilters = {},
}: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime = true } = state.login;
  const { countPercentage, duration, monthlyDaily } = state.MarketMoodStatus;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [overviewData, setOverviewData] = useState<any>(overview);
  const [advanceDeclineData, setAdvanceDeclineData] =
    useState<any>(advanceDecline);
  const [periodicData, setPeriodicData] = useState<any>(periodic);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllOverview, setShowAllOverview] = useState<boolean>(false);
  const [showAllAdvanceDecline, setShowAllAdvanceDecline] =
    useState<boolean>(false);
  const [showAllPeriodic, setShowAllPeriodic] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");
  const [activeItemFromClick, setActiveItemFromClick] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const contentRefs = useRef<HTMLDivElement>(null);
  const activeListItemRef = useRef<HTMLLIElement>(null);
  const niftyFilterData = useMemo(() => selectedFilter, [selectedFilter]);
  const allFilterData = useMemo(() => allFilters, [allFilters]);
  const { debounce } = useDebounce();
  const updatePeriodic = async (duration: string) => {
    const newPeriodicData = await getPeriodicData(
      niftyFilterData.indexId,
      duration,
      1,
    );
    setPeriodicData(newPeriodicData);
  };

  const updateAdvanceDecline = async (monthlyDaily: string) => {
    const newAdvanceDeclineData = await getAdvanceDeclineData(
      niftyFilterData.indexId,
      monthlyDaily,
      1,
    );
    setAdvanceDeclineData(newAdvanceDeclineData);
  };

  const scrollToActiveContent = useCallback(() => {
    const element = document.getElementById(activeItem!);
    if (element) {
      const offset = element.offsetTop + 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [activeItem]);

  const filterDataChangeHander = async (id: any) => {
    setLoading(true);
    setShowFilter(false);
    const selectedFilter = await fetchSelectedFilter(id);
    const newUrl = "/markets/market-moods/" + selectedFilter.seoname;
    router.prefetch(newUrl);
    router.push(newUrl, { scroll: false });
  };

  const handleItemClick = useCallback((item: string) => {
    setActiveItemFromClick(item); // Set the state to indicate that active tab change is due to click
    setActiveItem(item);
  }, []);

  const handleCountPercentage = useCallback((widgetType: string) => {
    dispatch({
      type: "UPDATE_VIEWTYPES",
      payload: {
        countPercentage: widgetType,
      },
    });
  }, []);

  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  const handleDuration = useCallback(
    async (item: string) => {
      setLoading(true);
      dispatch({
        type: "UPDATE_VIEWTYPES",
        payload: {
          duration: item,
        },
      });
      updatePeriodic(item);
      setLoading(false); // Set loading to false after data is fetched
    },
    [niftyFilterData],
  );

  const handleMonthlyDaily = useCallback(
    async (item: string) => {
      dispatch({
        type: "UPDATE_VIEWTYPES",
        payload: {
          monthlyDaily: item,
        },
      });
      updateAdvanceDecline(item);
    },
    [niftyFilterData],
  );

  const loadMoreData = useCallback(
    async (type: string) => {
      switch (type) {
        case "overview":
          setShowAllOverview(!showAllOverview);
          if (!showAllOverview) {
            setActiveItem("overview");
          }
          break;
        case "advanceDecline":
          setShowAllAdvanceDecline(!showAllAdvanceDecline);
          if (!showAllAdvanceDecline) {
            setActiveItem("advanceDecline");
          }
          break;
        case "periodic":
          setShowAllPeriodic(!showAllPeriodic);
          if (!showAllPeriodic) {
            setActiveItem("periodic");
          }
          break;
        default:
          break;
      }

      if (
        (type === "overview" && showAllOverview) ||
        (type === "advanceDecline" && showAllAdvanceDecline) ||
        (type === "periodic" && showAllPeriodic)
      ) {
        setTimeout(() => {
          const element = document.getElementById(type);

          if (element) {
            const offset = element.offsetTop + 120;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }, 100);
      }
    },
    [showAllOverview, showAllAdvanceDecline, showAllPeriodic],
  );

  useEffect(() => {
    const handleScroll = debounce(() => {
      const contentRefs = document.querySelectorAll(".sections");
      const scrollPosition = window.scrollY;

      contentRefs.forEach((ref) => {
        const section = ref as HTMLElement;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveItem(section.id);
        }
      });
    }, 10);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [debounce]);

  useEffect(() => {
    // Scroll to the active item's content when activeItem changes
    if (activeItemFromClick) {
      scrollToActiveContent();
      setActiveItemFromClick("");
    }
  }, [activeItemFromClick, scrollToActiveContent]);

  useEffect(() => {
    if (duration != "1M") {
      updatePeriodic(duration);
    }
    if (monthlyDaily != "daily") {
      updateAdvanceDecline(monthlyDaily);
    }
    window.scrollTo(0, 0);
    setLoading(false);
  }, [pathname, searchParams]);

  return (
    <>
      <div className={styles.logo}>
        <div className={styles.icon}>
          <span className="eticon_prime_logo">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </span>
        </div>
        <div className={styles.prime}>ETPrime</div>
        <h1 className={styles.heading}>MarketMood</h1>
      </div>
      <p className={styles.desc}>
        Know the market sentiments. Check the percentage or count of stocks in
        the selected index with value above the technical indicators.
      </p>

      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {tabData.map((item: any, index: number) => {
            return (
              <li
                key={item.key}
                ref={activeItem === item.key ? activeListItemRef : null}
                onClick={() => handleItemClick(item.key)}
                className={
                  activeItem === item.key || (activeItem === "" && index === 0)
                    ? styles.active
                    : ""
                }
              >
                {item.label}
              </li>
            );
          })}
        </ul>
        {isPrime && (
          <span
            className={`${styles.roundBtn} ${styles.filterNseBse}`}
            onClick={() => showFilterMenu(true)}
          >
            <i className="eticon_filter"></i> {niftyFilterData?.name}
          </span>
        )}
      </div>
      <div className={`${styles.wrapper} ${!isPrime ? styles.center : ""}`}>
        {loading && <Loader loaderType="container" />}
        {!isPrime ? (
          <>
            {payWallMarketMood.map((item: any, index: number) => (
              <div
                key={index}
                id={item.key}
                className={`${styles.section} sections`}
                ref={contentRefs}
              >
                {item.heading && (
                  <div className={styles.header}>
                    <div className={styles.head}>{item.heading}</div>
                  </div>
                )}
                <Image
                  src={item.img}
                  width={792}
                  height={370}
                  alt={`Market Moods ${item.heading}`}
                  loading="lazy"
                />
                <p className={styles.title}>{item.title}</p>
                <p className={styles.desc}>{item.desc}</p>
                <div className={styles.plan}>
                  <span className={styles.subscribeBtn} onClick={goToPlansPage}>
                    Subscribe Now
                  </span>
                  {!isLogin && (
                    <p className={styles.defaultLink}>
                      Already a Member?
                      <span
                        data-ga-onclick="ET Login#Signin - Sign In - Click#ATF - url"
                        onClick={initSSOWidget}
                      >
                        Sign In now
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div
              id="overview"
              className={`${styles.section} sections`}
              ref={contentRefs}
            >
              <MarketMoodHeader
                heading="Overview"
                niftyFilterData={niftyFilterData}
                config={MarketMoodTabConfig["overview"]}
                countPercentage={countPercentage}
                handleCountPercentage={handleCountPercentage}
              />

              {overviewData?.dataList?.length > 0 ? (
                <>
                  <div className={styles.tableWrapper}>
                    <FixedTableMarketMood
                      tableData={overviewData?.dataList}
                      extraHeader="true"
                      showAll={showAllOverview}
                      type="overview"
                    />
                    <ScrollableTableMarketMood
                      tableHeader={overviewData?.labels}
                      tableData={overviewData?.dataList}
                      type={countPercentage}
                      showAll={showAllOverview}
                    />
                  </div>
                  {overviewData?.dataList?.length > 13 && (
                    <div
                      id="overview-load-more"
                      className={styles.loadMore}
                      onClick={() => loadMoreData("overview")}
                    >
                      {showAllOverview ? "Load Less..." : "Load More..."}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
            </div>
            <div
              id="periodic"
              className={`${styles.section} sections`}
              ref={contentRefs}
            >
              <MarketMoodHeader
                heading="Periodic High/Low"
                niftyFilterData={niftyFilterData}
                config={MarketMoodTabConfig["periodic"]}
                duration={duration}
                handleDuration={handleDuration}
              />

              {periodicData?.dataList?.length > 0 ? (
                <>
                  <div className={styles.tableWrapper}>
                    <FixedTableMarketMood
                      tableData={periodicData?.dataList}
                      showAll={showAllPeriodic}
                      type="periodic"
                    />
                    <ScrollableBarsTableMarketMood
                      tableData={periodicData?.dataList}
                      type="periodic"
                      showAll={showAllPeriodic}
                    />
                  </div>
                  {periodicData?.dataList?.length > 13 && (
                    <div
                      id="periodic-load-more"
                      className={styles.loadMore}
                      onClick={() => loadMoreData("periodic")}
                    >
                      {showAllPeriodic ? "Load Less..." : "Load More..."}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
            </div>
            <div
              id="advanceDecline"
              className={`${styles.section} sections`}
              ref={contentRefs}
            >
              <MarketMoodHeader
                heading="Advance/Decline"
                niftyFilterData={niftyFilterData}
                config={MarketMoodTabConfig["advanceDecline"]}
                monthlyDaily={monthlyDaily}
                handleMonthlyDaily={handleMonthlyDaily}
              />

              {advanceDeclineData?.dataList?.length > 0 ? (
                <>
                  <div className={styles.tableWrapper}>
                    <FixedTableMarketMood
                      tableData={advanceDeclineData?.dataList}
                      showAll={showAllAdvanceDecline}
                      type="advanceDecline"
                    />
                    <ScrollableBarsTableMarketMood
                      tableData={advanceDeclineData?.dataList}
                      type="advanceDecline"
                      showAll={showAllAdvanceDecline}
                    />
                  </div>
                  {advanceDeclineData?.dataList?.length > 13 && (
                    <div
                      id="advanceDecline-load-more"
                      className={styles.loadMore}
                      onClick={() => loadMoreData("advanceDecline")}
                    >
                      {showAllAdvanceDecline ? "Load Less..." : "Load More..."}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
            </div>
          </>
        )}
        <div id="faq" className={`${styles.faq} sections`} ref={contentRefs}>
          <div className={styles.head}>Frequently Asked Questions</div>
          {faqData.map((item: any, index: number) => {
            return (
              <div className={styles.faqItem} key={index}>
                <p className={styles.ques}>{item.ques}</p>
                <p className={styles.ans}>{item.ans}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showFilter && (
        <StockFilterNifty
          data={allFilterData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={filterDataChangeHander}
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
    </>
  );
};

export default MarketMoodsClient;
