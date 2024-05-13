"use client";
import React, { useState } from "react";
import StockName from "./StockName";
import RecoBar from "./RecoBar";
import RecoBarLabel from "./RecoBarLabel";
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

interface SRCardThreeProps {
  catName: string;
  primeUser: boolean;
  loginUser: boolean;
  tabName: string;
  dataList: DataList;
}

const overlayBlockerData = {
  textForData: "Stock Report Plus is accessible for ET Prime Members only.",
  textForReport: "",
  ctaText: "Subscribe Now",
  textBenefits: "Become a member & unlock all the data and reports now.",
  discCoupon: "Special Offer: Flat 20% Off on ET Prime",
};

const SRCardThree: React.FC<SRCardThreeProps> = ({
  catName,
  primeUser,
  loginUser,
  tabName,
  dataList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { name, companyID, seoName, data } = dataList;
  const totalNo = parseFloat(
    data.find((item) => item.keyId === "sr_recCnt")!.value.toString(),
  );

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
        <div className={styles.sec}>
          <div className={styles.rsec}>
            <StockName
              category={catName}
              primeUser={primeUser}
              tabName={tabName}
              seoName={seoName}
              companyID={companyID}
              name={name}
            />
            <p className={styles.stockRecoTitle}>
              {data.find((item) => item.keyId === "sr_recText")!.value}
            </p>
            <p className={styles.stockRecoDesc}>
              {`Mean Recos by ${totalNo} Analysts`}
            </p>
            <div className={styles.stockRecoChart}>
              {data.map((item, index) => {
                if (
                  [
                    "sr_recSellCnt",
                    "sr_recReduceCnt",
                    "sr_recHoldCnt",
                    "sr_recBuyCnt",
                    "sr_recStrongBuyCnt",
                  ].includes(item.keyId)
                ) {
                  return (
                    <RecoBar
                      key={index}
                      num={parseFloat(item.value.toString())}
                      totalNo={totalNo}
                    />
                  );
                }
                return null;
              })}
            </div>
            <div className={styles.barlabel}>
              {data.map((item, index) => {
                if (
                  [
                    "sr_recSellCnt",
                    "sr_recReduceCnt",
                    "sr_recHoldCnt",
                    "sr_recBuyCnt",
                    "sr_recStrongBuyCnt",
                  ].includes(item.keyId)
                ) {
                  let type = "";
                  switch (item.keyId) {
                    case "sr_recSellCnt":
                      type = "Strong Sell";
                      break;
                    case "sr_recReduceCnt":
                      type = "Sell";
                      break;
                    case "sr_recHoldCnt":
                      type = "Hold";
                      break;
                    case "sr_recBuyCnt":
                      type = "Buy";
                      break;
                    case "sr_recStrongBuyCnt":
                      type = "Strong Buy";
                      break;
                    default:
                      break;
                  }
                  return (
                    <RecoBarLabel
                      key={index}
                      num={parseFloat(item.value.toString())}
                      type={type}
                    />
                  );
                }
                return null;
              })}
            </div>

            {data.find((item) => item.keyId === "sr_targetVsCurrent") ? (
              <div className={styles.reportCta}>
                <a
                  href={`/${seoName}/stockreports/reportid-${companyID}.cms`}
                  target="_blank"
                  title="View Report"
                  data-ga-onclick={`SR+ ${tabName}#${catName} - ${name} View Report#href`}
                >
                  <span className={`eticon_pdf ${styles.pdfIcon}`}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </span>
                  View Report
                </a>
              </div>
            ) : (
              <div className="report_cta">
                <span className="eticon_pdf">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                </span>
                View Report
              </div>
            )}
          </div>
          <div
            className={`${styles.lsec} ${styles.highlightSr} ${styles[data.find((item) => item.keyId === "sr_targetVsCurrent")!.trend]}`}
          >
            <ul>
              <li>
                <p className={styles.title}>Expected Returns</p>
                <p className={`${styles.val} ${styles.fs16}`}>
                  {
                    data.find((item) => item.keyId === "sr_targetVsCurrent")!
                      .value
                  }
                </p>
              </li>
              <li>
                <p className={styles.title}>1Y Target</p>
                {primeUser ? (
                  <p className={`${styles.val} ${styles.bold}`}>
                    {
                      data.find((item) => item.keyId === "sr_priceTargetMean")!
                        .value
                    }
                  </p>
                ) : (
                  <p className={`${styles.val} ${styles.blur}`}></p>
                )}
              </li>
              <li>
                <p className={styles.title}>Current Price</p>
                {primeUser ? (
                  <p className={styles.val}>
                    {
                      data.find((item) => item.keyId === "lastTradedPrice")!
                        .value
                    }
                  </p>
                ) : (
                  <p className={`${styles.val} ${styles.blur}`}></p>
                )}
              </li>
            </ul>
          </div>
        </div>
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

export default SRCardThree;
