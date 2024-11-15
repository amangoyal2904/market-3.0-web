"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { getCookie } from "@/utils";
import { useStateContext } from "@/store/StateContext";
import styles from "./TechnicalCharts.module.scss";
import { getTechnicalChartPageMetaData } from "./utilities";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const Header = ({ symbolInfo }: any) => {
  return (
    <div className={styles.header}>
      <h2 className={`${styles.title} symbol-name`}>
        <a href="" target="_blank" title={symbolInfo.description}>
          {symbolInfo.description}
        </a>
      </h2>
      <h3 className={`${styles.otherData} symbol-exchange`}>
        <p>Exchange:</p>
        <span>{symbolInfo["exchange-traded"]}</span>
      </h3>
    </div>
  );
};

const TechnicalChartsClient = (defaultWidgetProps: any) => {
  const {
    patternId,
    gaHit,
    chartType,
    symbolData,
    relatedNews,
    technicalAnalysis,
    definitions,
  } = defaultWidgetProps;
  const { state } = useStateContext();
  const { ssoReady, isLogin, ssoid } = state.login;
  const [isScriptReady, setIsScriptReady] = useState(false);

  const userid = useMemo(() => {
    if (ssoReady) {
      return isLogin ? ssoid : getCookie("_grx") || "";
    }
    return "";
  }, [ssoReady, isLogin, ssoid]);

  const widgetProps = useMemo(() => {
    return { ...defaultWidgetProps, user_id: userid };
  }, [defaultWidgetProps, userid]);

  const handleSymbolData = useCallback((event: MessageEvent) => {
    if (event.data && event.data.symbolData) {
      const { symbol, fullName, exchange, entity, periodicity } =
        event.data.symbolData;

      // Direct DOM manipulation for symbol name and exchange
      const nameElement = document.querySelector(".symbol-name a");
      const exchangeElement = document.querySelector(".symbol-exchange span");

      if (nameElement) nameElement.textContent = fullName;
      if (exchangeElement) exchangeElement.textContent = exchange;

      const { title, desc, keywords } = getTechnicalChartPageMetaData(
        event.data.symbolData,
      );
      document.title = title;

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaDescription) metaDescription.setAttribute("content", desc);
      if (metaKeywords) metaKeywords.setAttribute("content", keywords);

      const urlParams = new URLSearchParams();
      urlParams.set("entity", entity);

      if (entity === "forex") {
        urlParams.set("periodicity", periodicity);
        urlParams.set("createdby", "Mecklai");
        urlParams.set("pairnameparent", symbol);
        urlParams.set("currencypairname", symbol);
      } else if (entity === "commodity") {
        const match = symbol.match(/^([A-Z]+)_(\d{4}-\d{2}-\d{2})_([A-Z]+)$/);
        const name = match ? match[1] : symbol;
        const expiryDate = match ? match[2] : null;
        urlParams.set("symbol", name);
        if (match) {
          urlParams.set("expirydate", expiryDate.trim());
        }
      } else {
        urlParams.set("symbol", symbol);
        urlParams.set("exchange", exchange);
        urlParams.set("periodicity", periodicity);
      }

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleSymbolData);
    return () => {
      window.removeEventListener("message", handleSymbolData);
    };
  }, [handleSymbolData]);

  return (
    <div className={styles.container}>
      <Header symbolInfo={symbolData} />
      <div className={styles.chartWrapper}>
        <Script
          src="/marketsweb/static/v28/datafeeds/udf/dist/bundle.js"
          strategy="lazyOnload"
          onReady={() => {
            setIsScriptReady(true);
          }}
        />
        {userid && isScriptReady ? (
          <TVChartContainer
            {...widgetProps}
            patternId={patternId}
            gaHit={gaHit}
            chartType={chartType}
            updatePageUrl="true"
          />
        ) : (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
      <ul className={styles.list}>
        <li>
          Intraday Charts now have option of 1 min duration also. This is
          available for NSE and BSE Indices & Stock charts only.
        </li>
        <li>
          Please Note: The Intraday price data is close to real-time and
          doesn&apos;t capture all traded ticks. There can be delay in ticks
          updation, we advise user review before doing any trade based on these
          data points
        </li>
      </ul>
      <div className={styles.quickLinks}>
        <p>Quick Links:</p>
        <h5 className={styles.ql}>
          <a
            href="/marketstats/pid-237,exchange-50,pageno-1,sortby-volume,sortorder-desc,ctype-MACD.cms"
            title="Real-time Technical Screener for Indicators"
            target="_blank"
          >
            Screener
          </a>
        </h5>
        <h5 className={styles.ql}>
          <a
            href="/markets/visualize.cms?cs=technical_link"
            title="Multilple Chart view of Nifty, Sensex, Portfolio, Watchlist and all other NSE/BSE Indices"
            target="_blank"
          >
            Visualize
          </a>
        </h5>
      </div>
      {Boolean(relatedNews?.length) && (
        <div className={styles.section}>
          <h3 className={styles.heading}>Related News</h3>
          <ul className={styles.relatedNews}>
            {relatedNews.map(
              (
                item: { id: string; hl: string; wu: string; im?: string },
                index: number,
              ) => (
                <li
                  key={item.id || `relatedNews_${index}`}
                  className={styles.stryline}
                >
                  {item.im && (
                    <div className={styles.imageHolder}>
                      <a
                        title={item.hl}
                        href={item.wu}
                        aria-label={`Read more: ${item.hl}`}
                      >
                        <img
                          src={item.im}
                          className={styles.artimg}
                          height="55"
                          width="76"
                          alt={item.hl}
                          title={item.hl}
                          loading="lazy"
                        />
                      </a>
                    </div>
                  )}
                  <a
                    title={item.hl}
                    href={item.wu}
                    aria-label={`Read more: ${item.hl}`}
                  >
                    {item.hl}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
      <div className={styles.section}>
        <h3 className={styles.heading}>Technical Analysis: Knowledge Center</h3>
        <div className={styles.lhs}>
          {Boolean(technicalAnalysis?.length) && (
            <ul className={styles.technicalAnalysis}>
              {technicalAnalysis.map(
                (
                  item: { id: string; hl: string; wu: string; syn: string },
                  index: number,
                ) => (
                  <li key={item.id || `technicalAnalysis_${index}`}>
                    <h3>
                      <a
                        title={item.hl}
                        href={item.wu}
                        aria-label={`Read more: ${item.hl}`}
                      >
                        {item.hl}
                      </a>
                    </h3>
                    <p className={styles.syn}>
                      {item.syn}
                      <a
                        title={item.hl}
                        href={item.wu}
                        aria-label={`Read more: ${item.hl}`}
                      >
                        more <i className="eticon_chevron_right"></i>
                      </a>
                    </p>
                  </li>
                ),
              )}
            </ul>
          )}
          {Boolean(definitions?.length) && (
            <ul className={styles.technicalAnalysis}>
              {definitions.map(
                (
                  item: { id: string; hl: string; wu: string; syn: string },
                  index: number,
                ) => (
                  <li key={item.id || `definitions_${index}`}>
                    <h3>
                      <a
                        title={item.hl}
                        href={item.wu}
                        aria-label={`Read more: ${item.hl}`}
                      >
                        {item.hl}
                      </a>
                    </h3>
                    <p className={styles.syn}>
                      {item.syn}
                      <a
                        title={item.hl}
                        href={item.wu}
                        aria-label={`Read more: ${item.hl}`}
                      >
                        more <i className="eticon_chevron_right"></i>
                      </a>
                    </p>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
        <div className={styles.rhs}></div>
      </div>
    </div>
  );
};

export default TechnicalChartsClient;
