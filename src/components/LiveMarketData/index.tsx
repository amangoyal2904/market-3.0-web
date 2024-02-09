import React, { useEffect, useState } from "react";
import Service from "../../network/service";
import styles from "./LiveMarketData.module.scss";
import { APP_ENV } from "../../utils";
import APIS_CONFIG from "../../network/api_config.json";

const LiveMarketData = () => {
  const [marketData, setMarketData] = useState<any>([]);
  let x: any = null;
  useEffect(() => {
    x = setInterval(getLiveMarketData, 5000);
  }, []);

  const getLiveMarketData = async () => {
    const url = (APIS_CONFIG as any)?.LIVE_MARKET_DATA[APP_ENV];
    const res = await Service.get({ url, params: {} });
    if (res?.status === 200) {
      marketlivedata(await res.text());
    }
  };
  const marketlivedata = (data: any) => {
    const jsonStartIndex = data.indexOf("[");
    const jsonEndIndex = data.lastIndexOf("]");
    const jsonString = data.substring(jsonStartIndex, jsonEndIndex + 1);
    console.log("live Data", JSON.parse(jsonString));
    setMarketData(JSON.parse(jsonString));
    if (
      marketData &&
      marketData[0] &&
      marketData[0].marketstatus.currentMarketStatus !== "Live"
    ) {
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
              <div className={styles.indexValue}>
                {marketData[0]?.sensex.CurrentIndexValue}
              </div>
              <div
                className={`${styles.indexChange} ${Number(marketData[0]?.sensex.NetChange) > 0 ? "eticon_up_arrow green" : "eticon_down_arrow red"}`}
              >
                {marketData[0]?.sensex.PercentChange}
              </div>
            </div>
            <div className={styles.marketIndex}>
              <div className={styles.indexName}>NIFTY:</div>
              <div className={styles.indexValue}>
                {marketData[0]?.nifty.CurrentIndexValue}
              </div>
              <div
                className={`${styles.indexChange} ${Number(marketData[0]?.nifty.NetChange) > 0 ? "eticon_up_arrow green" : "eticon_down_arrow red"}`}
              >
                {marketData[0]?.nifty.PercentChange}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LiveMarketData;
