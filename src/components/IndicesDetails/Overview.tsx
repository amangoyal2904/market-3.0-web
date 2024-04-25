import React, { useState } from "react";
import styles from "./IndicesDetails.module.scss";
import Link from "next/link";
import { chartIntervals } from "@/utils/utility";
import { dateFormat, formatNumber } from "@/utils/index";

const IndicesDetailsOverview = React.memo(
  ({
    overviewData,
    currentMarketStatus,
    symbol,
    exchange,
    exchangeId,
  }: any) => {
    const [interval, setInterval] = useState("1d");
    const [iframeSrc, setIframeSrc] = useState(
      `https://etdev8243.indiatimes.com/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=1d&height=320&transparentBg=1`,
    );
    const handleIntervalClick = (period: string) => {
      setInterval(period);
      setIframeSrc(
        `https://etdev8243.indiatimes.com/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=${period}&height=320&transparentBg=1`,
      );
    };
    const calcualteScalePercentage = (
      value: number,
      low: number,
      high: number,
    ) => {
      const range = high - low;
      const position = value - low;
      const percentage = (position / range) * 100;
      return percentage;
    };
    const trend =
      overviewData?.percentChange > 0
        ? "up"
        : overviewData?.percentChange < 0
          ? "down"
          : "neutral";
    return (
      <section id="overview" className={styles.overview}>
        <div className="dflex align-item-center">
          <h1 className={styles.headline}>{overviewData?.assetName}</h1>
          <Link
            href="/markets/indices"
            title="View all Indices"
            className={styles.viewAll}
          >
            View all Indices
          </Link>
        </div>
        <div className={styles.indexOpts}>
          <div className="dflex align-item-center">
            <p className={styles.ltp}>
              ₹{formatNumber(overviewData?.lastTradedPrice)}
            </p>
            <div
              className={`${styles.change} ${trend == "up" ? styles.up : trend == "down" ? styles.down : ""}`}
            >
              {trend && (
                <span
                  className={`${styles.arrowIcons} ${
                    trend == "up"
                      ? "eticon_up_arrow"
                      : trend == "down"
                        ? "eticon_down_arrow"
                        : ""
                  }`}
                />
              )}
              <span>
                {overviewData?.netChange?.toFixed(2)} (
                {overviewData?.percentChange?.toFixed(2)}%)
              </span>
            </div>
          </div>
          {/* <div className="dflex  align-item-center">
          <span className="default-btn">Export</span>
          <span className="default-btn">Share</span>
        </div> */}
        </div>
        <div className="dflex align-item-center">
          {!!currentMarketStatus && (
            <>
              {currentMarketStatus.toUpperCase() != "CLOSED" && (
                <span className="liveBlinker"></span>
              )}
              <span className={styles.marketStatus}>{currentMarketStatus}</span>
            </>
          )}
          <span className={styles.updatetime}>
            {dateFormat(
              parseInt(overviewData?.dateTime) * 1000,
              "%h:%m %p | %MMM %d, %Y",
            )}
          </span>
        </div>
        <div id="chart">
          <div className={styles.chartOpts}>
            <ul className={styles.interval}>
              {chartIntervals.map((item: any, index: number) => {
                return (
                  <li
                    key={index}
                    className={interval === item.value ? styles.active : ""}
                    onClick={() => handleIntervalClick(item.value)}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
            <a
              className={styles.technical}
              target="_blank"
              title={`Technicals: ${overviewData?.assetName}`}
              href={`https://economictimes.indiatimes.com/markets/technical-charts?symbol=${symbol}&exchange=${exchange}&entity=index`}
            >
              <span className="eticon_candlestick">
                <span className="path1"></span>
                <span className="path2"></span>
              </span>
              Technicals
            </a>
          </div>
          <iframe
            src={iframeSrc}
            style={{
              width: "100%",
              height: "320px",
              border: "none",
              outline: "none",
            }}
          />
        </div>
        <div className={styles.bottomWidgets}>
          <div className={styles.widget}>
            <div className="dflex align-item-center">
              <p className={styles.title}>Advance/Decline</p>
            </div>
            <div className={styles.bottom}>
              <div className="dflex align-item-center space-between">
                <p className={styles.head}>{overviewData?.advances} Advances</p>
                <p className={styles.head}>{overviewData?.declines} Declines</p>
              </div>
              <div
                className={`dflex align-item-center space-between ${overviewData?.advancesPercentage != "100" && overviewData?.declinesPercentage != "100" ? styles.gap2 : ""}`}
              >
                <div
                  className={`${styles.bar} ${styles.up}`}
                  style={{ width: overviewData?.advancesPercentage + "%" }}
                ></div>
                <div
                  className={`${styles.bar} ${styles.down}`}
                  style={{ width: overviewData?.declinesPercentage + "%" }}
                ></div>
              </div>
              <div className="dflex align-item-center space-between">
                <span className={styles.label}>
                  {overviewData?.advancesPercentage?.toFixed(2)}
                  {overviewData?.advancesPercentage && "%"}
                </span>
                <span className={styles.label}>
                  {overviewData?.declinesPercentage?.toFixed(2)}
                  {overviewData?.declinesPercentage && "%"}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.widget}>
            <div className="dflex align-item-center">
              <p className={styles.title}>1D Range</p>
            </div>
            <div className={styles.bottom}>
              <div className={`dflex align-item-center ${styles.gap10}`}>
                <span className={`${styles.label} ${styles.up} ${styles.bold}`}>
                  Low
                </span>
                <div className={styles.bar}>
                  <span
                    title={overviewData?.lastTradedPrice}
                    className={styles.currentPosition}
                    style={{
                      left:
                        calcualteScalePercentage(
                          overviewData?.lastTradedPrice,
                          overviewData?.lowPrice,
                          overviewData?.highPrice,
                        ) + "%",
                    }}
                  ></span>
                </div>
                <span
                  className={`${styles.label} ${styles.down} ${styles.bold}`}
                >
                  High
                </span>
              </div>
              <div className="dflex align-item-center space-between">
                <span className={styles.label}>
                  {formatNumber(overviewData?.lowPrice)}
                </span>
                <span className={styles.label}>
                  {formatNumber(overviewData?.highPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.widget}>
            <div className="dflex align-item-center">
              <p className={styles.title}>52 Week Range</p>
            </div>
            <div className={styles.bottom}>
              <div className={`dflex align-item-center ${styles.gap10}`}>
                <span
                  className={`${styles.label} ${styles.down} ${styles.bold}`}
                >
                  Low
                </span>
                <div className={styles.bar}>
                  <span
                    title={overviewData?.lastTradedPrice}
                    className={styles.currentPosition}
                    style={{
                      left:
                        calcualteScalePercentage(
                          overviewData?.lastTradedPrice,
                          overviewData?.fiftyTwoWeekLow,
                          overviewData?.fiftyTwoWeekHigh,
                        ) + "%",
                    }}
                  ></span>
                </div>
                <span className={`${styles.label} ${styles.up} ${styles.bold}`}>
                  High
                </span>
              </div>
              <div className="dflex align-item-center space-between">
                <span className={styles.label}>
                  {formatNumber(overviewData?.fiftyTwoWeekLow)}
                </span>
                <span className={styles.label}>
                  {formatNumber(overviewData?.fiftyTwoWeekHigh)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
IndicesDetailsOverview.displayName = "IndicesDetailsOverview";
export default IndicesDetailsOverview;
