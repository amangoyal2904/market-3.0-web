"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

const pageTabData = [
  { label: "Key Metrics", key: "keymetrics" },
  { label: "Returns", key: "returns" },
  { label: "Performance", key: "performance" },
  { label: "Technical Analysis", key: "technicalanalysis" },
  { label: "Consitutents", key: "consitutents" },
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
  selectedFilter = {},
}: any) => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [activeItem, setActiveItem] = useState<string>("keymetrics");
  const [overviewData, setOverviewData] = useState(overview);
  const [peersData, setPeersData] = useState(peers);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const contentRefs = useRef<HTMLDivElement>(null);
  const [scrollByItemClick, setScrollByItemClick] = useState(false); // New state to track scroll triggered by item click
  const { debounce } = useDebounce();
  const indexId = overview.assetId;
  const indexName = overview.assetName;
  const symbol = overview.assetSymbol;
  const exchange = overview.assetExchangeId == 50 ? "NSE" : "BSE";
  const exchangeId = overview.assetExchangeId;

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

  useEffect(() => {
    refreshOverviewData();
    const intervalId = setInterval(
      refreshOverviewData,
      parseInt(refeshConfig.indicesDetail),
    );
    return () => clearInterval(intervalId);
  }, [currentMarketStatus]);

  return (
    <>
      <IndicesDetailsOverview
        overviewData={overviewData}
        currentMarketStatus={currentMarketStatus}
        symbol={symbol}
        exchange={exchange}
        exchangeId={exchangeId}
      />
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {pageTabData.map((item: any) => (
            <li
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              className={activeItem === item.key ? styles.active : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.wrapper}>
        {pageTabData.map((item: any) => (
          <div
            id={item.key}
            key={item.key}
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
                data={peersData}
                indexName={indexName}
                niftyFilterData={niftyFilterData}
              />
            )}
            {item.key === "technicalanalysis" && (
              <IndicesTechnicalAnalysis data={technicals} symbol={symbol} />
            )}
            {item.key === "consitutents" && (
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
              />
            )}
            {item.key === "faqs" && <IndicesFaqs />}
          </div>
        ))}
      </div>
    </>
  );
};

export default IndicesDetailsClient;
