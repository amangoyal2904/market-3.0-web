import React from "react";
import styles from "./Indices.module.scss";
import Link from "next/link";
import { chartIntervals } from "@/utils/utility";
import RenderChart from "@/components/RenderChart";

const IndicesClient = ({
  overview = {},
  technicals = {},
  others = {},
}: any) => {
  return (
    <>
      <section id="overview">
        <div className="dflex align-item-center">
          <h1 className={styles.heading}>{overview.assetName}</h1>
          <Link
            href="/markets/indices"
            target="_blank"
            title="View all Indices"
            className={styles.viewAll}
          >
            View all Indices
          </Link>
        </div>
        <div className={styles.indexOpts}>
          <div className="dflex align-item-center">
            <p className={styles.ltp}>₹{overview.lastTradedPrice}</p>
            <div className={styles.change}>
              {overview.trend && (
                <span
                  className={`${styles.arrowIcons} ${
                    overview.trend == "up"
                      ? "eticon_up_arrow"
                      : overview.trend == "down"
                        ? "eticon_down_arrow"
                        : ""
                  }`}
                />
              )}
              <span>-31.75 (-0.14%)</span>
            </div>
          </div>
          <div className="dflex  align-item-center">
            <span className="default-btn">Export</span>
            <span className="default-btn">Share</span>
          </div>
        </div>
        <div className="dflex align-item-center">
          <span className="liveBlinker"></span>
          <span className={styles.marketStatus}>LIVE</span>
          <span className={styles.updatetime}>11:23 PM | Oct 27, 2020</span>
        </div>
      </section>
      <section id="chart">
        <div className={styles.chartOpts}>
          <ul className={styles.interval}>
            {chartIntervals.map((item: any, index: number) => {
              return (
                <li key={index} className={index === 0 ? styles.active : ""}>
                  {item.label}
                </li>
              );
            })}
          </ul>
          <span className="eticon_candlestick">
            <span className="path1"></span>
            <span className="path2"></span>
          </span>
        </div>
        <RenderChart type="index" symbol="SENSEX" exchange="BSE" period="1d" />
      </section>
    </>
  );
};

export default IndicesClient;
