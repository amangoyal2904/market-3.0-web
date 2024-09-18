"use client";
import React, { useEffect, useRef, useState } from "react";
import { PatternCard } from "@/components/ChartPatterns/PatternCard";
import TopHead from "@/components/ChartPatterns/TopHead";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import styles from "../../ChartPattern.module.scss";
import { getNewChartPattern } from "../../utilities";
import { getCookie } from "@/utils";
import Loader from "@/components/Loader";
import jStorageReact from "jstorage-react";
import ChartPatternPaywall from "@/components/ChartPatterns/ChartPatternPaywall";
import Blocker from "@/components/Blocker";
import useThrottle from "@/hooks/useThrottle";

const PastPatternsClient = ({ response, responsePayload, pageUrl }: any) => {
  // Add a ref to track initial render
  const initialRender = useRef(true);

  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const { pageSummary, newPatterns, latestPatternRequestDto } = response;

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null); // For tracking spinner visibility

  const [newPatternsData, setNewPatternData] = useState(newPatterns);
  const [pageSummaryView, setPageSummaryView] = useState(pageSummary);
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

  const onPayloadChange = (newPayload: string) => {
    setPayload(newPayload);
  };

  const handleCardClick = () => {
    setShowPaywall(true);
  };

  // Throttled Scroll Handler
  const throttledScrollHandler = useThrottle(() => {
    if (!loadMoreRef.current || isLoading || !hasMorePages) return;

    const loadMoreElement = loadMoreRef.current;
    const rect = loadMoreElement.getBoundingClientRect();
    const threshold = 400;
    if (pageSummaryView.pageNo === 1 && pageSummaryView.totalPages < 2) return;

    if (rect.top <= window.innerHeight + threshold) {
      loadMorePatternData();
    }
  }, 200);

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

  // Attach Throttled Scroll Listener
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler);
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler, isLoading, hasMorePages, pageSummaryView]);

  useEffect(() => {
    if (ssoReady) {
      const payWalledShow = jStorageReact.get("chartPatternPaywallShown");
      if (!payWalledShow) setShowPaywall(true);
    }
  }, [ssoReady]);

  return (
    <>
      <TopNav pageUrl={pageUrl} />
      <div className="prel">
        {!!processingLoader && <Loader loaderType="container" />}
        <TopHead
          pageType="pastPatterns"
          payload={payload}
          latestPatternRequestDto={latestPatternRequestDto}
          pageSummary={pageSummaryView}
          handlePayloadChange={onPayloadChange}
        />
        <div className={`${styles.containerGrid} ${styles.mt14}`}>
          {newPatternsData && newPatternsData.length > 0 ? (
            newPatternsData.map((patternData: any, index: number) => (
              <PatternCard
                key={index}
                patternData={patternData}
                isPrime={isPrime}
                latestCard={false}
                onCardClick={handleCardClick}
              />
            ))
          ) : (
            <Blocker type={"noDataFound"} />
          )}
        </div>
        <div
          ref={loadMoreRef}
          data-pageno={pageSummaryView.pageNo}
          data-totalpage={pageSummaryView?.totalPages || 1}
        />
        {isLoading && <div ref={spinnerRef} className={styles.spinner}></div>}
      </div>
      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
      />
    </>
  );
};

export default PastPatternsClient;
