import React from "react";
import Link from "next/link";
import styles from "./StockReportsPlus.module.scss";

interface Props {
  datalist: any;
}

const StockReportsType5: React.FC<Props> = ({ datalist }) => {
  const companyUrl = `/${datalist.seoName}/stockreports/companyid-${datalist.companyID}.cms`;
  const reportUrl = `/${datalist.seoName}/stockreports/reportid-${datalist.companyID}.cms`;

  const calculateGraphValue = (
    data: any,
    keyId: string,
    recoByCount: number,
  ) => {
    const item =
      data.find((item: { keyId: any }) => item.keyId === keyId) || {};
    const value = parseFloat(item.value) || 0;
    const roundedValue = Math.round(value);
    const calculatedpercent = `${roundedValue === 0 ? 5 : (roundedValue / recoByCount) * 100 + 5}%`;
    return { roundedValue, calculatedpercent, item };
  };

  const recoByCount = Math.round(
    parseFloat(datalist.data[0].value.trim().replace(/%$/, "")),
  );

  const recoStrongBuyValue = calculateGraphValue(
    datalist.data,
    "sr_recStrongBuyCnt",
    recoByCount,
  );
  const recoBuyValue = calculateGraphValue(
    datalist.data,
    "sr_recBuyCnt",
    recoByCount,
  );
  const recoHoldValue = calculateGraphValue(
    datalist.data,
    "sr_recHoldCnt",
    recoByCount,
  );
  const recoSellValue = calculateGraphValue(
    datalist.data,
    "sr_recReduceCnt",
    recoByCount,
  );
  const recoStrongSellValue = calculateGraphValue(
    datalist.data,
    "sr_recSellCnt",
    recoByCount,
  );
  const expectedReturn = calculateGraphValue(
    datalist.data,
    "sr_targetVsCurrent",
    recoByCount,
  );
  const target = calculateGraphValue(
    datalist.data,
    "sr_priceTargetMean",
    recoByCount,
  );
  const currentPrice = calculateGraphValue(
    datalist.data,
    "lastTradedPrice",
    recoByCount,
  );
  return (
    <div className={styles.cardSec}>
      <div className={styles.boxWraper}>
        <div className={`${styles.leftSec} ${styles.leftType3}`}>
          {/* <div className={styles.nameBlur}>no prime user</div> */}
          <h2 className={styles.heading}>
            <a href={companyUrl} target="_blank">
              {datalist.name}
            </a>
          </h2>
          <h3 className={styles.heading3}>Hold</h3>
          <h4
            className={styles.heading4}
          >{`Mean Recos by ${recoByCount} Analysts`}</h4>
          <div className={styles.stockRecoChart}>
            <div className={`${styles.bar} ${styles.strongSell}`}>
              <div className={styles.graphBoxWraper}>
                <div
                  className={styles.graphBox}
                  style={{ height: `${recoStrongSellValue.calculatedpercent}` }}
                ></div>
              </div>
              <div className={styles.topTxt}>
                {recoStrongSellValue.roundedValue}
              </div>
              <div className={styles.btmTxt}>Strong Sell</div>
            </div>
            <div className={`${styles.bar} ${styles.sell}`}>
              <div className={styles.graphBoxWraper}>
                <div
                  className={styles.graphBox}
                  style={{ height: `${recoSellValue.calculatedpercent}` }}
                ></div>
              </div>
              <div className={styles.topTxt}>{recoSellValue.roundedValue}</div>
              <div className={styles.btmTxt}>Sell</div>
            </div>
            <div className={`${styles.bar} ${styles.hold}`}>
              <div className={styles.graphBoxWraper}>
                <div
                  className={styles.graphBox}
                  style={{ height: `${recoHoldValue.calculatedpercent}` }}
                ></div>
              </div>
              <div className={styles.topTxt}>{recoHoldValue.roundedValue}</div>
              <div className={styles.btmTxt}>Hold</div>
            </div>
            <div className={`${styles.bar} ${styles.buy}`}>
              <div className={styles.graphBoxWraper}>
                <div
                  className={styles.graphBox}
                  style={{ height: `${recoBuyValue.calculatedpercent}` }}
                ></div>
              </div>
              <div className={styles.topTxt}>{recoBuyValue.roundedValue}</div>
              <div className={styles.btmTxt}>Buy</div>
            </div>
            <div className={`${styles.bar} ${styles.strongBuy}`}>
              <div className={styles.graphBoxWraper}>
                <div
                  className={styles.graphBox}
                  style={{ height: `${recoStrongBuyValue.calculatedpercent}` }}
                ></div>
              </div>
              <div className={styles.topTxt}>
                {recoStrongBuyValue.roundedValue}
              </div>
              <div className={styles.btmTxt}>Strong Buy</div>
            </div>
          </div>
          <a className={styles.reportSec} href={reportUrl} target="_blank">
            <i className={styles.viewPdf}></i>
            <span className={styles.reportTxt}>View Report</span>
          </a>
          {/* <span className={styles.reportSec}>
            <i className={styles.viewPdf}></i>
            <span className={styles.reportTxt}>View Report</span>
          </span> */}
        </div>
        <div className={styles.rightSec}>
          <div className={styles.rightSecWrap}>
            <div className={styles.returnCardWrap}>
              <div className={styles.card}>
                <div className={styles.txt}>Expected Return</div>
                <div className={styles.value}>{expectedReturn.item.value}</div>
              </div>
              <div className={`${styles.card} ${styles.middleCard}`}>
                <div className={styles.txt}>1Y Target</div>
                {/* <div className={styles.priceBlur}></div> */}
                <div className={styles.value}>{target.item.value}</div>
              </div>
              <div className={`${styles.card} ${styles.bottomCard}`}>
                <div className={styles.txt}>Current Price</div>
                {/* <div className={styles.priceBlur}></div> */}
                <div className={styles.value}>{currentPrice.item.value}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReportsType5;
