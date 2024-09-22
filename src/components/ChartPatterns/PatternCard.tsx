import React, { useEffect, useState, useMemo } from "react";
import { getStockUrl } from "@/utils/utility";
import styles from "./PatternCard.module.scss";
import { dateFormat, formatNumber } from "@/utils";
import { renderIconPaths } from "@/utils/iconUtils";
import StockDescription from "./StockDescription";
import ChartClient from "@/app/chart/clients";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

interface PatternCardProps {
  patternData: any;
  latestCard?: boolean;
  onCardClick: () => void;
}

const PaywallBlur = ({ children }: { children?: React.ReactNode }) => (
  <div className="prel">
    <div className={styles.blurEffect}>
      <span className={`eticon_lock ${styles.icons}`}>
        {renderIconPaths("eticon_lock")}
      </span>
      {children}
    </div>
  </div>
);

export const PatternCard = ({
  patternData,
  latestCard = true,
  onCardClick,
}: PatternCardProps) => {
  const [showTechnicalChart, setShowTechnicalChart] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    "https://img.etimg.com/photo/42031747.cms",
  );

  const defaultWidgetProps: any = {
    symbol: patternData?.symbol,
    interval: "1D",
    theme: "light",
    enabled_features: ["show_zoom_and_move_buttons_on_touch"],
    disabled_features: [
      "header_saveload",
      "use_localstorage_for_settings",
      "left_toolbar",
      "header_widget",
      "timeframes_toolbar",
      "main_series_scale_menu",
      "context_menus",
      "go_to_date",
      "edit_buttons_in_legend",
      "create_volume_indicator_by_default",
      "border_around_the_chart",
      "adaptive_logo",
    ],
    fullscreen: false,
  };

  const {
    lastUpdatedDate,
    imageUrl,
    isLocked,
    trendType,
    patternName,
    companyId,
    companySeoName,
    companyName,
    formedDate,
    formedTime,
    breakoutPrice,
    ideaFlag,
    currentPrice,
    closedPatternReturns,
    pastPerformanceText,
    patternSeoName,
    colourCode,
  } = patternData;

  useEffect(() => {
    if (imageUrl) {
      setImageSrc(imageUrl);
    }
  }, [imageUrl]);
  lastUpdatedDate;
  const handleImageClick = () => {
    if (!isLocked) {
      setShowTechnicalChart(true);
      window.history.pushState({ showTechnicalChart: true }, "");
    }
  };

  const removeTechnicalWidget = () => {
    setShowTechnicalChart(false);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (showTechnicalChart) {
        removeTechnicalWidget();
        event.preventDefault();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showTechnicalChart]);

  return (
    <div className={styles.card} onClick={isLocked ? onCardClick : undefined}>
      <div
        className={`${styles.patternInfo} ${trendType === "bear" ? styles.bear : styles.bull}`}
      >
        <span className={styles.patternName}>{patternName}</span>
        <span>
          {patternData?.patternTrend}
          <i
            className={
              trendType === "bear"
                ? "eticon_pattern_down_red"
                : "eticon_pattern_up_green"
            }
          ></i>
        </span>
      </div>

      {!isLocked ? (
        <a
          className={styles.stockName}
          href={getStockUrl(companyId, companySeoName, "equity")}
          target="_blank"
          title={companyName}
        >
          {companyName}
        </a>
      ) : (
        <PaywallBlur>
          <span className={styles.text}>Unlock Company Name</span>
        </PaywallBlur>
      )}

      <ul className={styles.metrics}>
        <li className={styles.metric}>
          <span>Formed on</span>
          <p>
            {dateFormat(formedDate, "%d %MMM")}
            <span className={styles.time}>{formedTime}</span>
          </p>
        </li>
        <li className={styles.metric}>
          <span>Breakout Price</span>
          {!isLocked ? <p>{formatNumber(breakoutPrice)}</p> : <PaywallBlur />}
        </li>
        <li className={styles.metric}>
          <span>
            {ideaFlag === "ideaActive" ? "Current Price" : "Return %"}
          </span>
          {!isLocked ? (
            <p
              className={
                ideaFlag !== "ideaActive"
                  ? closedPatternReturns < 0
                    ? "down"
                    : "up"
                  : ""
              }
            >
              {ideaFlag === "ideaActive" ? (
                formatNumber(currentPrice)
              ) : (
                <>
                  {`${Math.abs(closedPatternReturns)?.toFixed(2)}%`}
                  <i
                    className={
                      closedPatternReturns < 0
                        ? "eticon_down_arrow"
                        : "eticon_up_arrow"
                    }
                  ></i>
                </>
              )}
            </p>
          ) : (
            <PaywallBlur />
          )}
        </li>
      </ul>

      <img
        src={imageSrc}
        alt={`${patternName} Technical Chart`}
        className={styles.patternImage}
        loading="lazy"
        onClick={handleImageClick}
        onError={() => setImageSrc("https://img.etimg.com/photo/42031747.cms")}
      />

      {latestCard && (
        <div className={styles.desc}>
          <i className="eticon_ai_badge"></i>
          <p dangerouslySetInnerHTML={{ __html: pastPerformanceText }}></p>
        </div>
      )}

      {!isLocked ? (
        <>
          {latestCard && (
            <Link
              className={styles.link}
              href={`/stocks/chart-patterns/past-performance/${patternSeoName}`}
              title={`View ${patternName} Past Performance`}
              onClick={() =>
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "page_cta_click",
                  event_label: `View Past Performance - ${patternName}`,
                })
              }
            >
              View Past Performance <i className="eticon_next"></i>
            </Link>
          )}
          <div className={styles.bottomBar}>
            <StockDescription patternData={patternData} />
            <div className={styles.idea} style={{ background: colourCode }}>
              <span className={styles.ideaType}>{patternData?.ideaType}</span>
              {ideaFlag !== "ideaActive" && (
                <span className={styles.minAgo}>
                  {patternData?.lastUpdatedText}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.centerContainer}>
          <div className={styles.unlockCta}>
            <span className={`eticon_lock_filled ${styles.icons}`}></span>
            <p>Unlock Stock Name</p>
          </div>
        </div>
      )}

      {showTechnicalChart && (
        <div className={styles.technicalModal}>
          <div className={styles.header}>
            <i
              onClick={removeTechnicalWidget}
              className={`${styles.icon} ${styles.lg} eticon_caret_left`}
            ></i>
            <img
              src="/marketsmweb/img/chart_pattern_logo.svg"
              className={styles.logo}
              width={156}
              height={22}
              alt="Chart Pattern Logo"
            />
            <i
              onClick={removeTechnicalWidget}
              className={`${styles.icon} eticon_cross`}
            ></i>
          </div>
          <div className={styles.container}>
            <ChartClient
              {...defaultWidgetProps}
              patternId={patternData.id}
              gaHit={false}
              chartType={null}
              savePatternImages={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
