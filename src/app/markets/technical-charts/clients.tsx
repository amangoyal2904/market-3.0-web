"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import { getCookie } from "@/utils";
import { useStateContext } from "@/store/StateContext";
import styles from "./TechnicalCharts.module.scss";
import { getTechnicalChartPageMetaData } from "./utilities";
import TrendingInMarketsList from "@/components/TrendingInMarkets/list";
import DfpAds from "@/components/Ad/DfpAds";
import AdInfo from "@/components/Ad/AdInfo/technicalChartAds.json";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import { getSymbolInfo } from "@/utils/utility";
import { renderToString } from "react-dom/server";

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false },
);

const getHref = (symbolInfo: any, domain: string | undefined) => {
  if (!symbolInfo?.seoname) return null;

  const paths: Record<string, string> = {
    stock: `${domain}/${symbolInfo.seoname}/stocks/companyid-${symbolInfo.tagId}.cms`,
    index: `/markets/indices/${symbolInfo.seoname}`,
    commodity: `${domain}/commoditysummary/symbol-${symbolInfo.seoname}.cms?expiry=${symbolInfo?.commodityinfo?.expirydate}`,
    forex: `${domain}/markets/forex/currency-converter/${symbolInfo.seoname}`,
  };

  return paths[symbolInfo.type] || null;
};

const SymbolTitle = ({
  symbolInfo,
  href,
}: {
  symbolInfo: any;
  href: string | null;
}) => {
  const displayText =
    symbolInfo.type === "commodity"
      ? symbolInfo.name
      : symbolInfo.shortname || symbolInfo.description;

  return (
    <h2 className={`${styles.title} symbol-name`}>
      {href ? (
        <a href={href} target="_blank" title={symbolInfo.description}>
          {displayText}
        </a>
      ) : (
        displayText
      )}
    </h2>
  );
};

const SymbolAdditionalInfo = ({ symbolInfo }: { symbolInfo: any }) => (
  <>
    {symbolInfo.type !== "forex" && (
      <h3 className={`${styles.otherData} symbol-exchange`}>
        <p>Exchange:</p>
        <span>{symbolInfo["exchange-traded"]}</span>
      </h3>
    )}
    {symbolInfo.type === "commodity" && (
      <h3 className={`${styles.otherData} symbol-exchange`}>
        <p>Expiry:</p>
        <span>{symbolInfo?.commodityinfo?.expirydate}</span>
      </h3>
    )}
  </>
);

const Header = ({ symbolInfo }: any) => {
  const domain = (APIS_CONFIG as any)?.DOMAIN[APP_ENV];
  const href = getHref(symbolInfo, domain);

  return (
    <div className={styles.header} id="tcHeader">
      <SymbolTitle symbolInfo={symbolInfo} href={href} />
      <SymbolAdditionalInfo symbolInfo={symbolInfo} />
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
    trendingList,
  } = defaultWidgetProps;
  const { state } = useStateContext();
  const { ssoReady, isLogin, isPrime, ssoid } = state.login;
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

  const handleSymbolData = useCallback(async (event: MessageEvent) => {
    if (event.data && event.data.symbolData) {
      const { symbol, entity, periodicity, exchange } = event.data.symbolData;
      const symbolData = await getSymbolInfo(symbol);

      const tcHeaderDiv = document.getElementById("tcHeader");
      if (tcHeaderDiv) {
        const headerHTML = renderToString(<Header symbolInfo={symbolData} />);
        tcHeaderDiv.innerHTML = headerHTML;
      }

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
            isLogin={isLogin}
            showVolume={symbolData?.type === "stock" ? true : false}
            assestType={symbolData?.type}
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
        <div className={`${styles.section} ${styles.column}`}>
          <h3 className={styles.heading}>Related News</h3>
          <ul className={styles.relatedNews}>
            {relatedNews.map(
              (
                item: { id: string; hl: string; wu: string; im?: string },
                index: number,
              ) => (
                <li
                  className={styles.stryline}
                  key={item.id || `relatedNews_${index}`}
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
        <div className={styles.lhs}>
          {Boolean(technicalAnalysis?.length) && (
            <>
              <h3 className={styles.heading}>
                Technical Analysis: Knowledge Center
              </h3>
              <ul className={styles.technicalAnalysis}>
                {technicalAnalysis.map(
                  (
                    item: { id: string; hl: string; wu: string; syn: string },
                    index: number,
                  ) => (
                    <Fragment key={item.id || `technicalAnalysis_${index}`}>
                      {!isPrime && index == 7 && (
                        <li className={styles.nonprime}>
                          <DfpAds adInfo={AdInfo.dfp.mid2} />
                          <DfpAds adInfo={AdInfo.dfp.mid3} />
                        </li>
                      )}
                      <li>
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
                    </Fragment>
                  ),
                )}
              </ul>
            </>
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
        <div className={styles.rhs}>
          <DfpAds adInfo={AdInfo.dfp.mid1} />
          {trendingList.length && (
            <div className={styles.widget}>
              <h4 className={styles.heading}>Trending in Markets</h4>
              <div className={styles.seoItemList}>
                {trendingList.map((item: any, index: number) => (
                  <TrendingInMarketsList
                    item={item}
                    key={`trending_${index}`}
                  />
                ))}
              </div>
            </div>
          )}
          <div className={styles.widget}>
            <h4 className={styles.heading}>Markets Trending Terms</h4>
            <div className={styles.seoItemList}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalChartsClient;
