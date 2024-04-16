"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "@/store/StateContext";
import IndicesDetailsOverview from "@/components/IndicesDetails/Overview";
import refeshConfig from "@/utils/refreshConfig.json";
import { getIndicesOverview } from "@/utils/utility";

const IndicesClient = ({
  overview = {},
  technicals = {},
  others = {},
  indexId = 2369,
}: any) => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [overviewData, setOverviewData] = useState(overview);
  const [symbol, setSymbol] = useState("SENSEX");
  const [exchange, setExchange] = useState("BSE");
  const [exchangeId, setExchangeId] = useState("47");
  const refreshOverviewData = async () => {
    const data = await getIndicesOverview(indexId);
    setOverviewData(data);
  };
  useEffect(() => {
    if (!!currentMarketStatus && currentMarketStatus.toUpperCase() == "LIVE") {
      const intervalId = setInterval(() => {
        refreshOverviewData();
      }, parseInt(refeshConfig.indicesDetail));
      return () => clearInterval(intervalId);
    }
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
    </>
  );
};

export default IndicesClient;
