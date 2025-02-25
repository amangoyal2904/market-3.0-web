import React from "react";
import styles from "./BreadCrumb.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import Link from "next/link";

interface Props {
  pageName: any;
  pagePath: string;
}

const getLiPath = (router: string, pagePath: string) => {
  if (router == "/markets/stock-recos/overview") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Recommendations
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/stock-recos/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link
            href={(GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"]}
            title="Stock Recommendations"
          >
            Stock Recommendations
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Recommendations",
        item: {
          "@id": (GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"],
        },
      },
    };
  } else if (router == "/markets/stock-screener") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Screeners
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("stock-screener/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link href={"/markets/stock-screener"} title="Stock Screeners">
            Stock Screeners
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Screeners",
        item: { "@id": "/markets/stock-screener" },
      },
    };
  } else if (
    router.includes("/stocks/marketstats/") ||
    pagePath.includes("/stocks/marketstats?")
  ) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link href={"/stocks/marketstats/top-gainers"} title="Stocks">
            Stocks
          </Link>
        </li>
      ),
      showCurrLi: false,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: {
          "@id": "/stocks/marketstats/top-gainers",
        },
      },
    };
  } else if (router.includes("/stocks/marketstats-technicals/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link
            href={"/stocks/marketstats-technicals/golden-cross"}
            title="Stocks"
          >
            Stocks
          </Link>
        </li>
      ),
      showCurrLi: false,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Technicals",
        item: {
          "@id": "/stocks/marketstats-technicals/golden-cross",
        },
      },
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
      listItemSchema: "",
    };
  } else if (router.includes("/indices/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link href={"/markets/indices"} title="Indices">
            Indices
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Indices",
        item: { "@id": "/markets/indices" },
      },
    };
  } else if (router == "/stocks/sectors") {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href={"/markets/stocks"} title="Stocks">
            Stocks
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: { "@id": "/markets/stocks" },
      },
    };
  } else if (router.includes("/sectors/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href={"/markets/stocks"} title="Stocks">
            Stocks
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: { "@id": "/markets/stocks" },
      },
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
      listItemSchema: "",
    };
  } else if (router == "/markets/stock-market-mood") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Market Mood
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router == "/markets/fii-dii-activity") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>FII DII Activity
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/fii-dii-activity/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link href={"/markets/fii-dii-activity"} title="FII DII Activity">
            FII DII Activity
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router == "/markets/corporate-announcements") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Corporate Announcements
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/corporate-actions/")) {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Corporate Actions
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router == "/stocks/chart-patterns") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Chart Patterns
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/stocks/chart-patterns/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link href="/stocks/chart-patterns" title="Chart Patterns">
            Chart Patterns
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router == "/markets/benefits/stockreportsplus") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Stock Reports Plus
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/stockreportsplus/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a
            href={"/markets/benefits/stockreportsplus"}
            title="Stock Reports Plus"
          >
            Stock Reports Plus
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (
    router == "/markets/top-india-investors-portfolio/individual" ||
    router == "/markets/top-india-investors-portfolio/institutional"
  ) {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Investors Portfolio
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (
    router.includes("/markets/top-india-investors-portfolio/") &&
    router !== "/markets/top-india-investors-portfolio/individual" &&
    router != "/markets/top-india-investors-portfolio/institutional"
  ) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <Link
            href={"/markets/top-india-investors-portfolio/individual"}
            title="Investors Portfolio"
          >
            Investors Portfolio
          </Link>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router === "/markets/stocks/earnings") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          Earnings
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router === "/markets/stocks/earnings/upcoming-results") {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/stocks/earnings" title="Earnings">
            Earnings
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/stocks/earnings/declared-results/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/stocks/earnings" title="Earnings">
            Earnings
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/stocks/earnings/sector-aggregate/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/stocks/earnings" title="Earnings">
            Earnings
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router == "/markets/etlearn") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>ET Learn
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else if (router.includes("/markets/etlearn/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/markets/etlearn" title="ET Learn">
            ET Learn
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "ET Learn",
        item: {
          "@id": "/markets/etlearn",
        },
      },
    };
  } else if (router === "/markets/technical-charts") {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          Technical Chart
        </li>
      ),
      showCurrLi: true,
      listItemSchema: "",
    };
  } else {
    return {};
  }
};

const jsonLd = (getLiTab: any, pageName: any) => {
  const objWithUrl = pageName.filter(
    (item: any, index: any) => item.redirectUrl !== "",
  );

  const itemListElement = [
    {
      "@type": "ListItem",
      position: "1",
      name: "Home",
      item: {
        "@id": "https://economictimes.indiatimes.com",
      },
    },
    {
      "@type": "ListItem",
      position: "2",
      name: "Markets",
      item: { "@id": "/markets/live-coverage" },
    },
    ...(getLiTab ? [getLiTab.listItemSchema] : []),
  ];

  try {
    const createBreadcrumbItem = (
      label: any,
      redirectUrl: any,
      position: any,
    ) => {
      const listItem = {
        "@type": "ListItem",
        position: position.toString(),
        name: label,
        item: { "@id": redirectUrl },
      };
      return listItem;
    };

    objWithUrl?.forEach((item: any, index: any) => {
      const position = itemListElement.length + index + 1;
      const breadcrumbItem = createBreadcrumbItem(
        item.label,
        item.redirectUrl,
        position,
      );
      itemListElement.push(breadcrumbItem);
    });
  } catch (e) {
    console.log("jsonLd Error:", e);
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemListElement,
  };
};

export const BreadCrumb: React.FC<Props> = ({ pageName, pagePath }) => {
  const router = pagePath.includes("?") ? pagePath.split("?")[0] : pagePath;
  const getLiTab = getLiPath(router, pagePath);

  return (
    <div className={styles.breadCrumbContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(getLiTab, pageName)),
        }}
      />
      <ul className={styles.brUl}>
        <li className={styles.home}>
          <a href={(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]} title="Home">
            Home
          </a>
        </li>
        <li className={styles.marketshome}>
          {router == "/markets/live-coverage" ? (
            <>
              <span className="eticon_caret_right"></span>Markets Live
            </>
          ) : (
            <>
              <span className="eticon_caret_right"></span>
              <Link href={"/markets/live-coverage"} title="Markets Live">
                Markets Live
              </Link>
            </>
          )}
        </li>
        {getLiTab.showCurrLi && getLiTab.currentLiNode}
        {getLiTab.showNextLi &&
          pageName.length > 0 &&
          pageName?.map((item: any, index: any) => {
            return (
              <li key={item.label + index}>
                <span className="eticon_caret_right"></span>
                {item.redirectUrl ? (
                  <a href={item.redirectUrl} title={item.label}>
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
};
export default BreadCrumb;
