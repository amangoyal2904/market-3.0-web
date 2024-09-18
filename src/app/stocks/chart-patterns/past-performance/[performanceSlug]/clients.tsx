"use client";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../ChartPattern.module.scss";
import PastPatternCard from "@/components/ChartPatterns/PastPatternCard";
import { getPastChartPatternPerformance } from "../../utilities";
import jStorageReact from "jstorage-react";
import ChartPatternPaywall from "@/components/ChartPatterns/ChartPatternPaywall";
import useThrottle from "@/hooks/useThrottle";

const PastChartPatternsClientSlug = ({
  response,
  responsePayload,
  pageUrl,
}: any) => {
  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const [newPatternsList, setNewPatternList] = useState(response);
  const [pageSummaryView, setPageSummaryView] = useState(response?.pageSummary);
  const [payload, setPayload] = useState(responsePayload);
  const [showPaywall, setShowPaywall] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const loadMorePatternData = async () => {
    if (isLoading || !hasMorePages) return;

    setIsLoading(true);

    const updatedPayload = {
      ...payload,
      pageNo: payload.pageNo + 1,
    };

    const data = await getPastChartPatternPerformance(
      updatedPayload,
      ssoid,
      ticketId,
    );

    const { pageSummary, pastPatternList } = data;
    setNewPatternList((prevState: any) => ({
      ...prevState,
      pastPatternList: [...prevState.pastPatternList, ...pastPatternList],
      pageSummary: pageSummary,
    }));

    setPageSummaryView(pageSummary);
    setPayload(updatedPayload);
    if (updatedPayload.pageNo >= pageSummary.totalPages) {
      setHasMorePages(false);
    }

    setIsLoading(false);
  };

  // Throttled Scroll Handler
  const throttledScrollHandler = useThrottle(() => {
    if (!loadMoreRef.current || isLoading || !hasMorePages) return;

    const loadMoreElement = loadMoreRef.current;
    const rect = loadMoreElement.getBoundingClientRect();
    const threshold = 100;
    if (pageSummaryView.pageNo === 1 && pageSummaryView.totalPages < 2) return;

    if (rect.top <= window.innerHeight + threshold) {
      loadMorePatternData();
    }
  }, 200);

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
        <div className={`${styles.container} ${styles.mt14}`}>
          {newPatternsList ? (
            <>
              <PastPatternCard
                patternData={newPatternsList}
                timeFrame={responsePayload?.timeFrame}
                showCta={false}
              />

              {response?.pageSummary?.totalPages > 1 && (
                <div
                  ref={loadMoreRef}
                  data-pageno={pageSummaryView?.pageNo}
                  data-totalpage={pageSummaryView?.totalPages || 1}
                />
              )}
              {isLoading && (
                <div ref={spinnerRef} className={styles.spinner}></div>
              )}
            </>
          ) : (
            <p>No patterns available</p>
          )}
        </div>
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

export default PastChartPatternsClientSlug;
