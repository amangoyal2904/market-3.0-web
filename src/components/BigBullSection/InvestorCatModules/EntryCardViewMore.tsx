import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const EntryCardViewMore = ({ linkTitle, linkHref, cartType }: any) => {
  const gaTrackingTabNameClick = (comname: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_clicked",
      event_label: comname,
    });
  };
  return (
    <div
      className={`${styles.card} ${styles.viewMoreSec} ${cartType !== "" ? styles[cartType] : ""}`}
    >
      <Link
        href={`${linkHref}`}
        onClick={() => gaTrackingTabNameClick(linkTitle)}
      >
        <span className={styles.linkTxt}>{linkTitle}</span>
        <span className={styles.arrow}></span>
      </Link>
    </div>
  );
};

export default EntryCardViewMore;
