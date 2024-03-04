import React from "react";
import styles from "./StockReportsPlus.module.scss";
interface Props {
  datalist: any;
}
const StockReportsType4: React.FC<Props> = ({ datalist }) => {
  function upgradeCard(datalist: any, keyId: string) {
    const itemValue =
      datalist.data?.find((item: { keyId: any }) => item.keyId === keyId)
        .value || {};
    const roundedValue = Math.round(itemValue);
    const itemTrend =
      datalist.data?.find((item: { keyId: any }) => item.keyId === keyId)
        .trend || {};
    return { roundedValue, itemTrend };
  }
  const companyUrl = `/${datalist.seoName}/stockreports/companyid-${datalist.companyID}.cms`;
  const earningsScore = upgradeCard(datalist, "sr_analystScore");
  const fundamentalsScore = upgradeCard(datalist, "sr_fundScore");
  const relativeValuationScore = upgradeCard(datalist, "sr_rvScore");
  const riskScore = upgradeCard(datalist, "sr_riskScore");
  const priceMomentumScore = upgradeCard(datalist, "sr_techScore");
  const avgScore = upgradeCard(datalist, "sr_avgScore");
  const prevScore = upgradeCard(datalist, "sr_avgScore3m");
  return (
    <div className={`${styles.cardSec} ${styles.btt}`}>
      {/* <div className={styles.nameBlur}>no prieme user</div> */}
      <h2 className={styles.heading}>
        <a href={companyUrl} target="_blank">
          {datalist.name}
        </a>
      </h2>
      <div className={styles.boxWraper}>
        <div className={styles.leftSec}>
          <div className={styles.smallCard}>
            <div className={styles.scoreSec}>
              <span className={styles.bigNo}>{avgScore.roundedValue}</span>
              <span className={styles.smallNo}>/10</span>
            </div>
            <div className={styles.scoreTxt}>Stock Score</div>
            <span className={styles.reportSec}>
              <i className={styles.viewPdf}></i>
              <span className={styles.reportTxt}>View Report</span>
            </span>
          </div>
          <div className={styles.ratingBox}>
            <div className={styles.norating}>No Rating (NR)</div>
            <div className={styles.negative}>Negative</div>
            <div className={styles.neutral}>Neutral</div>
            <div className={styles.positive}>Positive</div>
          </div>
        </div>
        <div className={styles.rightSec}>
          <div className={styles.upgradeCard}>
            <div className={styles.boxGraph}>
              <p>Earnings</p>
              <div className={styles.graphBg}>
                <span
                  className={`${styles.valueBox} ${styles[earningsScore.itemTrend]}`}
                  style={{ left: `${earningsScore.roundedValue}0%` }}
                >
                  <span className={styles.navalue}>
                    {earningsScore.roundedValue === 0 ? (
                      <span className={styles.navalue}>NA</span>
                    ) : (
                      earningsScore.roundedValue
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.boxGraph}>
              <p>Fundamentals</p>
              <div className={styles.graphBg}>
                <span
                  className={`${styles.valueBox} ${styles[fundamentalsScore.itemTrend]}`}
                  style={{ left: `${fundamentalsScore.roundedValue}0%` }}
                >
                  <span className={styles.navalue}>
                    {fundamentalsScore.roundedValue === 0 ? (
                      <span className={styles.navalue}>NA</span>
                    ) : (
                      fundamentalsScore.roundedValue
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.boxGraph}>
              <p>Relative Valuation</p>
              <div className={styles.graphBg}>
                <span
                  className={`${styles.valueBox} ${styles[relativeValuationScore.itemTrend]}`}
                  style={{ left: `${relativeValuationScore.roundedValue}0%` }}
                >
                  <span className={styles.navalue}>
                    {relativeValuationScore.roundedValue === 0 ? (
                      <span className={styles.navalue}>NA</span>
                    ) : (
                      relativeValuationScore.roundedValue
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.boxGraph}>
              <p>Risk</p>
              <div className={styles.graphBg}>
                <span
                  className={`${styles.valueBox} ${styles[riskScore.itemTrend]}`}
                  style={{ left: `${riskScore.roundedValue}0%` }}
                >
                  <span className={styles.navalue}>
                    {riskScore.roundedValue === 0 ? (
                      <span className={styles.navalue}>NA</span>
                    ) : (
                      riskScore.roundedValue
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.boxGraph}>
              <p>Price Momentum</p>
              <div className={styles.graphBg}>
                <span
                  className={`${styles.valueBox} ${styles[priceMomentumScore.itemTrend]}`}
                  style={{ left: `${priceMomentumScore.roundedValue}0%` }}
                >
                  <span className={styles.navalue}>
                    {priceMomentumScore.roundedValue === 0 ? (
                      <span className={styles.navalue}>NA</span>
                    ) : (
                      priceMomentumScore.roundedValue
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.prevScore}>
        Previous Score: <span>{prevScore.roundedValue}/10</span>
      </div>
    </div>
  );
};

export default StockReportsType4;
