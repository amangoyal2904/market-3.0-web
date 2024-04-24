"use client";
import React, { useEffect, useState } from "react";
import styles from "./LiveMarketData.module.scss";
import Service from "@/network/service";
import { APP_ENV } from "@/utils";
import APIS_CONFIG from "@/network/api_config.json";
import { useStateContext } from "@/store/StateContext";
import refeshConfig from "@/utils/refreshConfig.json";

const LiveMarketData = () => {
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [marketData, setMarketData] = useState<any>([]);
  const getLiveMarketData = async () => {
    try {
      const url = (APIS_CONFIG as any)?.LIVE_MARKET_DATA[APP_ENV];
      const res = await Service.get({ url, params: {} });
      if (res?.status === 200) {
        marketlivedata(await res.text());
      }
    } catch (err) {
      console.log("Error in Live Market Live ", err);
    }
  };
  const marketlivedata = (data: any) => {
    const jsonStartIndex = data.indexOf("[");
    const jsonEndIndex = data.lastIndexOf("]");
    const jsonString = data.substring(jsonStartIndex, jsonEndIndex + 1);
    setMarketData(JSON.parse(jsonString));
  };

  useEffect(() => {
    getLiveMarketData();
    const intervalId = setInterval(() => {
      if (currentMarketStatus === "LIVE") {
        getLiveMarketData();
      }
    }, refeshConfig.marketstats);
    return () => clearInterval(intervalId);
  }, [currentMarketStatus]);

  return (
    <>
      <div className={styles.liveMarkets}>
        {marketData && marketData[0] && (
          <>
            <div className={styles.marketIndex}>
              <div className={styles.indexName}>SENSEX: </div>
              <div className={`${styles.indexValue} numberFonts`}>
                {marketData[0]?.sensex.CurrentIndexValue}
              </div>
              <div
                className={`numberFonts ${styles.indexChange} ${Number(marketData[0]?.sensex.NetChange) > 0 ? styles.green : styles.red}`}
              >
                {marketData[0]?.sensex.PercentChange}%
                <i
                  className={
                    Number(marketData[0]?.sensex.NetChange) > 0
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
        )}
      </div>
    </>
  );
};

export default LiveMarketData;
