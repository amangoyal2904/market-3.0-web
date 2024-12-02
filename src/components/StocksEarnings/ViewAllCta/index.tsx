import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const ViewAllCta = ({
  text,
  url,
  self = "_blank",
  urlInternal = "no",
}: any) => {
  const gaTrackingViewAllClick = (sectorName: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_cta_click",
      event_category: "mercury_engagement",
      event_label: `${sectorName}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  return (
    <>
      <div
        className={styles.viewAllCta}
        onClick={() => gaTrackingViewAllClick(text)}
      >
        {urlInternal === "yes" ? (
          <Link href={`${url}`}>{text}</Link>
        ) : (
          <a href={`${url}`} target={`${self}`}>
            {text}
          </a>
        )}
      </div>
    </>
  );
};

export default ViewAllCta;
