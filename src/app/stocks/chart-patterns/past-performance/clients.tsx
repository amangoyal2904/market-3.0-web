"use client";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import { getCookie } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { getPastChartPattern } from "../utilities";
import Loader from "@/components/Loader";
import TopHead from "@/components/ChartPatterns/TopHead";
import styles from "../ChartPattern.module.scss";
import PastPatternCard from "@/components/ChartPatterns/PastPatternCard";
import jStorageReact from "jstorage-react";
import Blocker from "@/components/Blocker";
import dynamic from "next/dynamic";

const ChartPatternPaywall = dynamic(
  () => import("@/components/ChartPatterns/ChartPatternPaywall"),
  {
    ssr: false,
  },
);

const PastChartPatternsClient = ({
  response,
  responsePayload,
  pageUrl,
}: any) => {
  const initialRender = useRef(true);
  const { state } = useStateContext();
  let { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const { patternsDataList } = response;

  const [newPatternsList, setNewPatternList] = useState(patternsDataList);
  const [payload, setPayload] = useState(responsePayload);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
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

    const data = await getPastChartPattern(payload, ssoid, ticketId);
    const { patternsDataList } = data;
    setNewPatternList(patternsDataList);
    setProcessingLoader(false);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      refreshChartPatternList();
    }
  }, [timeFrame, patternType, filterValue]);

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
        {/* <TopHead
          pageType="past"
          payload={payload}
          handlePayloadChange={onPayloadChange}
        /> */}
        <div className={`${styles.container} ${styles.mt14}`}>
          {newPatternsList && newPatternsList.length > 0 ? (
            newPatternsList.map(
              (patternData: any, index: number) =>
                patternData?.pastPatternList?.length > 0 && (
                  <PastPatternCard
                    key={index}
                    patternData={patternData}
                    timeFrame={payload?.timeFrame}
                  />
                ),
            )
          ) : (
            <Blocker type={"noDataMinimal"} />
          )}
        </div>
      </div>
      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
        pageName="Past Performance"
      />
    </>
  );
};

export default PastChartPatternsClient;
