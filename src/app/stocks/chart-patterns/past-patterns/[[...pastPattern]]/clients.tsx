"use client";
import React, { useEffect, useRef, useState } from "react";
import { PatternCard } from "@/components/ChartPatterns/PatternCard";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import styles from "../../ChartPattern.module.scss";
import { getNewChartPattern, getPatternDescriptionText } from "../../utilities";
import { getCookie } from "@/utils";
import Loader from "@/components/Loader";
import jStorageReact from "jstorage-react";
import Blocker from "@/components/Blocker";
import dynamic from "next/dynamic";
import ChartPatternHeader from "@/components/ChartPatterns/ChartPatternHeader";

const ChartPatternPaywall = dynamic(
  () => import("@/components/ChartPatterns/ChartPatternPaywall"),
  {
    ssr: false,
  },
);

const PastPatternsClient = ({
  patternDesc,
  response,
  responsePayload,
  pageUrl,
}: any) => {
  // Add a ref to track initial render
  const initialRender = useRef(true);

  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const { pageSummary, newPatterns, latestPatternRequestDto } = response;

  const [newPatternsData, setNewPatternData] = useState(newPatterns);
  const [pageSummaryView, setPageSummaryView] = useState(pageSummary);
  const [patternDescription, setPatternDescription] = useState(patternDesc);
  const [payload, setPayload] = useState(responsePayload);
  const [isLoading, setIsLoading] = useState(false);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const { patternType, filterValue, timeFrame } = payload;

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

  const onPayloadChange = (newPayload: any) => {
    setPatternDescription(getPatternDescriptionText(newPayload?.patternType));
    setPayload(newPayload);
  };

  const handleCardClick = () => {
    setShowPaywall(true);
  };

  useEffect(() => {
    if (initialRender.current) {
      // Skip the effect on the initial render
      initialRender.current = false;
    } else {
      // Only call refreshChartPatternCards after the initial render
      refreshChartPatternCards();
    }
  }, [patternType, filterValue, timeFrame]);

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
      <ChartPatternHeader description={patternDescription} />
      <TopNav
        pageUrl={pageUrl}
        pageType="past-pattern"
        payload={payload}
        latestPatternRequestDto={latestPatternRequestDto}
        handlePayloadChange={onPayloadChange}
      />
      <div className="prel">
        {!!processingLoader && <Loader loaderType="container" />}

        {newPatternsData && newPatternsData.length > 0 ? (
          <>
            <div className={`${styles.containerGrid} ${styles.mt14}`}>
              {newPatternsData.map((patternData: any, index: number) => (
                <PatternCard
                  key={index}
                  patternData={patternData}
                  latestCard={false}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
            {hasMorePages && pageSummaryView.totalPages > 1 && (
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
          </>
        ) : (
          <Blocker
            type={"noDataFound"}
            customMessage={`No past chart patterns identified for the selected filters.<span class="desc">Please select a different filter to view past performance.</span>`}
          />
        )}
      </div>
      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
        pageName={
          response?.latestPatternRequestDto?.patternType != "bullish"
            ? `${response?.latestPatternRequestDto?.patternName} Past Patterns`
            : `Past Patterns`
        }
      />
    </>
  );
};

export default PastPatternsClient;
