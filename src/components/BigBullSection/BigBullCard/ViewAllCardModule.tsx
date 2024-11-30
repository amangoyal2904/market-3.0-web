import styles from "./styles.module.scss";
import { trackingEvent } from "@/utils/ga";

const ViewAllCardModule = ({ cartTitle = "", cartLink = "" }: any) => {
  const gaTrackingEventFilter = (value: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: value,
    });
  };
  return (
    <>
      <div className={styles.viewAllSec}>
        <a
          href={`${cartLink}`}
          onClick={() => gaTrackingEventFilter(cartTitle)}
          title={cartTitle}
        >
          {cartTitle}
          <span className={styles.rightArrow}></span>
        </a>
      </div>
    </>
  );
};

export default ViewAllCardModule;
