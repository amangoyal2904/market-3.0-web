import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { trackingEvent } from "@/utils/ga";

const SummaryCard = ({ data, type }: any) => {
  //console.log("____data", data)
  const router = useRouter();

  const topTxt =
    type === "yoyData"
      ? "YoY Growth"
      : type === "qoqData"
        ? "QoQ Growth"
        : type === "topPerformingSectors"
          ? "Top Performing Sector"
          : type === "underPerformingSectors"
            ? "Under Performing Sector"
            : "";
  const getPercentage = (part: any, total: any) =>
    ((part / total) * 100).toFixed(2);
  const positivePercentage = getPercentage(
    data?.positiveCompanies,
    data?.totalCompanies,
  );
  const negativePercentage = getPercentage(
    data?.negativeCompanies,
    data?.totalCompanies,
  );
  const pendingPercentage = getPercentage(
    data?.pendingCompanies,
    data?.totalCompanies,
  );
  const linkHandler = () => {
    let routerURL =
      type === "yoyData"
        ? "/markets/stocks/earnings/declared-results/sales-gainers"
        : type === "topPerformingSectors"
          ? "/markets/stocks/earnings/sector-aggregate/top-performing"
          : type === "underPerformingSectors"
            ? "/markets/stocks/earnings/sector-aggregate/under-performing"
            : type === "declaredData"
              ? "/markets/stocks/earnings/declared-results/sales-gainers"
              : "";
    router.push(routerURL);
  };
  const gaTrackingCardClick = () => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_card_click",
      event_category: "mercury_engagement",
      event_label: `Card Click ${type}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
    type !== "qoqData" && linkHandler();
  };
  return (
    <>
      <div
        className={`${styles.cardWrap} ${styles[type]}`}
        onClick={gaTrackingCardClick}
      >
        {type !== "declaredData" ? (
          <div className={styles.topHead}>{topTxt}</div>
        ) : (
          ""
        )}
        {type === "declaredData" ? (
          <>
            <div className={styles.middleSec}>
              <div className={styles.left}>
                <div className={styles.decTxt}>Declared results</div>
                <div className={styles.resData}>
                  <span>{data?.declaredCompanies}</span>
                  <span>/{data?.totalCompanies}</span>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.grphTxtWrap}>
                  <span className={styles.graph}>
                    <span
                      className={styles.drawGraph}
                      style={{ width: `${positivePercentage}%` }}
                    ></span>
                  </span>
                  <span className={styles.num}>{data?.positiveCompanies}</span>
                  <span className={styles.txt}>Positive</span>
                </div>
                <div className={styles.grphTxtWrap}>
                  <span className={styles.graph}>
                    <span
                      className={`${styles.drawGraph} ${styles.neg}`}
                      style={{ width: `${negativePercentage}%` }}
                    ></span>
                  </span>
                  <span className={styles.num}>{data?.negativeCompanies}</span>
                  <span className={styles.txt}>Negative</span>
                </div>
                <div className={styles.grphTxtWrap}>
                  <span className={styles.graph}>
                    <span
                      className={`${styles.drawGraph} ${styles.pen}`}
                      style={{ width: `${pendingPercentage}%` }}
                    ></span>
                  </span>
                  <span className={styles.num}>{data?.pendingCompanies}</span>
                  <span className={styles.txt}>Pending</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {type !== "declaredData" ? (
          <>
            <div className={styles.middleTxtSec}>
              <div className={styles.middleLeft}>
                {type === "yoyData"
                  ? "Sales YoY"
                  : type === "qoqData"
                    ? "Sales QoQ"
                    : ""}
                {type === "topPerformingSectors" ||
                type === "underPerformingSectors" ? (
                  <span>{data[0]?.sectorName}</span>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.middleRight}>
                {type === "yoyData" || type === "qoqData" ? (
                  <span className={data?.sales > 0 ? styles.up : styles.down}>
                    {data?.sales > 0 ? (
                      <span className="eticon_up_arrow"></span>
                    ) : (
                      <span className="eticon_down_arrow"></span>
                    )}
                    {data?.sales}%
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className={styles.middleTxtSec}>
              <div className={styles.middleLeft}>
                {type === "yoyData"
                  ? "Profit YoY"
                  : type === "qoqData"
                    ? "Profit QoQ"
                    : ""}
                {type === "topPerformingSectors" ||
                type === "underPerformingSectors" ? (
                  <span>{data[1]?.sectorName}</span>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.middleRight}>
                {type === "yoyData" || type === "qoqData" ? (
                  <span className={data?.profit > 0 ? styles.up : styles.down}>
                    {data?.profit > 0 ? (
                      <span className="eticon_up_arrow"></span>
                    ) : (
                      <span className="eticon_down_arrow"></span>
                    )}
                    {data?.profit}%
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default SummaryCard;
