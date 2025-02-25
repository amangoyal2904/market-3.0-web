import styles from "./StockReco.module.scss"; // Import your CSS styles
// import WatchlistAddition from "../WatchlistAddition";
import Link from "next/link";
import { formatNumber, APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";
import { PdfReport } from "./PdfReport";
import dynamic from "next/dynamic";
const WatchlistAddition = dynamic(() => import("../WatchlistAddition"), {
  ssr: false,
});

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
const StockComponent = ({
  data,
  activeTab,
  pageName,
  urlFilterHandle,
  filterIndex,
  source = "list",
}: any) => {
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
  // console.log("##" + activeTab + "--- >", activeTab);
  return (
    <>
      {activeTab == "recoByFH" ? (
        <div
          className={`${pageName == "stockRecosPage" ? styles.stockRecosPage : ""} ${styles[pageName]} ${styles.stockRecoByFHClass} ${styles.stocksMain} ${styles.GreyStock}`}
        >
          <div className={styles.stocksBox}>
            <h2 title={data.organisation} className={styles.stocksTitle}>
              <Link
                href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["fundhousedetails"]}/${data.seoName}-${data.omId}/all${typeof urlFilterHandle != "undefined" ? urlFilterHandle(filterIndex ? filterIndex : "") : ""}`}
                className="linkHover"
                title={data.organisation}
                onClick={() => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "organisation_clicked",
                    event_label: `${data?.organisation}_${activeTab}`,
                  });
                }}
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
          className={`${styles[pageName]} ${activeTab === "newRecos" ? `${styles.stocksMain} ${styles.stockRecoByFHClass} ${stockMainClass} ${styles.stockGap}` : `${styles.stocksMain} ${stockMainClass}`}`}
        >
          <div className={styles.stocksBox}>
            {data?.recoType && (
              <div className={styles.stocksCallDates}>
                <span
                  className={`${styles.buySellTitle} ${activeTab == "mostBuy" || data.recoType == "Buy" || data.recoType == "Add" || data.recoType == "Accumulate" ? styles.green : activeTab == "mostSell" || data.recoType == "Sell" ? styles.red : styles.gray}`}
                >
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
                {activeTab != "recoOnWL" && activeTab != "recoOnWatchlist" && (
                  <WatchlistAddition
                    companyName={data.companyName}
                    companyId={data.companyId}
                    companyType="equity"
                    customStyle={{
                      position: "absolute",
                      top: "13px",
                      right: "16px",
                    }}
                  />
                )}
              </div>
            )}

            <h2 title={data.companyName} className={styles.stocksTitle}>
              <a
                title={data.companyName}
                target="_blank"
                href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}${data?.companySeoName}/stocks/companyid-${data.companyId}.cms`}
                className="linkHover"
                onClick={() => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "company_clicked",
                    event_label: `${data?.companyName}_${activeTab}`,
                  });
                }}
              >
                {data.companyName}
              </a>
              {!data?.recoType &&
                activeTab != "recoOnWL" &&
                activeTab != "recoOnWatchlist" && (
                  <WatchlistAddition
                    companyName={data.companyName}
                    companyId={data.companyId}
                    companyType="equity"
                    customStyle={{
                      position: "absolute",
                      top: "13px",
                      right: "16px",
                    }}
                  />
                )}
            </h2>
            <div className={styles.updownTargetBox}>
              <div className={styles.potensialBox}>
                <h3>{data.potentialText}</h3>
                {data.potentialValue > 0 ? (
                  <h4 className={`numberFonts`}>{`${data.potentialValue}%`}</h4>
                ) : (
                  <h4 className={`${styles.targetMet}`}>Target Met</h4>
                )}
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
            {(activeTab == "newRecos" || activeTab == "FHDetail") && (
              <div className={`${styles.reportCta}`}>
                <PdfReport
                  pdfUrl={data.pdfUrl}
                  companyName={data?.companyName}
                  classNameReportBox="viewReportWrap"
                />
              </div>
            )}
          </div>

          {activeTab != "FHDetail" &&
            (activeTab == "newRecos" ? (
              <div className={styles.brokerageBox}>
                <span>Brokerage:</span>
                <span>
                  <Link
                    title={data.organisation}
                    href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["fundhousedetails"]}/${data.seoName}-${data.omId}/all${typeof urlFilterHandle != "undefined" ? urlFilterHandle(filterIndex ? filterIndex : "") : ""}`}
                    className="linkHover"
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
