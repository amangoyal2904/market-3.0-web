"use client";
import React, { useEffect, useRef, useState } from "react";
import { PatternCard } from "@/components/ChartPatterns/PatternCard";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import styles from "../ChartPattern.module.scss";
import { getNewChartPattern } from "../utilities";
import { getCookie } from "@/utils";
import Loader from "@/components/Loader";
import jStorageReact from "jstorage-react";
import Blocker from "@/components/Blocker";
import dynamic from "next/dynamic";

const ChartPatternPaywall = dynamic(
  () => import("@/components/ChartPatterns/ChartPatternPaywall"),
  {
    ssr: false,
  },
);

const ChartPatternsClient = ({ response, responsePayload, pageUrl }: any) => {
  // Add a ref to track initial render
  const initialRender = useRef(true);

  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const { pageSummary, newPatterns, latestPatternRequestDto } = response;

  const [newPatternsData, setNewPatternData] = useState(newPatterns);
  const [pageSummaryView, setPageSummaryView] = useState(pageSummary);
  const [payload, setPayload] = useState(responsePayload);
  const [isLoading, setIsLoading] = useState(false);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const { patternType, filterValue } = payload;

  const loadMorePatternData = async () => {
    if (isLoading || !hasMorePages) return;

    setIsLoading(true);

    const updatedPayload = {
      ...payload,
      pageNo: payload.pageNo + 1,
    };

    const data = await getNewChartPattern(updatedPayload, ssoid, ticketId);
    const { pageSummary, newPatterns } = data;

    setNewPatternData((prevData: any) => [...prevData, ...newPatterns]);
    setPageSummaryView(pageSummary);
    setPayload(updatedPayload);

    if (updatedPayload.pageNo >= pageSummary.totalPages) {
      setHasMorePages(false);
    }

    setIsLoading(false);
  };

  const refreshChartPatternCards = async () => {
    setProcessingLoader(true);

    if (!ssoid) {
      ssoid = getCookie("ssoid");
    }
    if (!ticketId) {
      ticketId = getCookie("TicketId");
    }

    const data = await getNewChartPattern(payload, ssoid, ticketId);
    const { pageSummary, newPatterns } = data;

    setNewPatternData(newPatterns);
    setPageSummaryView(pageSummary);
    setProcessingLoader(false);
  };

  const onPayloadChange = (newPayload: string) => {
    setPayload(newPayload);
  };

  const handleCardClick = () => {
    setShowPaywall(true);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      refreshChartPatternCards();
    }
  }, [patternType, filterValue]);

  useEffect(() => {
    if (isPrime) {
      refreshChartPatternCards();
    }
  }, [isPrime]);

  useEffect(() => {
    if (ssoReady) {
      const payWalledShow = jStorageReact.get("chartPatternPaywallShown");
      if (!payWalledShow) setShowPaywall(true);
    }
  }, [ssoReady]);

  const showingIdeasText = `Showing ${Math.min(
    pageSummaryView.pageNo * pageSummaryView.pageSize,
    pageSummaryView.totalRecords,
  )} of ${pageSummaryView.totalRecords} ideas`;

  return (
    <>
      <TopNav pageUrl={pageUrl} />
      <div className="prel">
        {!!processingLoader && <Loader loaderType="container" />}
        <div className={`${styles.containerGrid} ${styles.mt14}`}>
          {newPatternsData && newPatternsData.length > 0 ? (
            newPatternsData.map((patternData: any, index: number) => (
              <PatternCard
                key={index}
                patternData={patternData}
                onCardClick={handleCardClick} // Pass down onCardClick handler
              />
            ))
          ) : (
            <Blocker
              type={"noDataFound"}
              customMessage="No new chart patterns found for the selected filters. Try choosing a different filter to explore the latest trading opportunities"
            />
          )}
        </div>

        {/* Load More Button */}
        {hasMorePages && (
          <div className={styles.loadMoreContainer}>
            <div className={styles.showingIdeas}>{showingIdeasText}</div>
            <button
              onClick={loadMorePatternData}
              className={styles.loadMoreButton}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
        pageName={
          latestPatternRequestDto?.patternType !== "bullish"
            ? `${latestPatternRequestDto?.patternName} New Patterns`
            : `New Patterns`
        }
      />
    </>
  );
};

export default ChartPatternsClient;
