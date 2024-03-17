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
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import Loader from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { useStateContext } from "@/store/StateContext";
import Blocker from "@/components/Blocker";

const MarketMoodsClient = ({
  isprimeuser = false,
  overviewData = {},
  advanceDeclineData = {},
  periodicData = {},
  selectedFilter = {},
}: any) => {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [_overviewData, setOverviewData] = useState(overviewData);
  const [_advanceDeclineData, setAdvanceDeclineData] =
    useState(advanceDeclineData);
  const [_periodicData, setPeriodicData] = useState(periodicData);
  const [activeItem, setActiveItem] = useState<string>("");
  const [countPercentage, setCountPercentage] = useState("count");
  const [duration, setDuration] = useState("1M");
  const [monthlyDaily, setMonthlyDaily] = useState("daily");
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const niftyFilterData = useMemo(() => selectedFilter, [selectedFilter]);

  const scrollToActiveContent = () => {
    const element = document.getElementById(activeItem);
    if (element) {
      const offset = element.offsetTop + 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };
  const filterDataChangeHander = async (id: any) => {
    setLoading(true);
    const selectedFilter = await fetchSelectedFilter(id);
    const newUrl = "/markets/market-moods/" + selectedFilter.seoname;
    router.prefetch(newUrl);
    router.push(newUrl, { scroll: false });
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleCountPercentage = (widgetType: string) => {
    setLoading(true);
    setCountPercentage(widgetType);
    setLoading(false);
  };

  const handleDuration = async (item: string) => {
    setLoading(true);
    setDuration(item);
    const periodicData = await getPeriodicData(
      niftyFilterData.indexId,
      item,
      1,
    );
    setPeriodicData(periodicData);
    setLoading(false);
  };

  const handleMonthlyDaily = async (item: string) => {
    setMonthlyDaily(item);
    const advanceDeclineData = await getAdvanceDeclineData(
      niftyFilterData.indexId,
      item,
      1,
    );
    setAdvanceDeclineData(advanceDeclineData);
  };

  const loadMoreData = async (pageno: number, type: string) => {
    setLoading(true);
    let prevData, newData;
    if (type == "overview") {
      prevData = !!_overviewData ? _overviewData : overviewData;
      newData = await getOverviewData(niftyFilterData.indexId, pageno + 1);
    } else if (type == "periodic") {
      prevData = !!_periodicData ? _periodicData : periodicData;
      newData = await getPeriodicData(
        niftyFilterData.indexId,
        duration,
        pageno + 1,
      );
    } else if (type == "advanceDecline") {
      prevData = !!_advanceDeclineData
        ? _advanceDeclineData
        : advanceDeclineData;
      newData = await getAdvanceDeclineData(
        niftyFilterData.indexId,
        monthlyDaily,
        pageno + 1,
      );
    }
    if (!!newData && !!prevData)
      newData.dataList = [...prevData.dataList, ...newData.dataList];
    if (type == "overview") {
      setOverviewData(newData);
    } else if (type == "periodic") {
      setPeriodicData(newData);
    } else if (type == "advanceDecline") {
      setAdvanceDeclineData(newData);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substr(1);
    if (hash && tabData.some((item) => item.key === hash)) {
      // If there is, set the active item to the hash value
      setActiveItem(hash);
    }
  }, []);

  useEffect(() => {
    // Scroll to the active item's content when activeItem changes
    scrollToActiveContent();
  }, [activeItem]);

  useEffect(() => {
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
                onClick={() => handleItemClick(item.key)}
                className={
                  activeItem === item.key ||
                  (activeItem == "" && item.key == "overview")
                    ? styles.active
                    : ""
                }
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={`${styles.wrapper} ${!(isprimeuser || isPrime) ? styles.center : ""}`}
      >
        {isprimeuser || isPrime ? (
          <>
            {!!loading && <Loader loaderType="container" />}
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
                filterDataChange={filterDataChangeHander}
              />
              <div className={styles.tableWrapper}>
                <FixedTableMarketMood
                  tableData={_overviewData?.dataList}
                  extraHeader="true"
                />
                <ScrollableTableMarketMood
                  tableHeader={_overviewData?.labels}
                  tableData={_overviewData?.dataList}
                  type={countPercentage}
                />
              </div>
              {_overviewData?.dataList?.length == 0 && (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
              {_overviewData?.pageSummary?.pageno <
                _overviewData?.pageSummary?.totalpages && (
                <div
                  className={styles.loadMore}
                  onClick={() =>
                    loadMoreData(_overviewData?.pageSummary?.pageno, "overview")
                  }
                >
                  Load More...
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
                filterDataChange={filterDataChangeHander}
              />
              <div className={styles.tableWrapper}>
                <FixedTableMarketMood tableData={_periodicData?.dataList} />
                <ScrollableBarsTableMarketMood
                  tableData={_periodicData?.dataList}
                  type="periodic"
                />
              </div>
              {_periodicData?.dataList?.length == 0 && (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
              {_periodicData?.pageSummary?.pageno <
                _periodicData?.pageSummary?.totalpages && (
                <div
                  className={styles.loadMore}
                  onClick={() =>
                    loadMoreData(_periodicData?.pageSummary?.pageno, "periodic")
                  }
                >
                  Load More...
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
                filterDataChange={filterDataChangeHander}
              />
              <div className={styles.tableWrapper}>
                <FixedTableMarketMood
                  tableData={_advanceDeclineData?.dataList}
                />
                <ScrollableBarsTableMarketMood
                  tableData={_advanceDeclineData?.dataList}
                  type="advanceDecline"
                />
              </div>
              {_advanceDeclineData?.dataList?.length == 0 && (
                <div className={styles.blocker}>
                  <Blocker type="noDataMinimal" />
                </div>
              )}
              {_advanceDeclineData?.pageSummary?.pageno <
                _advanceDeclineData?.pageSummary?.totalpages && (
                <div
                  className={styles.loadMore}
                  onClick={() =>
                    loadMoreData(
                      _advanceDeclineData?.pageSummary?.pageno,
                      "advanceDecline",
                    )
                  }
                >
                  Load More...
                </div>
              )}
            </div>
          </>
        ) : (
          payWallMarketMood.map((item: any, index: number) => {
            return (
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
                  width={index == 0 ? 515 : 545}
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
            );
          })
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
    </>
  );
};

export default MarketMoodsClient;
