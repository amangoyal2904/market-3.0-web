import { useState } from "react";
import styles from "./IndicesDetails.module.scss";
import Link from "next/link";
import { chartIntervals } from "@/utils/utility";

const IndicesDetailsOverview = ({
  overviewData,
  currentMarketStatus,
  symbol,
  exchange,
  exchangeId,
}: any) => {
  const [interval, setInterval] = useState("1d");
  const [iframeSrc, setIframeSrc] = useState(
    `https://economictimes.indiatimes.com/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=1d`,
  );
  const handleIntervalClick = (period: string) => {
    setInterval(period);
    setIframeSrc(
      `https://economictimes.indiatimes.com/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=${period}`,
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
  return (
    <section id="overview" className={styles.overview}>
      <div className="dflex align-item-center">
        <h1 className={styles.heading}>{overviewData.assetName}</h1>
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
          <p className={styles.ltp}>₹{overviewData.lastTradedPrice}</p>
          <div className={styles.change}>
            {overviewData.trend && (
              <span
                className={`${styles.arrowIcons} ${
                  overviewData.trend == "up"
                    ? "eticon_up_arrow"
                    : overviewData.trend == "down"
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
        {!!currentMarketStatus && (
          <>
            {currentMarketStatus.toUpperCase() != "CLOSED" && (
              <span className="liveBlinker"></span>
            )}
            <span className={styles.marketStatus}>{currentMarketStatus}</span>
          </>
        )}
        <span className={styles.updatetime}>11:23 PM | Oct 27, 2020</span>
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
          <Link
            className="eticon_candlestick"
            target="_blank"
            title={`${symbol} Technicals`}
            href={`https://economictimes.indiatimes.com/markets/technical-charts?symbol=${symbol}&exchange=${exchange}&entity=index`}
          >
            <span className="path1"></span>
            <span className="path2"></span>
          </Link>
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
          <div className="dflex align-item-center space-between">
            <p className={styles.title}>Advance/Decline</p>
            <span className={styles.desc}>Mar 12, 2024</span>
          </div>
          <div className={styles.bottom}>
            <div className="dflex align-item-center space-between">
              <p className={styles.head}>{overviewData.advances} Advances</p>
              <p className={styles.head}>{overviewData.declines} Declines</p>
            </div>
            <div
              className={`dflex align-item-center space-between ${styles.gap2}`}
            >
              <div className={`${styles.bar} ${styles.up}`}></div>
              <div className={`${styles.bar} ${styles.down}`}></div>
            </div>
            <div className="dflex align-item-center space-between">
              <span className={styles.label}>
                {overviewData.advancesPercentage}%
              </span>
              <span className={styles.label}>
                {overviewData.declinesPercentage}%
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
              <span className={`${styles.label} ${styles.up}`}>Low</span>
              <div className={styles.bar}>
                <span
                  title={overviewData.lastTradedPrice}
                  className={styles.currentPosition}
                  style={{
                    left:
                      calcualteScalePercentage(
                        overviewData.lastTradedPrice,
                        overviewData.lowPrice,
                        overviewData.highPrice,
                      ) + "%",
                  }}
                ></span>
              </div>
              <span className={`${styles.label} ${styles.down}`}>High</span>
            </div>
            <div className="dflex align-item-center space-between">
              <span className={styles.label}>{overviewData.lowPrice}</span>
              <span className={styles.label}>{overviewData.highPrice}</span>
            </div>
          </div>
        </div>
        <div className={styles.widget}>
          <div className="dflex align-item-center">
            <p className={styles.title}>52 Week Range</p>
          </div>
          <div className={styles.bottom}>
            <div className={`dflex align-item-center ${styles.gap10}`}>
              <span className={`${styles.label} ${styles.down}`}>Low</span>
              <div className={styles.bar}>
                <span
                  title={overviewData.lastTradedPrice}
                  className={styles.currentPosition}
                  style={{
                    left:
                      calcualteScalePercentage(
                        overviewData.lastTradedPrice,
                        overviewData.fiftyTwoWeekLow,
                        overviewData.fiftyTwoWeekHigh,
                      ) + "%",
                  }}
                ></span>
              </div>
              <span className={`${styles.label} ${styles.up}`}>High</span>
            </div>
            <div className="dflex align-item-center space-between">
              <span className={styles.label}>
                {overviewData.fiftyTwoWeekLow}
              </span>
              <span className={styles.label}>
                {overviewData.fiftyTwoWeekHigh}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndicesDetailsOverview;
