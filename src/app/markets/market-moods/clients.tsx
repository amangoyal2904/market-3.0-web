"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./MarketMoods.module.scss";
import React, { useState, useEffect, useRef, useMemo } from "react";
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
  isprimeuser = false,
}: any) => {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
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
  const [countPercentage, setCountPercentage] = useState("count");
  const [duration, setDuration] = useState("1M");
  const [monthlyDaily, setMonthlyDaily] = useState("daily");
  const [showFilter, setShowFilter] = useState(false);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const tabRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const observer = useRef<IntersectionObserver | null>(null);
  const niftyFilterData = useMemo(() => selectedFilter, [selectedFilter]);
  const allFilterData = useMemo(() => allFilters, [allFilters]);

  const scrollToActiveContent = () => {
    const element = document.getElementById(activeItem);
    if (element) {
      const offset = element.offsetTop + 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const filterDataChangeHander = async (id: any) => {
    setLoading(true);
    setShowFilter(false);
    const selectedFilter = await fetchSelectedFilter(id);
    const newUrl = "/markets/market-moods/" + selectedFilter.seoname;
    router.prefetch(newUrl);
    router.push(newUrl, { scroll: false });
  };

  const handleItemClick = (item: string) => {
    setActiveItemFromClick(item); // Set the state to indicate that active tab change is due to click
    setActiveItem(item);
  };

  const handleCountPercentage = (widgetType: string) => {
    setCountPercentage(widgetType);
  };

  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };

  const handleDuration = async (item: string) => {
    setLoading(true);
    setDuration(item);
    const newPeriodicData = await getPeriodicData(
      niftyFilterData.indexId,
      item,
      1,
    );
    setPeriodicData(newPeriodicData);
    setLoading(false); // Set loading to false after data is fetched
  };

  const handleMonthlyDaily = async (item: string) => {
    setMonthlyDaily(item);
    const newAdvanceDeclineData = await getAdvanceDeclineData(
      niftyFilterData.indexId,
      item,
      1,
    );
    setAdvanceDeclineData(newAdvanceDeclineData);
  };

  const loadMoreData = async (type: string) => {
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
      // Scroll to the "Load More" button of the active item's section
      setTimeout(() => {
        const element = document.getElementById(type);

        if (element) {
          const offset = element.offsetTop + 120;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 100);
    }
  };

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substr(1);
    if (hash && tabData.some((item) => item.key === hash)) {
      // If there is, set the active item to the hash value
      setActiveItemFromClick(hash);
    }
  }, []);

  useEffect(() => {
    // Scroll to the active item's content when activeItem changes
    if (activeItemFromClick !== "") {
      scrollToActiveContent();
      setActiveItemFromClick("");
    }
  }, [activeItemFromClick]);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveItem(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }, // Adjust threshold as needed
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    Object.values(contentRefs.current).forEach((ref) => {
      if (ref && observer.current) {
        observer.current.observe(ref);
      }
    });

    return () => {
      if (observer.current) {
        Object.values(contentRefs.current).forEach((ref) => {
          if (ref) {
            observer.current!.unobserve(ref);
          }
        });
      }
    };
  }, [contentRefs.current]);

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
                ref={(el) => (tabRefs.current[item.key] = el)}
                onClick={() => handleItemClick(item.key)}
                className={
                  activeItem === item.key || (activeItem === "" && index == 0)
                    ? styles.active
                    : ""
                }
              >
                {item.label}
              </li>
            );
          })}
        </ul>
        {(isPrime || isprimeuser) && (
          <span
            className={`${styles.roundBtn} ${styles.filterNseBse}`}
            onClick={() => showFilterMenu(true)}
          >
            <i className="eticon_filter"></i> {niftyFilterData?.name}
          </span>
        )}
      </div>
      <div
        className={`${styles.wrapper} ${!(isPrime || isprimeuser) ? styles.center : ""}`}
      >
        {!!loading && <Loader loaderType="container" />}
        {!(isPrime || isprimeuser) ? (
          <>
            {payWallMarketMood.map((item: any, index: number) => (
              <div
                key={index}
                id={item.key}
                className={styles.section}
                ref={(ref) => (contentRefs.current[item.key] = ref)}
              >
                {item.heading && (
                  <div className={styles.header}>
                    <div className={styles.head}>{item.heading}</div>
                  </div>
                )}
                <Image
                  src={item.img}
                  width={index === 0 ? 515 : 545}
                  height={245}
                  alt={`Market Moods ${item.heading}`}
                />
                <p className={styles.title}>{item.title}</p>
                <p className={styles.desc}>{item.desc}</p>
                <div className={styles.plan}>
                  <Link
                    className={styles.subscribeBtn}
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"]}`}
                    data-ga-onclick="Subscription Flow#SYFT#ATF - url"
                  >
                    Subscribe
                  </Link>
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
              className={styles.section}
              ref={(ref) => (contentRefs.current["overview"] = ref)}
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
                  <div
                    id="overview-load-more"
                    className={styles.loadMore}
                    onClick={() => loadMoreData("overview")}
                  >
                    {showAllOverview ? "Load Less..." : "Load More..."}
                  </div>
                </>
              ) : (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
            </div>
            <div
              id="periodic"
              className={styles.section}
              ref={(ref) => (contentRefs.current["periodic"] = ref)}
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
                  <div
                    id="periodic-load-more"
                    className={styles.loadMore}
                    onClick={() => loadMoreData("periodic")}
                  >
                    {showAllPeriodic ? "Load Less..." : "Load More..."}
                  </div>
                </>
              ) : (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
            </div>
            <div
              id="advanceDecline"
              className={styles.section}
              ref={(ref) => (contentRefs.current["advanceDecline"] = ref)}
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
                  <div
                    id="advanceDecline-load-more"
                    className={styles.loadMore}
                    onClick={() => loadMoreData("advanceDecline")}
                  >
                    {showAllAdvanceDecline ? "Load Less..." : "Load More..."}
                  </div>
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
          className={styles.faq}
          ref={(ref) => (contentRefs.current["faq"] = ref)}
        >
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
