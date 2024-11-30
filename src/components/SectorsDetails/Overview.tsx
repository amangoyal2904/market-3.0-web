import React from "react";
import styles from "./SectorsDetails.module.scss";
import { dateFormat } from "@/utils/index";
import { trackingEvent } from "@/utils/ga";
import Returns from "./Returns";

const SectorsDetailsOverview = React.memo(({ overviewData, descText }: any) => {
  return (
    <section id="overview" className={styles.overview}>
      <div className="dflex align-item-center">
        <h1 className={styles.headline}>{`${overviewData?.assetName}`}</h1>
        <a
          href={"/stocks/sectors"}
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
        </a>
      </div>

      {!!descText && <p className={styles.desc}>{descText}</p>}

      <div className={styles.overviewBottom}>
        <Returns data={overviewData} />
        <div className={styles.advDeclBox}>
          <div className={styles.widget}>
            <div className="dflex align-item-center space-between">
              <div className="dflex align-item-center">
                <p className={styles.title}>Advance/Decline</p>
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
          </div>
        </div>
      </div>
    </section>
  );
});
SectorsDetailsOverview.displayName = "SectorsDetailsOverview";
export default SectorsDetailsOverview;
