import React from "react";
import styles from "./StockReco.module.scss"; // Import your CSS styles
import WatchlistAddition from "../WatchlistAddition";
import Link from "next/link";

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
            <h2 className={styles.stocksTitle}>
              <Link
                href={`/stocksrecos/fundhousedetails/${data.organisation?.toLowerCase().replace(/ /g, "-")}-${data.omId}/all${typeof urlFilterHandle != "undefined" && urlFilterHandle()}`}
              >
                {data.organisation}
              </Link>
            </h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>Total Recos</h3>
                <h4>{data.totalCount}</h4>
              </div>
              <ul className={styles.targetBox}>
                <li>
                  <span>Buy</span>
                  <span>{data.buyCount}</span>
                </li>
                <li>
                  <span>Sell</span>
                  <span>{data.sellCount}</span>
                </li>
                <li>
                  <span>Hold</span>
                  <span>{data.holdCount}</span>
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
              {activeTab == "newRecos" && (
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

            <h2 className={styles.stocksTitle}>
              <Link
                href={`https://economictimes.indiatimes.com/${data.companyName?.toLowerCase().replace(/ /g, "-")}/stocks/companyid-${data.companyId}.cms`}
              >
                {data.companyName}
              </Link>
            </h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>{data.potentialText}</h3>
                <h4>{data.potentialValue}%</h4>
              </div>
              {activeTab == "newRecos" ? (
                <ul className={styles.targetBox}>
                  <li>
                    <span>Target</span>
                    <span>{data.target}</span>
                  </li>
                  <li>
                    <span>Price at Reco</span>
                    <span>{data.priceAtRecos}</span>
                  </li>
                  <li>
                    <span>Current Price</span>
                    <span>{data.currentPrice}</span>
                  </li>
                </ul>
              ) : (
                <ul className={styles.targetBox}>
                  <li>
                    <span>Avg. Target</span>
                    <span>{data.target}</span>
                  </li>
                  <li>
                    <span>Current Price</span>
                    <span>{data.currentPrice}</span>
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
                    <span>{data.buyCount}</span>
                  </div>
                  <div className={styles.sellBox}>
                    <span>Sell:</span>
                    <span>{data.sellCount}</span>
                  </div>
                  <div className={styles.holdBox}>
                    <span>Hold:</span>
                    <span>{data.holdCount}</span>
                  </div>
                </div>
                <div className={styles.totalCountBox}>
                  <span>Total:</span>
                  <span>{data.totalCount}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default StockComponent;
