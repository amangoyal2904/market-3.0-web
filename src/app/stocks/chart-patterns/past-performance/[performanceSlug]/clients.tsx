"use client";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../ChartPattern.module.scss";
import PastPatternCard from "@/components/ChartPatterns/PastPatternCard";
import { getPastChartPatternPerformance } from "../../utilities";
import jStorageReact from "jstorage-react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import { getCookie } from "@/utils";
import Blocker from "@/components/Blocker";

const ChartPatternPaywall = dynamic(
  () => import("@/components/ChartPatterns/ChartPatternPaywall"),
  {
    ssr: false,
  },
);

const PastChartPatternsClientSlug = ({
  response,
  responsePayload,
  pageUrl,
}: any) => {
  const initialRender = useRef(true);
  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const [newPatternsList, setNewPatternList] = useState(response);
  const [pageSummaryView, setPageSummaryView] = useState(response?.pageSummary);
  const [payload, setPayload] = useState(responsePayload);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const { timeFrame, patternType, filterValue } = payload;

  const onPayloadChange = (newPayload: string) => {
    setPayload(newPayload);
  };

  const refreshChartPatternList = async () => {
    setProcessingLoader(true);

    if (!ssoid) {
      ssoid = getCookie("ssoid");
    }
    if (!ticketId) {
      ticketId = getCookie("TicketId");
    }
    if (!isPrime) {
      isPrime = getCookie("isprimeuser");
    }

    const data = await getPastChartPatternPerformance(
      payload,
      ssoid,
      ticketId,
      isPrime,
    );
    setNewPatternList(data);
    setPageSummaryView(data?.pageSummary);
    setProcessingLoader(false);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      refreshChartPatternList();
    }
  }, [timeFrame, patternType, filterValue]);

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
      isPrime,
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

  useEffect(() => {
    if (ssoReady) {
      const payWalledShow = jStorageReact.get("chartPatternPaywallShown");
      if (!payWalledShow) setShowPaywall(true);
    }
  }, [ssoReady]);

  const showingIdeasText = `Showing ${Math.min(
    pageSummaryView.pageNo * pageSummaryView.pageSize,
    pageSummaryView.totalRecords,
  )} of ${pageSummaryView.totalRecords} picks`;

  return (
    <>
      <TopNav
        pageUrl={pageUrl}
        pageType="past"
        payload={payload}
        handlePayloadChange={onPayloadChange}
      />
      <div className="prel">
        {!!processingLoader && <Loader loaderType="container" />}
        <div className={`${styles.container} ${styles.mt14}`}>
          {newPatternsList &&
          newPatternsList.pastPatternList &&
          newPatternsList.pastPatternList.length ? (
            <>
              <PastPatternCard
                patternData={newPatternsList}
                timeFrame={responsePayload?.timeFrame}
                showCta={false}
              />

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
              customMessage={`No past performances identified for the selected filters.<span class="desc">Please select a different filter to view past performance.</span>`}
            />
          )}
        </div>
      </div>
      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
        pageName={`${response?.patternName} Past Performance`}
      />
    </>
  );
};

export default PastChartPatternsClientSlug;
