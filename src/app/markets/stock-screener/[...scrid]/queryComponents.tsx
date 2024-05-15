import styles from "./stockScreener.module.scss";
import { trackingEvent } from "@/utils/ga";

const QueryComponets = ({
  data,
  showModal,
  screenerEditMode,
  setScreenerEditMode,
}: any) => {
  const editScreenerModeHandler = () => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: "Edit Attributes",
    });
    showModal(true);
    setScreenerEditMode({
      ...screenerEditMode,
      mode: true,
      screenerStage: "popup",
    });
  };
  return (
    <>
      <div className={styles.querySec}>
        <div className={styles.left}>
          <div className={styles.heading}>Query</div>
          <div className={styles.queryBox}>{data?.displayQuery}</div>
          <div className={styles.btnSec}>
            <span className={styles.editBtn} onClick={editScreenerModeHandler}>
              Edit Attributes
            </span>
          </div>
        </div>
        <div className={styles.right}>
          <ul className={styles.listQuerySample}>
            <li>
              <h3 className={styles.head3}>Step1</h3>
              <p className={styles.text}>
                Create your own query or set your own attributes and values.
              </p>
            </li>
            <li>
              <h3 className={styles.head3}>Step2</h3>
              <p className={styles.text}>Run this Query & Download Results</p>
            </li>
            <li>
              <h3 className={styles.head3}>Sample Query Example</h3>
              <p
                className={styles.text}
              >{`Market capitalization > 500 AND Price to earning < 15 AND Return on capital employed > 22%`}</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default QueryComponets;
