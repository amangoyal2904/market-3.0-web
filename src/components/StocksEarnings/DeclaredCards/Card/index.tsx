import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import { useStateContext } from "@/store/StateContext";
const WatchlistAddition = dynamic(() => import("../../../WatchlistAddition"), {
  ssr: false,
});
import { goToPlansPage1, trackingEvent } from "@/utils/ga";
import { getStockUrl } from "@/utils/utility";

const Card = ({ cardData }: any) => {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  // const isPrime = true;
  //console.log("__cardData", {cardData})
  const date = new Date(cardData?.declaredDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const gaTrackingCompanyNameClick = (comname: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_card_click",
      event_category: "mercury_engagement",
      event_label: `Card Click ${comname}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  const redirectToPlanPage = () => {
    try {
      const pagePathName = window.location.pathname;
      let site_section = pagePathName.split("/");
      let lastSlash = site_section[site_section.length - 1];
      trackingEvent("et_push_event", {
        event_category: "Subscription Flow ET",
        event_action: "SYFT | Flow Started",
        event_label: "ATF - " + window.location.href,
      });
      const obj = {
        item_name: "atf_" + lastSlash,
        item_id: "atf",
        item_brand: "market_tools",
        item_category: "atf_offer_cta",
        item_category2: lastSlash,
        item_category3: "atf_cta",
        item_category4: "Subscribe Now",
      };
      const cdp = {
        event_nature: "click",
        event_category: "subscription",
        event_name: "paywall",
        cta_text: "Subscribe Now",
      };
      goToPlansPage1("select_item", obj, true, cdp);
    } catch (Err) {
      console.log("redirectToPlanPage Err:", Err);
      goToPlansPage1("select_item", {}, true);
    }
  };
  const redirectToPdfPage = () => {
    const checkHostEnv = process.env.NODE_ENV;
    const hostname = window.location.hostname;
    const hostUrl =
      checkHostEnv === "development" || hostname.includes("etmarketswebpre")
        ? "https://etdev8243.indiatimes.com/"
        : "/";
    const pdfUrl = `${hostUrl}${cardData?.assetSeoName}/stockreports/reportid-${cardData?.assetId}.cms`;
    cardData.stockScore !== null ? window.open(pdfUrl, "_blank") : "";

    //console.log("pdfUrl", pdfUrl)
  };
  return (
    <>
      <div className={styles.cardWrap}>
        <span className={styles.dateSec}>{formattedDate}</span>
        <div className={styles.topSec}>
          <div className={styles.cname}>
            <span className={styles.cnameSpan}>
              <a
                onClick={() => gaTrackingCompanyNameClick(cardData?.assetName)}
                href={getStockUrl(
                  cardData?.assetId,
                  cardData?.assetSeoName,
                  cardData?.assetType,
                )}
                target="_blank"
                title={cardData.assetName}
              >
                {cardData.assetName}
              </a>
            </span>
            {cardData && cardData?.assetId && (
              <WatchlistAddition
                companyName={cardData?.assetName}
                companyId={cardData?.assetId}
                companyType={cardData?.assetType}
                customStyle={{
                  width: "18px",
                  height: "18px",
                }}
              />
            )}
          </div>
          <div className={styles.cinfo}>
            <span className={styles.secTxt}>Sector:</span>
            <span className={styles.secValue}>
              {cardData?.sectorName?.length > 23
                ? `${cardData.sectorName.slice(0, 20)}...`
                : cardData?.sectorName}
            </span>
            <span className={styles.secAlone}>{cardData?.resultType}</span>
          </div>
        </div>
        <ul className={styles.listAllData}>
          <li>
            <div className={styles.mainSec}>
              <span className={styles.topHead}>{cardData?.quarterName}</span>
              <span className={styles.topHead}>
                {cardData?.activeQuarterName}
              </span>
              <span className={styles.topHead}>
                {cardData?.previousQuarterName}
              </span>
              <span className={styles.topHead}>Growth %</span>
            </div>
          </li>
          <li>
            <div className={styles.mainSec}>
              <span className={styles.topTxt}>{`Sales (Cr.)`}</span>
              <span className={styles.topTxt}>
                {cardData?.salesData?.activeQuarter || "-"}
              </span>
              <span className={styles.topTxt}>
                {cardData?.salesData?.previousQuarter || "-"}
              </span>
              <span
                className={`${styles.topTxt} ${cardData?.salesData?.growth > 0 ? styles.up : cardData?.salesData?.growth ? styles.down : ""}`}
              >
                {cardData?.salesData?.growth > 0 ? (
                  <span className="eticon_up_arrow"></span>
                ) : cardData?.salesData?.growth ? (
                  <span className="eticon_down_arrow"></span>
                ) : (
                  ""
                )}
                {cardData?.salesData?.growth || "-"}
              </span>
            </div>
          </li>
          <li>
            <div className={styles.mainSec}>
              <span className={styles.topTxt}>{`Net Profit (Cr.)`}</span>
              <span className={styles.topTxt}>
                {cardData?.netProfitData?.activeQuarter || "-"}
              </span>
              <span className={styles.topTxt}>
                {cardData?.netProfitData?.previousQuarter || "-"}
              </span>
              <span
                className={`${styles.topTxt} ${cardData?.netProfitData?.growth > 0 ? styles.up : cardData?.netProfitData?.growth ? styles.down : ""}`}
              >
                {cardData?.netProfitData?.growth > 0 ? (
                  <span className="eticon_up_arrow"></span>
                ) : cardData?.netProfitData?.growth ? (
                  <span className="eticon_down_arrow"></span>
                ) : (
                  ""
                )}
                {cardData?.netProfitData?.growth || "-"}
              </span>
            </div>
          </li>
          <li className={styles.btmSec}>
            <div className={styles.mainSec}>
              <span className={styles.topHead}>{`M.Cap (Rs. Cr.)`}</span>
              <span className={styles.topHead}>TTM EPS {`(₹)`}</span>
              <span className={styles.topHead}>TTM PE</span>
              <span className={`${styles.topHead} ${styles.stockScoreSec}`}>
                <span
                  className={`${styles.scoreWrap} ${
                    !isPrime ||
                    (cardData.stockScore !== null && cardData.stockScore !== "")
                      ? styles.curpointer
                      : ""
                  }`}
                  onClick={!isPrime ? redirectToPlanPage : redirectToPdfPage}
                >
                  <span className={styles.topWrap}>
                    {!isPrime ? (
                      <span className={styles.topWrap}>
                        <i className={styles.lockIcon}></i>
                        <small className={styles.small}>10</small>
                      </span>
                    ) : (
                      <>
                        {cardData?.stockScore &&
                        cardData.stockScore !== null &&
                        cardData.stockScore !== "" &&
                        cardData.stockScore !== "NR" &&
                        cardData.stockScore !== "nr" ? (
                          <span className={styles.topWrap}>
                            <span className={styles.cardValue}>
                              {cardData.stockScore}
                            </span>
                            <small className={styles.small}>10</small>
                          </span>
                        ) : cardData.stockScore === "NR" ||
                          cardData.stockScore === "nr" ? (
                          <span className={styles.nrStyle}>NR</span>
                        ) : (
                          <span className={styles.naStyle}>N/A</span>
                        )}
                      </>
                    )}

                    <span className={styles.btmWrap}>
                      Earnings <br /> Score
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </li>
          <li>
            <div className={styles.mainSec}>
              <span className={styles.topTxt}>{cardData?.marketCap}</span>
              <span className={styles.topTxt}>{cardData?.eps}</span>
              <span className={styles.topTxt}>{cardData?.pe}</span>
              <span className={styles.topTxt}></span>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Card;
