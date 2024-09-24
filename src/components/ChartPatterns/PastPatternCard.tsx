import styles from "./PastPatternCard.module.scss";
import dynamic from "next/dynamic";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import ChartPatternTableContainer from "./ChartPatternTableContainer";

// Lazy-load PieChart
const PieChart = dynamic(() => import("../PieChart"), {
  ssr: false, // Set to true if you need server-side rendering
  loading: () => <div className={styles.spinner}></div>, // Optional: a fallback while the component is loading
});

import { Pattern, PatternData, PastPatternCardProps } from "./types";

const PastPatternCard = ({
  patternData,
  timeFrame,
  showCta = true,
}: PastPatternCardProps) => {
  const {
    subPatternFlag,
    pastPatternList,
    headingText,
    positiveCount,
    negativeCount,
    successRate,
    averageReturn,
    holdingPeriod,
    patternType,
    totalCount,
    companyName,
  } = patternData;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{headingText}</h3>
        <div className={styles.metric}>
          <div className={styles.list}>
            <div className={styles.pieChart}>
              <PieChart
                data={[
                  { name: "Positive", y: positiveCount ?? 0 },
                  { name: "Negative", y: negativeCount ?? 0 },
                ]}
                colors={["#198a19", "#d51131"]}
                width={110}
                height={110}
                backgroundColor="transparent"
              />
            </div>
            <p className={styles.labelSm}>{`${totalCount} Total Ideas`}</p>
          </div>
          <div className={styles.list}>
            <p className={styles.value}>{`${successRate}%`}</p>
            <p className={styles.label}>Success Rate</p>
          </div>
          <div className={styles.list}>
            <p className={styles.value}>{`${averageReturn}%`}</p>
            <p className={styles.label}>Average Return*</p>
          </div>
          <div className={styles.list}>
            <p className={styles.value}>{`${holdingPeriod} Days`}</p>
            <p className={styles.label}>Avg. Holding Period</p>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div
          className={`dflex align-item-center space-between ${styles.header}`}
        >
          <h4 className={styles.title}>Top Picks</h4>
        </div>
        <ChartPatternTableContainer
          pastPatternList={pastPatternList}
          subPatternFlag={subPatternFlag}
        />
        <div className="dflex align-item-center space-between">
          <div className={styles.helpTxt}>
            *Returns based on all positive & negative closed ideas
          </div>
          <div className={styles.cta}>
            <Link
              className={styles.link}
              title={`${headingText} New Ideas`}
              href={`/stocks/chart-patterns/${patternType}`}
              onClick={() => {
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "page_cta_click",
                  event_label: `New Ideas - ${headingText}`,
                });
              }}
            >
              New Ideas
            </Link>
            {!!showCta && (
              <Link
                className={styles.link}
                title={`View All ${headingText}`}
                onClick={() => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "page_cta_click",
                    event_label: `View All Past Ideas - ${headingText}`,
                  });
                }}
                href={
                  patternType !== "bullish"
                    ? `/stocks/chart-patterns/past-patterns/${patternType}${timeFrame && timeFrame !== "1m" ? `?timeframe=${timeFrame}` : ""}`
                    : `/stocks/chart-patterns/past-patterns${timeFrame && timeFrame !== "1m" ? `?timeframe=${timeFrame}` : ""}`
                }
              >
                {`View all ${totalCount} Past Ideas`}
                <i className="eticon_next"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPatternCard;
