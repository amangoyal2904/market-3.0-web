import React, { useEffect } from "react";
import styles from "./BreadCrumb.module.scss";
import { usePathname } from "next/navigation";

interface Props {
  pageName: any;
  pagePath: string;
}

const getLiPath = (router: string) => {
  if (router == "/stocksrecos/overview") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Recommendations
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("/stocksrecos/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="https://economictimes.indiatimes.com/markets/stocks/recos">
            Stock Recommendations
          </a>
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router == "/markets/stock-screener") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Screener
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("stock-screener/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/stock-screener">Stock Screener</a>
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("/stocks/marketstats/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/stocks/marketstats/intraday/top-gainers">Stocks</a>
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("/stocks/marketstats-technicals/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/stocks/marketstats-technicals/golden-cross">Technicals</a>
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router == "/markets/indices") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Indices
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("/indices/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/indices">Indices</a>
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router == "/watchlist") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Watchlist
        </li>
      ),
      showCurrLi: true,
    };
  } else if (router.includes("market-moods/")) {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Market Mood
        </li>
      ),
      showCurrLi: true,
    };
  } else {
    return {};
  }
};

export const BreadCrumb: React.FC<Props> = ({ pageName, pagePath }) => {
  const router = pagePath;
  const getLiTab = getLiPath(router);

  return (
    <div className={styles.breadCrumbContainer}>
      <ul className={styles.brUl}>
        <li className={styles.home}>
          <a href="https://economictimes.indiatimes.com/">Home</a>
        </li>
        <li className={styles.marketshome}>
          {router == "/home" ? (
            "Markets"
          ) : (
            <>
              <span className="eticon_caret_right"></span>
              <a href="/home">Markets</a>
            </>
          )}
        </li>
        {getLiTab.showCurrLi && getLiTab.currentLiNode}
        {getLiTab.showNextLi &&
          pageName.length > 0 &&
          pageName?.map((item: any, index: any) => {
            return (
              <>
                <li>
                  <span className="eticon_caret_right"></span>
                  {item.redirectUrl ? (
                    <a href={item.redirectUrl}>{item.label}</a>
                  ) : (
                    item.label
                  )}
                </li>
              </>
            );
          })}
      </ul>
    </div>
  );
};
export default BreadCrumb;
