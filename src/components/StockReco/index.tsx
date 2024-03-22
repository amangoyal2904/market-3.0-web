import React from "react";
import styles from "./StockReco.module.scss"; // Import your CSS styles
import WatchlistAddition from "../WatchlistAddition";
import Link from "next/link";
import { formatNumber } from "@/utils";

interface Props {
  data: any; // Define the type of data correctly
  activeTab: string;
  pageName: string;
  urlFilterHandle: any;
}
const formatDate = (timestamp: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};
const StockComponent: React.FC<Props> = ({
  data,
  activeTab,
  pageName,
  urlFilterHandle,
}) => {
  const formattedDate = formatDate(data.priceAtRecosDate);
  let stockMainClass;

  switch (data.potentialDirection) {
    case "Up":
      stockMainClass = styles.buyStock;
      break;
    case "Down":
      stockMainClass = styles.sellStock;
      break;
    case "Neutral":
      stockMainClass = styles.GreyStock;
      break;
    default:
      stockMainClass = styles.buyStock;
  }
  //console.log("##" + activeTab + "--- >", data);
  return (
    <>
      {activeTab == "recoByFH" ? (
        <div
          className={`${pageName == "stockRecosPage" ? styles.stockRecosPage : ""} ${styles.stocksMain} ${styles.GreyStock}`}
        >
          <div className={styles.stocksBox}>
            <h2 title={data.organisation} className={styles.stocksTitle}>
              <Link
                href={`/stocksrecos/fundhousedetails/${data.organisation?.toLowerCase().replace(/ /g, "-")}-${data.omId}/all${typeof urlFilterHandle != "undefined" && urlFilterHandle()}`}
              >
                {data.organisation}
              </Link>
            </h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Total Recos</h3>
                <h4 className={`numberFonts`}>
                  {formatNumber(data.totalCount)}
                </h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Buy</span>
                  <span className={`numberFonts ${styles.buyCount}`}>
                    {formatNumber(data.buyCount)}
                  </span>
                </li>
                <li>
                  <span>Sell</span>
                  <span className={`numberFonts ${styles.sellCount}`}>
                    {formatNumber(data.sellCount)}
                  </span>
                </li>
                <li>
                  <span>Hold</span>
                  <span className={`numberFonts ${styles.holdCount}`}>
                    {formatNumber(data.holdCount)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`${styles[pageName]} ${activeTab === "newRecos" ? `${styles.stocksMain} ${stockMainClass} ${styles.stockGap}` : `${styles.stocksMain} ${stockMainClass}`}`}
        >
          <div className={styles.stocksBox}>
            {/* {activeTab == "newRecos" && ( */}
            <div className={styles.stocksCallDates}>
              <span className={styles.buySellTitle}>
                {activeTab == "mostBuy"
                  ? "Buy"
                  : activeTab == "mostSell"
                    ? "Sell"
                    : data.recoType}
              </span>
              {(activeTab == "newRecos" || activeTab == "FHDetail") && (
                <span className={styles.callDateBox}>
                  <span className={styles.callDateTitle}>Call Date:</span>
                  <span className={styles.callDate}>{formattedDate}</span>
                </span>
              )}
              <WatchlistAddition
                companyName={data.companyName}
                companyId={data.companyId}
                companyType="equity"
                customStyle={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                }}
              />
            </div>
            {/* )} */}

            <h2 title={data.companyName} className={styles.stocksTitle}>
              <Link
                target="_blank"
                href={`https://economictimes.indiatimes.com/${data.companyName?.toLowerCase().replace(/ /g, "-")}/stocks/companyid-${data.companyId}.cms`}
              >
                {data.companyName}
              </Link>
            </h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>{data.potentialText}</h3>
                <h4 className={`numberFonts`}>{data.potentialValue}%</h4>
              </div>
              {activeTab == "newRecos" || activeTab == "FHDetail" ? (
                <ul className={styles.targetBox}>
                  <li>
                    <span>Target</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.target)}
                    </span>
                  </li>
                  <li>
                    <span>Price at Reco</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.priceAtRecos)}
                    </span>
                  </li>
                  <li>
                    <span>Current Price</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.currentPrice)}
                    </span>
                  </li>
                </ul>
              ) : (
                <ul className={styles.targetBox}>
                  <li>
                    <span>Avg. Target</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.target)}
                    </span>
                  </li>
                  <li>
                    <span>Current Price</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.currentPrice)}
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </div>
          {(activeTab == "newRecos" || activeTab == "FHDetail") && (
            <div className={styles.viewReportWrap}>
              <a
                href={data.pdfUrl}
                className={styles.viewReportBox}
                target="_blank"
              >
                <span className={`eticon_pdf ${styles.pdfIcon}`}>
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                </span>
                <span className={styles.viewReport}>View Report</span>
              </a>
            </div>
          )}
          {activeTab != "FHDetail" &&
            (activeTab == "newRecos" ? (
              <div className={styles.brokerageBox}>
                <span>Brokerage:</span>
                <span>
                  <Link
                    href={`/stocksrecos/fundhousedetails/${data.organisation?.toLowerCase().replace(/ /g, "-")}-${data.omId}/all${typeof urlFilterHandle != "undefined" ? urlFilterHandle() : ""}`}
                  >
                    {data.organisation}
                  </Link>
                </span>
              </div>
            ) : (
              <div className={styles.buySellFooterBox}>
                <div className={styles.buySellBox}>
                  <div className={styles.buyBox}>
                    <span>Buy:</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.buyCount)}
                    </span>
                  </div>
                  <div className={styles.sellBox}>
                    <span>Sell:</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.sellCount)}
                    </span>
                  </div>
                  <div className={styles.holdBox}>
                    <span>Hold:</span>
                    <span className={`numberFonts`}>
                      {formatNumber(data.holdCount)}
                    </span>
                  </div>
                </div>
                <div className={styles.totalCountBox}>
                  <span>Total:</span>
                  <span className={`numberFonts`}>
                    {formatNumber(data.totalCount)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default StockComponent;
