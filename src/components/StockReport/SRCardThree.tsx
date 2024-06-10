"use client";
import React from "react";
import StockName from "./StockName";
import RecoBar from "./RecoBar";
import RecoBarLabel from "./RecoBarLabel";
import styles from "./StockReport.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
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
  handleClick: any;
  tabName: string;
  dataList: DataList;
}

const overlayBlockerData = {
  textForData:
    "Exclusive stock reports are accessible for ETPrime members only.",
  ctaText: "Subscribe Now",
  textBenefits: "Become a member & unlock all reports now.",
};

const SRCardThree: React.FC<SRCardThreeProps> = ({
  catName,
  primeUser,
  handleClick,
  tabName,
  dataList,
}) => {
  const { name, companyID, seoName, data } = dataList;
  const totalNo = parseFloat(
    data.find((item) => item?.keyId === "sr_recCnt")?.value?.toString() || "0",
  );

  const cardClickProps = !primeUser ? { onClick: () => handleClick(true) } : {};

  return (
    <>
      <div
        className={`${styles.srCard} ${!primeUser ? styles.pointer : ""}`}
        {...cardClickProps}
      >
        <div className={styles.sec}>
          <div className={styles.rsec}>
            <div className={styles.columnBox}>
              <StockName
                category={catName}
                primeUser={primeUser}
                tabName={tabName}
                seoName={seoName}
                companyID={companyID}
                name={name}
              />
              <p className={styles.stockRecoTitle}>
                {data.find((item) => item?.keyId === "sr_recText")?.value || ""}
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
                    ].includes(item?.keyId)
                  ) {
                    return (
                      <RecoBar
                        key={index}
                        num={parseFloat(item?.value.toString())}
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
                    ].includes(item?.keyId)
                  ) {
                    let type = "";
                    switch (item?.keyId) {
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
                        num={parseFloat(item?.value.toString())}
                        type={type}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            {data.find(
              (item) => item?.keyId === "sr_targetVsCurrent" && !!primeUser,
            ) ? (
              <div className={styles.reportCta}>
                <a
                  className={styles.anchor}
                  href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/${seoName}/stockreports/reportid-${companyID}.cms`}
                  target="_blank"
                  title="View Report"
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
              <div className={styles.reportCta}>
                <div className={styles.anchor}>
                  <span className={`eticon_pdf ${styles.pdfIcon}`}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </span>
                  View Report
                </div>
              </div>
            )}
          </div>
          <div
            className={`${styles.lsec} ${styles.highlightSr} ${styles[data.find((item) => item?.keyId === "sr_targetVsCurrent")?.trend || ""]}`}
          >
            <ul>
              <li>
                <p className={styles.title}>Expected Returns</p>
                <p className={`${styles.val} ${styles.fs16}`}>
                  {data.find((item) => item?.keyId === "sr_targetVsCurrent")
                    ?.value || ""}
                </p>
              </li>
              <li>
                <p className={styles.title}>1Y Target</p>
                {primeUser ? (
                  <p className={`${styles.val} ${styles.bold}`}>
                    {data.find((item) => item?.keyId === "sr_priceTargetMean")
                      ?.value || ""}
                  </p>
                ) : (
                  <p className={`${styles.val} ${styles.blur}`}></p>
                )}
              </li>
              <li>
                <p className={styles.title}>Current Price</p>
                {primeUser ? (
                  <p className={styles.val}>
                    {data.find((item) => item?.keyId === "lastTradedPrice")
                      ?.value || ""}
                  </p>
                ) : (
                  <p className={`${styles.val} ${styles.blur}`}></p>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SRCardThree;
