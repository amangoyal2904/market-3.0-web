import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const SectorCard = ({ item, index, className = "" }: any) => {
  const getPercentage = (part: any, total: any) =>
    ((part / total) * 100).toFixed(2);
  const positivePercentage = getPercentage(
    item?.declarationData?.positiveCompanies,
    item?.declarationData?.totalCompanies,
  );
  const negativePercentage = getPercentage(
    item?.declarationData?.negativeCompanies,
    item?.declarationData?.totalCompanies,
  );
  const pendingPercentage = getPercentage(
    item?.declarationData?.pendingCompanies,
    item?.declarationData?.totalCompanies,
  );
  const gaTrackingCardClick = (sectorName: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_card_click",
      event_category: "mercury_engagement",
      event_label: `Card Click ${sectorName}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  return (
    <>
      <div
        key={`topSector${index}`}
        className={`${styles.sectorCard} ${styles[className]}`}
      >
        <div className={styles.secName}>
          <Link
            href={`/markets/stocks/earnings/sector-aggregate/${item?.sectorSeoName}/id-${item?.sectorId}`}
            title={item?.sectorName}
            onClick={() => gaTrackingCardClick(item?.sectorName)}
          >
            {item?.sectorName}
          </Link>
        </div>
        <div className={styles.topNTxt}>
          <span></span>
          <span>{`QoQ (%)`}</span>
          <span>{`YoY (%)`}</span>
        </div>
        <div className={styles.middleTxt}>
          <span>Revenue</span>
          <span
            className={`${item?.sectorNetSalesQoqAvg > 0 ? styles.up : item?.sectorNetSalesQoqAvg < 0 ? styles.down : ""}`}
          >
            {item?.sectorNetSalesQoqAvg > 0 ? (
              <i className="eticon_up_arrow" />
            ) : item?.sectorNetSalesQoqAvg < 0 ? (
              <i className="eticon_down_arrow" />
            ) : (
              ""
            )}
            {item?.sectorNetSalesQoqAvg || "-"}
          </span>
          <span
            className={`${item?.sectorNetSalesYoyAvg > 0 ? styles.up : item?.sectorNetSalesYoyAvg < 0 ? styles.down : ""}`}
          >
            {item?.sectorNetSalesYoyAvg > 0 ? (
              <i className="eticon_up_arrow" />
            ) : item?.sectorNetSalesYoyAvg < 0 ? (
              <i className="eticon_down_arrow" />
            ) : (
              ""
            )}
            {item?.sectorNetSalesYoyAvg || "-"}
          </span>
        </div>
        <div className={styles.middleTxt}>
          <span>Net Profit</span>
          <span
            className={`${item?.sectorPATQoqAvg > 0 ? styles.up : item?.sectorPATQoqAvg < 0 ? styles.down : ""}`}
          >
            {item?.sectorPATQoqAvg > 0 ? (
              <i className="eticon_up_arrow" />
            ) : item?.sectorPATQoqAvg < 0 ? (
              <i className="eticon_down_arrow" />
            ) : (
              ""
            )}
            {item?.sectorPATQoqAvg || "-"}
          </span>
          <span
            className={`${item?.sectorPATYoyAvg > 0 ? styles.up : item?.sectorPATYoyAvg < 0 ? styles.down : ""}`}
          >
            {item?.sectorPATYoyAvg > 0 ? (
              <i className="eticon_up_arrow" />
            ) : item?.sectorPATYoyAvg < 0 ? (
              <i className="eticon_down_arrow" />
            ) : (
              ""
            )}
            {item?.sectorPATYoyAvg || "-"}
          </span>
        </div>
        <div className={styles.botmSec}>
          <div className={styles.middleSec}>
            <div className={styles.left}>
              <div className={styles.decTxt}>Declared results</div>
              <div className={styles.resData}>
                <span>{item?.declarationData?.declaredCompanies}</span>
                <span>/{item?.declarationData?.totalCompanies}</span>
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
                <span className={styles.num}>
                  {item?.declarationData?.positiveCompanies}
                </span>
                <span className={styles.txt}>Positive</span>
              </div>
              <div className={styles.grphTxtWrap}>
                <span className={styles.graph}>
                  <span
                    className={`${styles.drawGraph} ${styles.neg}`}
                    style={{ width: `${negativePercentage}%` }}
                  ></span>
                </span>
                <span className={styles.num}>
                  {item?.declarationData?.negativeCompanies}
                </span>
                <span className={styles.txt}>Negative</span>
              </div>
              <div className={styles.grphTxtWrap}>
                <span className={styles.graph}>
                  <span
                    className={`${styles.drawGraph} ${styles.pen}`}
                    style={{ width: `${pendingPercentage}%` }}
                  ></span>
                </span>
                <span className={styles.num}>
                  {item?.declarationData?.pendingCompanies}
                </span>
                <span className={styles.txt}>Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectorCard;
