"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateContext } from "@/store/StateContext";
import IndicesDetailsOverview from "@/components/IndicesDetails/Overview";
import refeshConfig from "@/utils/refreshConfig.json";
import { getIndicesOverview } from "@/utils/utility";
import useDebounce from "@/hooks/useDebounce";
import styles from "./Indices.module.scss";
import KeyMetricsIndices from "@/components/IndicesDetails/KeyMetrics";
import IndicesReturns from "@/components/IndicesDetails/Returns";
import IndicesFaqs from "@/components/IndicesDetails/Faqs";
import IndicesTechnicalAnalysis from "@/components/IndicesDetails/TechnicalAnalysis";
import IndicesConstituents from "@/components/IndicesDetails/Constituents";
import IndicesPerformance from "@/components/IndicesDetails/Performance";

const tabData = [
  { label: "Key Metrics", key: "keymetrics" },
  { label: "Returns", key: "returns" },
  { label: "Performance", key: "performance" },
  { label: "Technical Analysis", key: "technicalanalysis" },
  { label: "Consitutents", key: "consitutents" },
  { label: "FAQs", key: "faqs" },
];

const IndicesClient = ({
  overview = {},
  technicals = {},
  others = {},
}: any) => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [activeItem, setActiveItem] = useState<string>("");
  const [activeItemFromClick, setActiveItemFromClick] = useState<string>("");
  const [overviewData, setOverviewData] = useState(overview);
  const contentRefs = useRef<HTMLDivElement>(null);
  const activeListItemRef = useRef<HTMLLIElement>(null);
  const { debounce } = useDebounce();
  const indexId = overview.assetId;
  const indexName = overview.assetName;
  const symbol = "SENSEX";
  const exchange = overview.assetExchangeId == 50 ? "NSE" : "BSE";
  const exchangeId = overview.assetExchangeId;
  const refreshOverviewData = async () => {
    const data = await getIndicesOverview(indexId);
    setOverviewData(data);
  };

  const scrollToActiveContent = useCallback(() => {
    const element = document.getElementById(activeItem!);
    if (element) {
      const offset = element.offsetTop + 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [activeItem]);

  const handleItemClick = useCallback((item: string) => {
    setActiveItemFromClick(item); // Set the state to indicate that active tab change is due to click
    setActiveItem(item);
  }, []);

  useEffect(() => {
    //if (!!currentMarketStatus && currentMarketStatus.toUpperCase() == "LIVE") {
    refreshOverviewData();
    const intervalId = setInterval(() => {
      refreshOverviewData();
    }, parseInt(refeshConfig.indicesDetail));
    return () => clearInterval(intervalId);
    //}
  }, [currentMarketStatus]);

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
      </div>
      <div className={styles.wrapper}>
        {tabData.map((item: any, index: number) => {
          return (
            <div
              id={item.key}
              key={index}
              className={`${styles.section} sections`}
              ref={contentRefs}
            >
              {item.key == "keymetrics" && (
                <KeyMetricsIndices data={overviewData.keyMetrics} />
              )}

              {item.key == "returns" && (
                <IndicesReturns data={overviewData.returns} />
              )}

              {item.key == "performance" && (
                <IndicesPerformance
                  data={overviewData.returns}
                  indexName={indexName}
                />
              )}

              {item.key == "technicalanalysis" && (
                <IndicesTechnicalAnalysis data={technicals} />
              )}

              {item.key == "consitutents" && (
                <IndicesConstituents data={overviewData.returns} />
              )}

              {item.key == "faqs" && (
                <IndicesFaqs data={overviewData.returns} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default IndicesClient;
