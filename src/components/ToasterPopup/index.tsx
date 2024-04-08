"use client";
import styles from "./Toaster.module.scss";
const ToasterPopup = ({
  toasterCloseHandler,
  data,
  messageNCloseBtn = "no",
  errorModule = false,
}: any) => {
  const title =
    data && data.title && data.title !== ""
      ? data.title
      : "Are you sure you want to remove these stocks from your watchlist?";
  const closeToaster = (value: boolean) => {
    toasterCloseHandler(value, data);
  };
  return (
    <>
      <div className={`${styles.wraper} ${errorModule ? styles.errorSec : ""}`}>
        <div className={styles.section}>
          <div className={styles.topSec}>
            <h6>{title}</h6>
          </div>
          <div className={styles.bottomSec}>
            <span
              onClick={() => closeToaster(false)}
              className={styles.primaryBtn}
            >
              {messageNCloseBtn === "no" ? "Cancel" : "Close"}
            </span>
            {messageNCloseBtn === "no" && (
              <span
                onClick={() => closeToaster(true)}
                className={styles.secondaryBtn}
              >
                Continue
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToasterPopup;
