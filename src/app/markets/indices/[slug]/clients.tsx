"use client";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStateContext } from "@/store/StateContext";
import IndicesDetailsOverview from "@/components/IndicesDetails/Overview";
import refeshConfig from "@/utils/refreshConfig.json";
import { getIndicesOverview } from "@/utils/utility";
import useDebounce from "@/hooks/useDebounce";
import styles from "./IndicesDetails.module.scss";
import KeyMetricsIndices from "@/components/IndicesDetails/KeyMetrics";
import IndicesReturns from "@/components/IndicesDetails/Returns";
import IndicesFaqs from "@/components/IndicesDetails/Faqs";
import IndicesTechnicalAnalysis from "@/components/IndicesDetails/TechnicalAnalysis";
import IndicesConstituents from "@/components/IndicesDetails/Constituents";
import IndicesPerformance from "@/components/IndicesDetails/Performance";
import { trackingEvent } from "@/utils/ga";
import useIntervalApiCall from "@/utils/useIntervalApiCall";
import LiveBlogIndexNews from "@/components/IndicesDetails/LiveBlogIndexNews";

const pageTabData = [
  { label: "Key Metrics", key: "keymetrics" },
  { label: "Returns", key: "returns" },
  { label: "Performance", key: "performance" },
  { label: "Technical Analysis", key: "technicalanalysis" },
  { label: "Constituents", key: "constituents" },
  { label: "FAQs", key: "faqs" },
];

const DEBOUNCE_DELAY = 10;

const IndicesDetailsClient = ({
  overview = {},
  technicals = {},
  peers = {},
  others = {},
  tabData = [],
  activeViewId = null,
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  tableConfig = {},
  tabConfig = {},
  payload = {},
  indicesNews = {},
  liveblog = {},
  faq = {},
  pagePath = {},
}: any) => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [activeItem, setActiveItem] = useState<string>("keymetrics");
  const [overviewData, setOverviewData] = useState(overview);
  const contentRefs = useRef<HTMLDivElement>(null);
  const [scrollByItemClick, setScrollByItemClick] = useState(false); // New state to track scroll triggered by item click
  const { debounce } = useDebounce();
  const indexId = overview.assetId;
  const indexName = overview.assetName;
  const symbol = overview.assetSymbol;
  const exchange = overview.assetExchangeId == 50 ? "NSE" : "BSE";
  const exchangeId = overview.assetExchangeId;
  const { indexDescription, indexFaq = [] } = faq;

  const refreshOverviewData = async () => {
    const data = await getIndicesOverview(indexId);
    setOverviewData(data);
  };

  const handleScroll = debounce(() => {
    if (!scrollByItemClick) {
      // Only execute when scrolling is not triggered by item click
      const contentRefs = document.querySelectorAll(".sections");
      const windowHeight = window.innerHeight;

      contentRefs.forEach((ref) => {
        const section = ref as HTMLElement;
        const sectionRect = section.getBoundingClientRect();
        const tolerance = windowHeight * 0.2;

        if (sectionRect.top <= tolerance && sectionRect.bottom >= tolerance) {
          setActiveItem(section.id);
        }
      });
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [debounce]);

  const scrollToActiveContent = useCallback((itemId: string) => {
    const element = document.getElementById(itemId);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const offset = elementRect.top + window.pageYOffset - 120; // Adjust offset as needed
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  const handleItemClick = useCallback(
    (item: string) => {
      setScrollByItemClick(true); // Set flag to indicate scrolling triggered by item click
      window.removeEventListener("scroll", handleScroll); // Remove scroll event listener
      setActiveItem(item);
      scrollToActiveContent(item); // Scroll to the clicked tab's section

      setTimeout(() => {
        window.addEventListener("scroll", handleScroll); // Add scroll event listener after a small delay
        setScrollByItemClick(false); // Reset flag after scrolling is done
      }, 1000);
    },
    [scrollToActiveContent, handleScroll],
  );

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE") refreshOverviewData();
    },
    refeshConfig.indicesDetail,
    [currentMarketStatus],
  );

  return (
    <>
      <IndicesDetailsOverview
        overviewData={overviewData}
        descText={indexDescription}
        currentMarketStatus={currentMarketStatus}
        symbol={symbol}
        exchange={exchange}
        exchangeId={exchangeId}
      />
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {pageTabData.map((item: any) => (
            <Fragment key={item.key}>
              {!!(
                item.key !== "faqs" ||
                (item.key === "faqs" && !!indexFaq.length)
              ) && (
                <li
                  onClick={() => {
                    trackingEvent("et_push_event", {
                      event_category: "mercury_engagement",
                      event_action: "indices_section click",
                      event_label: item.label,
                    });
                    handleItemClick(item.key);
                  }}
                  className={activeItem === item.key ? styles.active : ""}
                >
                  {item.label}
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      <div className={styles.wrapper}>
        {pageTabData.map((item: any) => (
          <Fragment key={item.key}>
            {!!(
              item.key !== "faqs" ||
              (item.key === "faqs" && !!indexFaq.length)
            ) && (
              <div
                id={item.key}
                className={`${styles.section} sections`}
                ref={contentRefs}
              >
                {item.key === "keymetrics" && (
                  <KeyMetricsIndices data={overviewData.keyMetrics} />
                )}
                {item.key === "returns" && (
                  <IndicesReturns data={overviewData.returns} />
                )}
                {item.key === "performance" && (
                  <IndicesPerformance
                    data={peers}
                    indexName={indexName}
                    exchange={exchange}
                  />
                )}
                {item.key === "technicalanalysis" && (
                  <>
                    <IndicesTechnicalAnalysis
                      data={technicals}
                      symbol={symbol}
                    />
                    {pagePath === "/markets/indices/nifty-50" && (
                      <LiveBlogIndexNews
                        indexName={indexName}
                        indicesNews={indicesNews}
                        liveblog={liveblog}
                      />
                    )}
                  </>
                )}

                {item.key === "constituents" && (
                  <>
                    <IndicesConstituents
                      indexName={indexName}
                      otherIndices={others}
                      tabData={tabData}
                      activeViewId={activeViewId}
                      tableHeaderData={tableHeaderData}
                      tableData={tableData}
                      pageSummary={pageSummary}
                      tableConfig={tableConfig}
                      tabConfig={tabConfig}
                      payload={payload}
                      indicesNews={indicesNews}
                      liveblog={liveblog}
                      pagePath={pagePath}
                    />
                  </>
                )}
                {item.key === "faqs" && <IndicesFaqs faqs={indexFaq} />}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default IndicesDetailsClient;
