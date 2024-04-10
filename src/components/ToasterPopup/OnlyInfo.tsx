"use client";
import styles from "./Toaster.module.scss";
const ToasterPopup = ({ toasterCloseHandler, data }: any) => {
  const title = data && data.title && data.title !== "" ? data.title : "";

  return (
    <>
      <div
        className={`refRemoveList ${styles.wraper} ${data?.errorModule !== "" ? styles[data.errorModule] : ""}`}
      >
        <div className={styles.section}>
          <div className={styles.topSec}>
            <h6>{title}</h6>
          </div>
          <div className={styles.bottomSec}>
            <span
              onClick={toasterCloseHandler}
              className={`${styles.primaryBtn}`}
            >
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToasterPopup;
