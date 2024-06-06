"use client";
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
import { initSSOWidget } from "@/utils";
import {
  faqData,
  tabData,
  payWallMarketMood,
} from "@/components/MarketMood/config";
import MarketMoodTabConfig from "@/components/MarketMood/tabConfig.json";
import {
  encodeHTML,
  fetchSelectedFilter,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import Loader from "@/components/Loader";
import Image from "next/image";
import { useStateContext } from "@/store/StateContext";
import Blocker from "@/components/Blocker";
import dynamic from "next/dynamic";
import useDebounce from "@/hooks/useDebounce";
import { redirectToPlanPage, trackingEvent } from "@/utils/ga";

const StockFilterNifty = dynamic(
  () => import("@/components/StockFilterNifty"),
  { ssr: false },
);

const overviewList = (
  <ul className={styles.paywalledList}>
    <li>
      <strong>Track Performance:</strong> Monitor short & long term market
      performance using SMA & EMA.
    </li>
    <li>
      <strong>Identify Phases:</strong> Effortlessly determine if the market is
      bullish or bearish.
    </li>
  </ul>
);
const periodicList = (
  <ul className={styles.paywalledList}>
    <li className={styles.high}>
      <strong>High Zone:</strong> Stocks trading within 20% of their respective
      High Range
    </li>
    <li className={styles.mid}>
      <strong>Mid Zone:</strong> Stocks in Neutral Range
    </li>
    <li>
      <strong>Low Zone:</strong> Stocks Trading within 20% of their respective
      Low Range
    </li>
  </ul>
);

const MarketMoodsClient = ({
  selectedFilter = {},
  overview = {},
  advanceDecline = {},
  periodic = {},
  allFilters = {},
}: any) => {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const [activeFaqs, setActiveFaqs] = useState<number[]>([0]);
  const [countPercentage, setCountPercentage] = useState("percentage");
  const [duration, setDuration] = useState("1M");
  const [monthlyDaily, setMonthlyDaily] = useState("daily");
  const [overviewData, setOverviewData] = useState<any>(overview);
  const [advanceDeclineData, setAdvanceDeclineData] =
    useState<any>(advanceDecline);
  const [periodicData, setPeriodicData] = useState<any>(periodic);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllOverview, setShowAllOverview] = useState<boolean>(false);
  const [showAllAdvanceDecline, setShowAllAdvanceDecline] =
    useState<boolean>(false);
  const [showAllPeriodic, setShowAllPeriodic] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");
  const [activeItemFromClick, setActiveItemFromClick] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const contentRefs = useRef<HTMLDivElement>(null);
  const activeListItemRef = useRef<HTMLLIElement>(null);
  const allFilterData = useMemo(() => allFilters, [allFilters]);
  const { debounce } = useDebounce();

  const fetchData = async (indexId: number) => {
    return Promise.all([
      getOverviewData(indexId, 1),
      getAdvanceDeclineData(indexId, monthlyDaily, 1),
      getPeriodicData(indexId, duration, 1),
    ]);
  };

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
      const pos = !!isPrime ? 100 : 220;
      const offset = element.offsetTop + pos;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [activeItem]);

  const filterDataChangeHander = async (id: any) => {
    setLoading(true);
    setShowFilter(false);
    const selectedFilter = await fetchSelectedFilter(id);
    const [overviewData, advanceDeclineData, periodicData] = await fetchData(
      selectedFilter.indexId,
    );
    setNiftyFilterData(selectedFilter);
    setOverviewData(overviewData);
    setAdvanceDeclineData(advanceDeclineData);
    setPeriodicData(periodicData);
    setLoading(false);
  };

  const handleItemClick = useCallback((item: string) => {
    setActiveItemFromClick(item); // Set the state to indicate that active tab change is due to click
    setActiveItem(item);
  }, []);

  const handleCountPercentage = useCallback((widgetType: string) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: widgetType,
    });
    setCountPercentage(widgetType);
  }, []);

  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  const handleDuration = useCallback(
    async (durationOpts: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: durationOpts,
      });
      setLoading(true);
      setDuration(durationOpts);
      updatePeriodic(durationOpts);
      setLoading(false); // Set loading to false after data is fetched
    },
    [niftyFilterData],
  );

  const handleMonthlyDaily = useCallback(
    async (monthlyDailyOpts: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: monthlyDailyOpts,
      });
      setMonthlyDaily(monthlyDailyOpts);
      updateAdvanceDecline(monthlyDailyOpts);
    },
    [niftyFilterData],
  );

  const loadMoreData = useCallback(
    async (type: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "load_more_click",
        event_label: type,
      });
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
            const pos = !!isPrime ? 100 : 220;
            const offset = element.offsetTop + pos;
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

  const faqMainEntity: any[] = [];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqMainEntity,
  };
  const handleFaqClick = (faq: any, index: number) => {
    // If the clicked item is already active, remove it from activeFaqs
    if (activeFaqs.includes(index)) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "faq_collapsed",
        event_label: faq?.ques,
      });
      setActiveFaqs(activeFaqs.filter((item) => item !== index));
    } else {
      // Otherwise, add it to activeFaqs
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "faq_expand",
        event_label: faq?.ques,
      });
      setActiveFaqs([...activeFaqs, index]);
    }
  };

  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: "markets/stock-market-mood",
    obj: {
      item_name: "stock_market_mood",
      item_id: "stock_market_mood_" + activeItem,
      item_brand: "market_tools",
      item_category: "stock_market_mood",
      item_category2: "Stock Market Mood",
      item_category3: "paywall_blocker_cta",
      item_category4: "Subscribe Now",
      feature_name: "market-mood",
      site_section: "Stock Market Mood",
      site_sub_section: "markets/stock-market-mood",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
    },
  };
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
        <h1 className={styles.heading}>Stock Market Mood</h1>
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
                onClick={() => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "tab_selected",
                    event_label: `${item.label}`,
                  });
                  handleItemClick(item.key);
                }}
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
                  title={item.title}
                  alt={item.title}
                  loading="lazy"
                />
                <p className={styles.title}>{item.title}</p>
                {item.key == "overview"
                  ? overviewList
                  : item.key == "periodic"
                    ? periodicList
                    : ""}
                {!!item.desc && <p className={styles.desc}>{item.desc}</p>}
                <div className={styles.plan}>
                  <span
                    className={styles.subscribeBtn}
                    onClick={() => {
                      redirectToPlanPage(objTracking);
                    }}
                  >
                    {item.cta}
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
              {/* <p className={styles.mood_desc}>
                Know the market sentiments. Identify whether the market is
                predominantly bullish or bearish.
              </p> */}
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
              <p className={styles.mood_desc}>
                Compare the periodic highs & lows of different indices to
                identify trends & make informed decisions.
              </p>
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
              <p className={styles.mood_desc}>
                Track the no. of stocks closing above their previous day&apos;s
                close & no. of stocks closing below their previous low.
              </p>
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
        <div
          id="faq"
          className={`${styles.faqSection} sections`}
          ref={contentRefs}
        >
          <div className={styles.head}>Frequently Asked Questions</div>
          <ul id={styles.faqList}>
            {faqData.map((faq: any, index: number) => {
              faqMainEntity.push({
                "@type": "Question",
                name: faq.ques,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: encodeHTML(faq.ans),
                },
              });

              return (
                <li
                  key={index}
                  className={`${styles.faq} ${activeFaqs.includes(index) ? styles.active : ""}`}
                  onClick={() => handleFaqClick(faq, index)}
                >
                  <div className={styles.ques}>
                    {faq.ques}
                    <span className={styles.navigate}>
                      <i className="eticon_caret_down"></i>
                    </span>
                  </div>
                  <div
                    className={styles.ans}
                    dangerouslySetInnerHTML={{ __html: faq.ans }}
                  ></div>
                </li>
              );
            })}
          </ul>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqSchema),
            }}
          />
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
