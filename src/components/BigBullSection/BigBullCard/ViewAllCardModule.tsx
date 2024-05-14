import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const ViewAllCardModule = ({ cartTitle = "", cartLink = "" }: any) => {
  const gaTrackingEventFilter = (value: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: value,
    });
  };
  return (
    <>
      <div className={styles.viewAllSec}>
        <Link
          href={`${cartLink}`}
          onClick={() => gaTrackingEventFilter(cartTitle)}
        >
          {cartTitle}
          <span className={styles.rightArrow}></span>
        </Link>
      </div>
    </>
  );
};

export default ViewAllCardModule;
