"use client";
import React, { useEffect, useState } from "react";
import styles from "./LiveMarketData.module.scss";
import Service from "@/network/service";
import { APP_ENV, formatNumber } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { useStateContext } from "@/store/StateContext";
import refeshConfig from "@/utils/refreshConfig.json";
import { saveLogs } from "@/utils/utility";
import useIntervalApiCall from "@/utils/useIntervalApiCall";

const LiveMarketData = () => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [marketData, setMarketData] = useState<any>([]);
  const getLiveMarketData = async () => {
    try {
      const url = (APIS_CONFIG as any)?.LIVE_MARKET_DATA_NEW[APP_ENV];
      const res = await Service.get({ url, params: {} });
      const result = await res?.json();
      setMarketData(result.indicesList);
    } catch (err) {
      console.log("Error in Live Market Live ", err);
      saveLogs({
        type: "Mercury",
        res: "error",
        msg: "Live Market Data API Error" + err,
      });
    }
  };
  const marketlivedata = (data: any) => {
    const jsonStartIndex = data.indexOf("[");
    const jsonEndIndex = data.lastIndexOf("]");
    const jsonString = data.substring(jsonStartIndex, jsonEndIndex + 1);
    setMarketData(JSON.parse(jsonString));
  };

  useIntervalApiCall(
    () => {
      if (currentMarketStatus != "CLOSED") getLiveMarketData();
    },
    refeshConfig.marketstats,
    [currentMarketStatus],
  );

  return (
    <>
      <div className={styles.liveMarkets}>
        {/* {marketData && marketData[0] && (
          <>
            <div className={styles.marketIndex}>
              <div className={styles.indexName}>SENSEX: </div>
              <div className={`${styles.indexValue} numberFonts`}>
                {marketData[0]?.sensex.CurrentIndexValue}
              </div>
              <div
                className={`numberFonts ${styles.indexChange} ${Number(marketData[0]?.netChange) > 0 ? styles.green : styles.red}`}
              >
                {marketData[0]?.percentChange}%
                <i
                  className={
                    Number(marketData[0]?.netChange) > 0
                      ? "eticon_up_arrow"
                      : "eticon_down_arrow"
                  }
                ></i>
              </div>
            </div>
            <div className={styles.marketIndex}>
              <div className={styles.indexName}>NIFTY:</div>
              <div className={styles.indexValue}>
                {marketData[0]?.nifty.CurrentIndexValue}
              </div>
              <div
                className={`numberFonts ${styles.indexChange} ${Number(marketData[0]?.nifty.NetChange) > 0 ? styles.green : styles.red}`}
              >
                {marketData[0]?.nifty.PercentChange}%
                <i
                  className={
                    Number(marketData[0]?.nifty.NetChange) > 0
                      ? "eticon_up_arrow"
                      : "eticon_down_arrow"
                  }
                ></i>
              </div>
            </div>
          </>
        )} */}

        {marketData &&
          marketData.map((item: any, index: number) => {
            return (
              <div className={styles.marketIndex} key={`md_${index}`}>
                <div className={styles.indexName}>
                  <a
                    href={
                      item.indexName == "Nifty 50"
                        ? "/markets/indices/nifty-50"
                        : "/markets/indices/bse-sensex"
                    }
                    title={item.indexName == "Nifty 50" ? "NIFTY" : "SENSEX"}
                  >
                    {item.indexName == "Nifty 50" ? "NIFTY" : "SENSEX"}
                  </a>
                </div>
                {/* <div className={styles.indexContainer}> */}
                <div className={`${styles.indexValue} numberFonts`}>
                  {formatNumber(item.lastTradedPrice)}
                </div>
                <div
                  className={`numberFonts ${styles.indexChange} ${Number(item.netChange) > 0 ? styles.green : styles.red}`}
                >
                  {item?.percentChange}%
                  <i
                    className={
                      Number(item?.netChange) > 0
                        ? "eticon_up_arrow"
                        : "eticon_down_arrow"
                    }
                  ></i>
                </div>
                {/* </div> */}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default LiveMarketData;
