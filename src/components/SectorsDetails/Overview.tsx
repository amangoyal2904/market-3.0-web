import React, { useEffect, useState } from "react";
import styles from "./SectorsDetails.module.scss";
import Link from "next/link";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV, dateFormat } from "@/utils/index";
import { trackingEvent } from "@/utils/ga";
import Returns from "./Returns";

const SectorsDetailsOverview = React.memo(({ overviewData, descText }: any) => {
  const [lastTradedPrice, setLastTradedPrice] = useState<number | null>(null);

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
        <h1 className={styles.headline}>{overviewData?.assetName} Sector</h1>
        <Link
          href="/stocks/sectors"
          title="View all Sectors"
          className={styles.viewAll}
          onClick={() =>
            trackingEvent("et_push_event", {
              event_category: "mercury_engagement",
              event_action: "page_cta_click",
              event_label: "View all Sectors",
            })
          }
        >
          View all Sectors
        </Link>
      </div>

      {!!descText && <p className={styles.desc}>{descText}</p>}

      <div className={styles.overviewBottom}>
        <Returns data={overviewData} />
        <div className={styles.advDeclBox}>
          <Link
            href="/markets/stock-market-mood"
            title={`${overviewData?.assetName} Advance/Decline`}
            className={styles.widget}
          >
            <div className="dflex align-item-center space-between">
              <div className="dflex align-item-center">
                <p className={styles.title}>Advance/Decline</p>
                <span className={`eticon_caret_right ${styles.icon}`} />
              </div>
              <div className={styles.dateBox}>
                {dateFormat(overviewData.latestDate * 1000, "%MMM %d, %Y")}
              </div>
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
        </div>
      </div>
    </section>
  );
});
SectorsDetailsOverview.displayName = "SectorsDetailsOverview";
export default SectorsDetailsOverview;
