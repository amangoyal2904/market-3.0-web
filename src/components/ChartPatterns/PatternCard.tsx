import React, { useEffect, useState } from "react";
import { getStockUrl } from "@/utils/utility";
import styles from "./PatternCard.module.scss";
import { dateFormat, formatNumber } from "@/utils";
import { renderIconPaths } from "@/utils/iconUtils";
import StockDescription from "./StockDescription";
import ChartClient from "@/app/chart/clients";
import Link from "next/link";

interface PatternCardProps {
  patternData: any;
  isPrime: boolean;
  latestCard?: boolean;
  onCardClick: () => void;
}

const PaywallBlur = ({ children }: { children?: React.ReactNode }) => (
  <div className="prel">
    <div className={styles.blurEffect}>
      <span className={`eticon_lock ${styles.icons}`}>
        {renderIconPaths("eticon_lock")}
      </span>
      {children && children}
    </div>
  </div>
);

export const PatternCard = ({
  patternData,
  isPrime = false,
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

  const handleImageError = () => {
    setImageSrc("https://img.etimg.com/photo/42031747.cms");
  };

  const handleImageClick = () => {
    if (isPrime) {
      setShowTechnicalChart(true);
      // Push a new state into the browser's history when the chart is shown
      window.history.pushState({ showTechnicalChart: true }, "");
    }
  };

  const removeTechnicalWidget = () => {
    setShowTechnicalChart(false);
  };

  useEffect(() => {
    if (patternData?.imageUrl) {
      setImageSrc(patternData.imageUrl);
    }
  }, [patternData?.imageUrl]);

  // Listen for the browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (showTechnicalChart) {
        removeTechnicalWidget();
        event.preventDefault();
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showTechnicalChart]);

  return (
    <div
      className={styles.card}
      onClick={() => {
        if (!isPrime) {
          onCardClick();
        }
      }}
    >
      <div
        className={`${styles.patternInfo} ${
          patternData?.trendType === "bear" ? styles.bear : styles.bull
        }`}
      >
        <span className={styles.patternName}>{patternData?.patternName}</span>
        <span>
          {patternData?.patternTrend}
          <i
            className={
              patternData?.trendType === "bear"
                ? "eticon_pattern_down_red"
                : "eticon_pattern_up_green"
            }
          ></i>
        </span>
      </div>

      {isPrime ? (
        <a
          className={styles.stockName}
          href={getStockUrl(
            patternData?.companyId,
            patternData?.companySeoName,
            "equity",
          )}
          target="_blank"
          title={patternData?.companyName}
        >
          {patternData?.companyName}
        </a>
      ) : (
        <div className="prel">
          <PaywallBlur>
            <span className={styles.text}>Unlock Company Name</span>
          </PaywallBlur>
        </div>
      )}

      <ul className={styles.metrics}>
        <li className={styles.metric}>
          <span>Formed on</span>
          <p>{dateFormat(patternData?.formedDate, "%d %MMM %Y")}</p>
        </li>
        <li className={styles.metric}>
          <span>Breakout Price</span>
          {isPrime ? (
            <p>{formatNumber(patternData?.breakoutPrice)}</p>
          ) : (
            <div className="prel">
              <PaywallBlur />
            </div>
          )}
        </li>
        <li className={styles.metric}>
          <span>Current Price</span>
          {isPrime ? (
            <p>{formatNumber(patternData?.currentPrice)}</p>
          ) : (
            <div className="prel">
              <PaywallBlur />
            </div>
          )}
        </li>
      </ul>

      <img
        src={imageSrc}
        alt={`${patternData?.patternName} Technical Chart`}
        className={styles.patternImage}
        loading="lazy"
        onClick={handleImageClick}
        onError={handleImageError}
      />

      {latestCard && (
        <div className={styles.desc}>
          <i className="eticon_ai_badge"></i>
          <p
            dangerouslySetInnerHTML={{
              __html: patternData?.pastPerformanceText,
            }}
          ></p>
        </div>
      )}

      {isPrime ? (
        <>
          {latestCard && (
            <Link
              className={styles.link}
              href={`/stocks/chart-patterns/past-performance/${patternData?.patternSeoName}`}
              title={`View ${patternData?.patternName} Past Performance`}
            >
              View Past Performance <i className="eticon_next"></i>
            </Link>
          )}
          <div className={styles.bottomBar}>
            <StockDescription patternData={patternData} />
            <div
              className={styles.idea}
              style={{ background: patternData?.colourCode }}
            >
              {patternData?.ideaType}
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
