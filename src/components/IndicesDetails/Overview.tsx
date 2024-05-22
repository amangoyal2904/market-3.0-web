import React, { useEffect, useState } from "react";
import styles from "./IndicesDetails.module.scss";
import Link from "next/link";
import { chartIntervals } from "@/utils/utility";
import { formatNumber } from "@/utils/index";
import MarketStatus from "../MarketStatus";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import { trackingEvent } from "@/utils/ga";
import GLOBAL_CONFIG from "@/network/global_config.json";

const IndicesDetailsOverview = React.memo(
  ({
    overviewData,
    descText,
    currentMarketStatus,
    symbol,
    exchange,
    exchangeId,
  }: any) => {
    const [lastTradedPrice, setLastTradedPrice] = useState<number | null>(null);
    const [interval, setInterval] = useState("1d");
    const [changePeriod, setChangePeriod] = useState("netChange");
    const [percentChange, setPercentChange] = useState("percentChange");
    const [iframeSrc, setIframeSrc] = useState(
      `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=1d&height=320&transparentBg=1`,
    );
    const handleIntervalClick = (item: any) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "indices_chart_interaction",
        event_label: `duration_change_${item?.value}`,
      });
      setInterval(item?.value);
      setChangePeriod(item?.change);
      setPercentChange(item?.percentChange);
      setIframeSrc(
        `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=${item?.value}&height=320&transparentBg=1`,
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
      overviewData[percentChange] > 0
        ? "up"
        : overviewData[percentChange] < 0
          ? "down"
          : "neutral";

    useEffect(() => {
      if (overviewData?.lastTradedPrice !== null) {
        // Check if lastTradedPrice already exists and is different
        if (
          lastTradedPrice !== null &&
          overviewData.lastTradedPrice !== lastTradedPrice
        ) {
          const trendClass =
            overviewData.lastTradedPrice > lastTradedPrice
              ? "upBg"
              : overviewData.lastTradedPrice < lastTradedPrice
                ? "downBg"
                : "noBg";
          const element = document.getElementById("lastTradedPrice");
          if (element) {
            element.classList.add(trendClass);
            setTimeout(() => {
              element.classList.remove("upBg", "downBg");
            }, 500);
          }
        }
        setLastTradedPrice(overviewData.lastTradedPrice);
      }
    }, [overviewData?.lastTradedPrice]);

    return (
      <section id="overview" className={styles.overview}>
        <div className="dflex align-item-center">
          <h1 className={styles.headline}>{overviewData?.assetName}</h1>
          <Link
            href={
              exchangeId == "47" ? "/markets/indices/bse" : "/markets/indices"
            }
            title="View all Indices"
            className={styles.viewAll}
            onClick={() =>
              trackingEvent("et_push_event", {
                event_category: "mercury_engagement",
                event_action: "page_cta_click",
                event_label: "View all Indices",
              })
            }
          >
            View all Indices
          </Link>
        </div>
        <div className={styles.indexOpts}>
          <div className="dflex align-item-center">
            <p
              className={styles.ltp}
              id="lastTradedPrice"
            >{`₹${formatNumber(overviewData?.lastTradedPrice, 2)}`}</p>
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
              <span>{`${Math.abs(overviewData[changePeriod])?.toFixed(2)} (${overviewData[percentChange]?.toFixed(2)}%)`}</span>
            </div>
          </div>
          {/* <div className="dflex  align-item-center">
          <span className="default-btn">Export</span>
          <span className="default-btn">Share</span>
        </div> */}
        </div>
        <MarketStatus
          currentMarketStatus={currentMarketStatus}
          dateTime={parseInt(overviewData?.dateTime) * 1000}
          withSeparator={true}
        />
        {!!descText && <p className={styles.desc}>{descText}</p>}
        <div id="chart">
          <div className={styles.chartOpts}>
            <ul className={styles.interval}>
              {chartIntervals.map((item: any, index: number) => {
                return (
                  <li
                    key={index}
                    className={interval === item.value ? styles.active : ""}
                    onClick={() => handleIntervalClick(item)}
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
              onClick={() => {
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "indices_chart_interaction",
                  event_label: "chart_type_change_technical",
                });
              }}
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/technical-charts?symbol=${symbol}&exchange=${exchange}&entity=index`}
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
          <Link
            href="/markets/stock-market-mood"
            title={`${overviewData?.assetName} Advance/Decline`}
            className={styles.widget}
          >
            <div className="dflex align-item-center">
              <p className={styles.title}>Advance/Decline</p>
              <span className={`eticon_caret_right ${styles.icon}`} />
            </div>
            <div className={styles.bottom}>
              <div className="dflex align-item-center space-between">
                <p
                  className={styles.head}
                >{`${overviewData?.advances} Advances`}</p>
                <p
                  className={styles.head}
                >{`${overviewData?.declines} Declines`}</p>
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
                <span
                  className={styles.label}
                >{`${overviewData?.advancesPercentage}
                  ${overviewData?.advancesPercentage && "%"}`}</span>
                <span
                  className={styles.label}
                >{`${overviewData?.declinesPercentage}
                  ${overviewData?.declinesPercentage && "%"}`}</span>
              </div>
            </div>
          </Link>
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
                    title={formatNumber(overviewData?.lastTradedPrice, 2)}
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
                    title={formatNumber(overviewData?.lastTradedPrice, 2)}
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
