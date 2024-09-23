import { getStockUrl } from "@/utils/utility";
import styles from "./PastPatternCard.module.scss";
import dynamic from "next/dynamic";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import { dateFormat } from "@/utils";

// Lazy-load PieChart
const PieChart = dynamic(() => import("../PieChart"), {
  ssr: false, // Set to true if you need server-side rendering
  loading: () => <div className={styles.spinner}></div>, // Optional: a fallback while the component is loading
});

interface Pattern {
  companyId: string;
  companySeoName: string;
  companyName: string;
  patternName?: string;
  patternFormedDate?: string;
  breakoutPrice?: number;
  marketCap?: number;
  stockReturn: number;
  returnTimeframe: number;
  industryName?: string;
}

interface PatternData {
  subPatternFlag?: boolean;
  headingText?: string;
  positiveCount?: number;
  negativeCount?: number;
  successRate?: number;
  averageReturn?: number;
  holdingPeriod?: string;
  patternType?: string;
  totalCount?: number;
  companyName?: string;
  pastPatternList: Pattern[];
}

interface PastPatternCardProps {
  patternData: PatternData;
  timeFrame?: string; // Made optional
  showCta?: boolean;
}

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
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.left}>Stock Name</th>
                {!subPatternFlag && <th>Pattern Formed</th>}
                <th>Formed Date</th>
                <th>Breakout Price</th>
                <th>Return %</th>
                <th>Days</th>
                <th>Market Cap</th>
                <th className={styles.center}>Industry</th>
              </tr>
            </thead>
            <tbody>
              {pastPatternList.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className={`${styles.left} ${styles.firstTh}`}>
                    <a
                      href={getStockUrl(
                        row.companyId,
                        row.companySeoName,
                        "equity",
                      )}
                      title={row.companyName}
                      className={styles.stName}
                      target="_blank"
                    >
                      {row.companyName}
                    </a>
                  </td>
                  {!subPatternFlag && (
                    <td className={styles.ft10}>
                      <span className={styles.bull}>{row.patternName}</span>
                    </td>
                  )}
                  <td>{dateFormat(row.patternFormedDate, "%d %MMM")}</td>
                  <td>{row.breakoutPrice}</td>
                  <td
                    className={
                      row.stockReturn < 0
                        ? "numberFonts down"
                        : "numberFonts up"
                    }
                  >
                    {`${row.stockReturn}%`}
                    <span
                      className={`${styles.arrowIcons} ${
                        row.stockReturn < 0
                          ? "eticon_down_arrow"
                          : "eticon_up_arrow"
                      }`}
                    />
                  </td>
                  <td>{`${row.returnTimeframe} days`}</td>
                  <td>{row.marketCap}</td>
                  <td>{row.industryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
