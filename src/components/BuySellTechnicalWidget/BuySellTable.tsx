import React from "react";
import styles from "./BuySell.module.scss";
import WatchlistAddition from "../WatchlistAddition";
import { getStockUrl } from "@/utils/utility";
import { formatNumber } from "@/utils";
import Loader from "../Loader";
const BuySellTable = ({ data, crossoverType, processingLoader }: any) => {
  return (
    <div className={styles.tableWrapper} id="table">
      {!!processingLoader && <Loader loaderType="container" />}
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            <th className={styles.left}>Stock Name</th>
            <th>Price</th>
            <th>Chg</th>
            <th>Chg%</th>
            <th>{crossoverType == "Bullish" ? "Gain" : "Decline"}*</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index}>
              <td className={styles.left}>
                <div className={styles.tdColWrap}>
                  <WatchlistAddition
                    companyName={item.companyShortName}
                    companyId={item.companyId}
                    companyType={item.companyType}
                    customStyle={{
                      width: "18px",
                      height: "18px",
                    }}
                  />
                  <a
                    className={styles.ellipses}
                    href={getStockUrl(
                      item.companyId,
                      item.seoName,
                      item.companyType,
                    )}
                    target="_blank"
                    title={`${item.companyShortName} Share Price`}
                  >
                    {item.companyShortName}
                  </a>
                </div>
              </td>
              <td>{formatNumber(item.ltp, 2)}</td>
              <td>{formatNumber(item.absoluteChange, 2)}</td>
              <td>{formatNumber(item.percentChange, 2)}%</td>
              <td>
                {crossoverType == "Bullish"
                  ? formatNumber(item.averagePriceGainLossBullish, 2)
                  : formatNumber(item.averagePriceGainLossBearish, 2)}
                %
              </td>
              <td>{formatNumber(item.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuySellTable;
