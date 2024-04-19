"use client";
import React, { useEffect, useState } from "react";
import Service from "../../network/service";
import styles from "./LiveMarketData.module.scss";
import { APP_ENV } from "../../utils";
import APIS_CONFIG from "../../network/api_config.json";
import { useStateContext } from "../../store/StateContext";

const LiveMarketData = () => {
  const { state, dispatch } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [marketData, setMarketData] = useState<any>([]);
  //const [marketStatus, setMarketStatus] = useState<any>({})
  let x: any = null,
    y: any = null;
  // useEffect(() => {
  //   getLiveMarketData();
  // }, [currentMarketStatus]);

  useEffect(() => {
    getMarketStatus();
    y = setInterval(getMarketStatus, 4000);
  }, []);
  //console.log("--------->", state.marketStatus, currentMarketStatus);
  const getMarketStatus = async () => {
    try {
      const url = (APIS_CONFIG as any)?.MARKET_STATUS[APP_ENV];
      const res = await Service.get({ url, params: {} });
      if (res?.status === 200) {
        const result = await res.json();
        console.log(
          "Market Status-----> ",
          result?.currentMarketStatus?.toUpperCase(),
        );
        dispatch({
          type: "MARKET_STATUS",
          payload: {
            currentMarketStatus: result?.currentMarketStatus?.toUpperCase(),
          },
        });
        if (result?.currentMarketStatus?.toUpperCase() == "CLOSED") {
          clearInterval(y);
        } else {
          getLiveMarketData(result?.currentMarketStatus?.toUpperCase());
        }
      } else {
        console.log("Market Status-----> Error in response");
        clearInterval(y);
      }
    } catch (err) {
      console.log("Error in getting market Status ", err);
    }
  };
  const getLiveMarketData = async (marketStatus: any) => {
    try {
      const url = (APIS_CONFIG as any)?.LIVE_MARKET_DATA[APP_ENV];
      const res = await Service.get({ url, params: {} });
      if (res?.status === 200) {
        marketlivedata(await res.text(), marketStatus);
      } else {
        // console.log(
        //   "live Data=========>>>>>>>",
        //   state.marketStatus,
        //   currentMarketStatus,
        // );
        clearInterval(x);
      }
    } catch (err) {
      console.log("Error in Live Market Live ", err);
    }
  };
  const marketlivedata = (data: any, marketStatus: any) => {
    const jsonStartIndex = data.indexOf("[");
    const jsonEndIndex = data.lastIndexOf("]");
    const jsonString = data.substring(jsonStartIndex, jsonEndIndex + 1);
    console.log("live Data==============?????", marketStatus);
    setMarketData(JSON.parse(jsonString));
    if (marketStatus == "CLOSED") {
      console.log("Market Closed----->");
      clearInterval(x);
    }
  };

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
