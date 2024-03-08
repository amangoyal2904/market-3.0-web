import React from "react";
import styles from "./styles.module.scss";
import WatchlistAddition from "../WatchlistAddition";
import { json } from "stream/consumers";

const Grid = (props: any) => {
  const { recosDetailResult } = props;
  console.log(`tabData  --- >`, recosDetailResult);
  return (
    <div className={styles.gridMainBox}>
      <div className={styles.tableWrapper} id="table">
        <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Potential Upside</th>
              <th>Avg. Target</th>
              <th>Current Price</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>Hold</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recosDetailResult[0]?.data?.map((obj: any, index: any) => (
              <tr key={`recosTable_${index}`}>
                <td>
                  <div className={styles.tdColWrap}>
                    <WatchlistAddition
                      companyName={obj.companyName}
                      companyId={obj.companyId}
                      companyType="equity"
                      customStyle={{
                        position: "relative",
                        marginRight: "10px",
                        width: "16px",
                        height: "16px",
                        fontSize: "14px",
                      }}
                    />
                    <span>{obj.companyName}</span>
                  </div>
                </td>
                <td>
                  {obj.potentialDirection == "Up" ? (
                    <span className={`${styles.upSide} ${styles.potential}`}>
                      {obj.potentialValue}%{" "}
                      <span
                        className={`eticon_up_arrow ${styles.icons}`}
                      ></span>
                    </span>
                  ) : obj.potentialDirection == "Down" ? (
                    <span className={`${styles.downSide} ${styles.potential}`}>
                      {obj.potentialValue}%{" "}
                      <span
                        className={`eticon_down_arrow ${styles.icons}`}
                      ></span>
                    </span>
                  ) : (
                    <span className={`${styles.neutral} ${styles.potential}`}>
                      {obj.potentialValue}%{" "}
                      <span className={`${styles.icons}`}></span>
                    </span>
                  )}
                </td>
                <td>
                  <div className={styles.avgTargetVal}>
                    <span className={`eticon_rupee`}></span>
                    {obj.target}
                  </div>
                </td>
                <td>
                  <div className={styles.currentPriceVal}>
                    <span className={`eticon_rupee`}></span>
                    {obj.currentPrice}
                  </div>
                </td>
                <td>
                  <div className={styles.buyCountVal}>{obj.buyCount}</div>
                </td>
                <td>
                  <div className={styles.sellCountVal}>{obj.sellCount}</div>
                </td>
                <td>
                  <div className={styles.holdCountVal}>{obj.holdCount}</div>
                </td>
                <td>
                  <div className={styles.totalCountVal}>{obj.totalCount}</div>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Grid;
