"use client";
import React, { useState } from "react";
import StockName from "./StockName";
import ScoreBox from "./ScoreBox";
import styles from "./StockReport.module.scss";
import StockSRLoginBlocker from "../StockSRLoginBlocker";
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

interface SRCardTwoProps {
  catName: string;
  primeUser: boolean;
  loginUser: boolean;
  tabName: string;
  dataList: DataList;
}

interface CSSProperties {
  [key: string]: string | number;
}

const researchStyle = (num: string): CSSProperties => {
  if (num !== "") {
    if (parseFloat(num) === 10) {
      return { right: "-5px" };
    } else {
      return { left: `${parseFloat(num) * 10}%` };
    }
  } else {
    return { left: "10px" };
  }
};

const overlayBlockerData = {
  textForData: "Stock Report Plus is accessible for ET Prime Members only.",
  textForReport: "",
  ctaText: "Subscribe Now",
  textBenefits: "Become a member & unlock all the data and reports now.",
  discCoupon: "Special Offer: Flat 20% Off on ET Prime",
};

const SRCardTwo: React.FC<SRCardTwoProps> = ({
  catName,
  primeUser,
  loginUser,
  tabName,
  dataList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name, companyID, seoName, data } = dataList;

  const avgScore = data.find((item) => item.keyId === "sr_avgScore")?.value;
  const hasScore3m =
    data.find((item) => item.keyId === "sr_avgScore3m") !== undefined;

  const calculateStyle = (num: number | string) => {
    if (num !== "") {
      if (num === 10) {
        return { right: "-5px" };
      } else {
        return { left: `${Number(num) * 10}%` };
      }
    } else {
      return { left: "10px" };
    }
  };

  const handleClick = (value: boolean) => {
    setIsModalOpen(value);
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

  const cardClickProps = !primeUser ? { onClick: () => handleClick(true) } : {};

  return (
    <>
      <div className={`${styles.srCard}`} {...cardClickProps}>
        <StockName
          category={catName}
          primeUser={primeUser}
          tabName={tabName}
          seoName={seoName}
          companyID={companyID}
          name={name}
        />
        <div className={`${styles.sec} ${hasScore3m ? styles.withScore : ""}`}>
          <div className={styles.lsec}>
            <ScoreBox
              category={catName}
              primeUser={primeUser}
              tabName={tabName}
              seoName={seoName}
              companyID={companyID}
              avgScore={avgScore}
            />
            <div className={styles.colorIndicators}>
              <div>
                <span className={`${styles.color} ${styles.nr}`}></span>
                <span>No Rating (NR)</span>
              </div>
              <div>
                <span className={`${styles.color} ${styles.negative}`}></span>
                <span>Negative</span>
              </div>
              <div>
                <span className={`${styles.color} ${styles.neutral}`}></span>
                <span>Neutral</span>
              </div>
              <div>
                <span className={`${styles.color} ${styles.positive}`}></span>
                <span>Positive</span>
              </div>
            </div>
          </div>
          <div className={styles.rsec}>
            <table className={styles.sr}>
              <tbody>
                {data
                  .filter(
                    (item) =>
                      item.keyId == "sr_analystScore" ||
                      item.keyId == "sr_fundScore" ||
                      item.keyId == "sr_rvScore" ||
                      item.keyId == "sr_riskScore" ||
                      item.keyId == "sr_techScore",
                  )
                  .map((item) => (
                    <tr key={item.keyId}>
                      <td>
                        <span>
                          {item.keyId === "sr_analystScore" && "Earnings"}
                          {item.keyId === "sr_fundScore" && "Fundamentals"}
                          {item.keyId === "sr_rvScore" && "Relative Valuation"}
                          {item.keyId === "sr_riskScore" && "Risk"}
                          {item.keyId === "sr_techScore" && "Price Momentum"}
                        </span>
                        <div className={styles.metric}>
                          <span
                            className={`${styles.value} ${styles[item.trend]}`}
                            style={researchStyle(item.value)}
                          >
                            {!!item.value
                              ? parseInt(item.value).toFixed(0)
                              : "NR"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {hasScore3m && (
          <div className={styles.srBottomBar}>
            Previous Score:
            <span>
              {parseInt(
                data.find((item) => item.keyId === "sr_avgScore3m")!.value,
              ).toFixed(0)}
              /10
            </span>
          </div>
        )}
      </div>
      {isModalOpen && (
        <StockSRLoginBlocker
          overlayBlockerData={overlayBlockerData}
          isLoginUser={loginUser}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default SRCardTwo;
