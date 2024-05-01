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
      listItemSchema: "",
    };
  } else if (router.includes("/stocksrecos/")) {
    return {
      showNextLi: true,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>
          <a href="/stocksrecos/overview">Stock Recommendations</a>
        </li>
      ),
      showCurrLi: true,
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Recommendations",
        item: { "@id": "/stocksrecos/overview" },
      },
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
      listItemSchema: "",
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
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stock Screener",
        item: { "@id": "/markets/stock-screener" },
      },
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
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Stocks",
        item: { "@id": "/stocks/marketstats/intraday/top-gainers" },
      },
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
      listItemSchema: {
        "@type": "ListItem",
        position: "3",
        name: "Technicals",
        item: { "@id": "/stocks/marketstats-technicals/golden-cross" },
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
          <a href="/markets/indices">Indices</a>
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
  } else if (router.includes("market-moods/")) {
    return {
      showNextLi: false,
      currentLiNode: (
        <li>
          <span className="eticon_caret_right"></span>Market Mood
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
      item: { "@id": "https://economictimes.indiatimes.com" },
    },
    {
      "@type": "ListItem",
      position: "2",
      name: "Markets",
      item: { "@id": "/home" },
    },
    ...(getLiTab ? [getLiTab.listItemSchema] : []),
  ];

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

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemListElement,
  };
};

export const BreadCrumb: React.FC<Props> = ({ pageName, pagePath }) => {
  const router = pagePath;
  const getLiTab = getLiPath(router);

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
