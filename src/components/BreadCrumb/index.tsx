import React from "react";
import styles from "./BreadCrumb.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { convertToAbsoluteUrl } from "@/utils";

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
          <a
            href={convertToAbsoluteUrl(
              (GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"],
            )}
            title="Stock Recommendations"
          >
            Stock Recommendations
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Recommendations",
        item: {
          "@id": convertToAbsoluteUrl(
            (GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"],
          ),
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
          <a
            href={convertToAbsoluteUrl("/markets/stock-screener")}
            title="Stock Screeners"
          >
            Stock Screeners
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Screeners",
        item: { "@id": convertToAbsoluteUrl("/markets/stock-screener") },
      },
    };
  }
  // else if (
  //   router == "/stocks/marketstats/top-gainers" ||
  //   router.includes("/stocks/marketstats/top-gainers/") ||
  //   router.includes("/stocks/marketstats/top-gainers?") ||
  //   router == "/stocks/marketstats-technicals/golden-cross" ||
  //   router.includes("/stocks/marketstats-technicals/golden-cross/") ||
  //   router.includes("/stocks/marketstats-technicals/golden-cross?")
  // ) {
  //   return {
  //     showNextLi: false,
  //     currentLiNode: (
  //       <li>
  //         <span className="eticon_caret_right"></span>Stocks
  //       </li>
  //     ),
  //     showCurrLi: true,
  //     listItemSchema: "",
  //   };
  // }
  else if (
    router.includes("/stocks/marketstats/") ||
    pagePath.includes("/stocks/marketstats?")
  ) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a
            href={convertToAbsoluteUrl("/stocks/marketstats/top-gainers")}
            title="Stocks"
          >
            Stocks
          </a>
        </li>
      ),
      showCurrLi: false,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: {
          "@id": convertToAbsoluteUrl("/stocks/marketstats/top-gainers"),
        },
      },
    };
  } else if (router.includes("/stocks/marketstats-technicals/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a
            href={convertToAbsoluteUrl(
              "/stocks/marketstats-technicals/golden-cross",
            )}
            title="Stocks"
          >
            Stocks
          </a>
        </li>
      ),
      showCurrLi: false,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Technicals",
        item: {
          "@id": convertToAbsoluteUrl(
            "/stocks/marketstats-technicals/golden-cross",
          ),
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
          <a href={convertToAbsoluteUrl("/markets/indices")} title="Indices">
            Indices
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Indices",
        item: { "@id": convertToAbsoluteUrl("/markets/indices") },
      },
    };
  } else if (router == "/stocks/sectors") {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href={convertToAbsoluteUrl("/markets/stocks")} title="Stocks">
            Stocks
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: { "@id": convertToAbsoluteUrl("/markets/stocks") },
      },
    };
  } else if (router.includes("/sectors/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href={convertToAbsoluteUrl("/markets/stocks")} title="Stocks">
            Stocks
          </a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: { "@id": convertToAbsoluteUrl("/markets/stocks") },
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
          <a
            href={convertToAbsoluteUrl("/markets/fii-dii-activity")}
            title="FII DII Activity"
          >
            FII DII Activity
          </a>
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
            href={convertToAbsoluteUrl("/markets/benefits/stockreportsplus")}
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
          <a
            href={convertToAbsoluteUrl(
              "/markets/top-india-investors-portfolio/individual",
            )}
            title="Investors Portfolio"
          >
            Investors Portfolio
          </a>
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
        "@id": convertToAbsoluteUrl("https://economictimes.indiatimes.com"),
      },
    },
    {
      "@type": "ListItem",
      position: "2",
      name: "Markets",
      item: { "@id": convertToAbsoluteUrl("/markets/live-coverage") },
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
        item: { "@id": convertToAbsoluteUrl(redirectUrl) },
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
          <a
            href={convertToAbsoluteUrl(
              (GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"],
            )}
            title="Home"
          >
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
              <a
                href={convertToAbsoluteUrl("/markets/live-coverage")}
                title="Markets Live"
              >
                Markets Live
              </a>
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
                  <a
                    href={convertToAbsoluteUrl(item.redirectUrl)}
                    title={item.label}
                  >
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
