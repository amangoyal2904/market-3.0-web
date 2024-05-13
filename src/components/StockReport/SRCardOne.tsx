import React from "react";
import StockName from "./StockName"; // Import StockName component if it's in a separate file
import ScoreBox from "./ScoreBox"; // Import ScoreBox component if it's in a separate file
import styles from "./StockReport.module.scss";
interface DataListItem {
  keyId: string;
  keyText: string;
  keyDBText: string;
  value: string;
  allowSort: number;
  trend: string;
  decimalValue: number | null;
  filterFormatValue: any;
  primeFlag: any;
  valueType: any;
}

interface DataList {
  name: string;
  seoName: string;
  companyType: string;
  companyID: string;
  assetName: string | null;
  assetType: string | null;
  assetId: string | null;
  assetSeoName: string | null;
  assetSymbol: string | null;
  assetExchangeId: string | null;
  data: DataListItem[];
}

interface SRCardOneProps {
  catName: string;
  primeUser: boolean;
  tabName: string;
  dataList: DataList;
}

const SRCardOne: React.FC<SRCardOneProps> = ({
  catName,
  primeUser,
  tabName,
  dataList,
}) => {
  const { name, companyID, seoName, data } = dataList;
  const avgScore = data.find((item) => item.keyId === "sr_avgScore")?.value;
  return (
    <div className={`${styles.srCard}`}>
      <div className={styles.sec}>
        <StockName
          category={catName}
          primeUser={primeUser}
          tabName={tabName}
          seoName={seoName}
          companyID={companyID}
          name={name}
        />
        <div className={styles.lsec}>
          <ScoreBox
            category={catName}
            primeUser={primeUser}
            tabName={tabName}
            seoName={seoName}
            companyID={companyID}
            avgScore={avgScore}
          />
        </div>
        <div className={styles.rsec}>
          <table className={styles.metrics}>
            <tbody>
              <tr>
                <td className={styles.title}>Expected Returns</td>
                <td
                  className={`${styles.val} ${data.find((item) => item.keyId === "sr_targetVsCurrent")!.trend}`}
                >
                  {
                    data.find((item) => item.keyId === "sr_targetVsCurrent")!
                      .value
                  }
                </td>
              </tr>
              <tr>
                <td className={styles.title}>Stock Recommendation</td>
                <td
                  className={`${styles.val} ${data.find((item) => item.keyId === "sr_recText")!.trend}`}
                >
                  {data.find((item) => item.keyId === "sr_recText")!.value}
                </td>
              </tr>
              <tr>
                <td className={styles.title}>Target</td>
                <td className={styles.val}>
                  {data.find((item) => item.keyId === "sr_priceTargetMean") && (
                    <React.Fragment>
                      {`₹ ${data.find((item) => item.keyId === "sr_priceTargetMean")!.value}`}
                    </React.Fragment>
                  )}
                  {!data.find(
                    (item) => item.keyId === "sr_priceTargetMean",
                  ) && <span className={`${styles.val} ${styles.blur}`}></span>}
                </td>
              </tr>
              <tr>
                <td className={styles.title}>Current Price</td>
                <td className={styles.val}>
                  {data.find((item) => item.keyId === "lastTradedPrice") && (
                    <React.Fragment>
                      {`₹ ${data.find((item) => item.keyId === "lastTradedPrice")!.value}`}
                    </React.Fragment>
                  )}
                  {!data.find((item) => item.keyId === "lastTradedPrice") && (
                    <span className={`${styles.val} ${styles.blur}`}></span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SRCardOne;
