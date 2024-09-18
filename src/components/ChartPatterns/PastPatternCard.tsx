import { getStockUrl } from "@/utils/utility";
import styles from "./PastPatternCard.module.scss";
import dynamic from "next/dynamic";
import Link from "next/link";

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
  stockReturn: number;
  returnTimeframe: number;
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
            <div className={`${styles.graphic} ${styles.pieChart}`}>
              <PieChart
                data={[
                  { name: "Positive", y: positiveCount ?? 0 },
                  { name: "Negative", y: negativeCount ?? 0 },
                ]}
                colors={["#198a19", "#d51131"]}
                width={90}
                height={90}
                backgroundColor="transparent"
              />
            </div>
            <div className={styles.desc}>
              <p>{`${successRate}%`}</p>
              <p>Success Rate</p>
            </div>
          </div>
          <div className={styles.list}>
            <div className={`${styles.graphic} ${styles.donutBg}`}>
              <p className={styles.return}>{`${averageReturn}%`}</p>
            </div>
            <div className={styles.desc}>
              <p>Average</p>
              <p>Return*</p>
            </div>
          </div>
          <div className={styles.list}>
            <div className={`${styles.graphic} ${styles.calendarBg}`}>
              <p className={styles.period}>{holdingPeriod}</p>
              <span className={styles.days}>Days</span>
            </div>
            <div className={styles.desc}>
              <p>Avg. Holding</p>
              <p>Period</p>
            </div>
          </div>
        </div>
        <p className={styles.helpTxt}>
          *Returns based on all positive & negative closed ideas
        </p>
      </div>
      <div className={styles.bottom}>
        <div
          className={`dflex align-item-center space-between ${styles.header}`}
        >
          <h4 className={styles.title}>Top Picks</h4>
          <Link
            className={styles.link}
            title={`${headingText} New Ideas`}
            href={`/stocks/chart-patterns/${patternType}`}
          >
            New Ideas <i className="eticon_caret_right"></i>
          </Link>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stock Name</th>
                {!subPatternFlag && <th>Pattern Formed</th>}
                <th>Return %</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              {pastPatternList.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
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
                  <td
                    className={
                      row.stockReturn > 0
                        ? "numberFonts up"
                        : row.stockReturn < 0
                          ? "numberFonts down"
                          : "numberFonts neutral"
                    }
                  >
                    {`${row.stockReturn}%`}
                    <span
                      className={`${styles.arrowIcons} ${
                        row.stockReturn > 0
                          ? "eticon_up_arrow"
                          : row.stockReturn < 0
                            ? "eticon_down_arrow"
                            : ""
                      }`}
                    />
                  </td>
                  <td
                    className={styles.ft10}
                  >{`${row.returnTimeframe} days`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!!showCta && (
          <Link
            className={styles.cta}
            title={`View All ${headingText}`}
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
  );
};

export default PastPatternCard;
