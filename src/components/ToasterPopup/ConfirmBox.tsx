"use client";
import styles from "./Toaster.module.scss";
const ToasterPopup = ({ toasterCloseHandler, data, toasterActionFun }: any) => {
  const title = data && data.title && data.title !== "" ? data.title : "";
  const toasterActionHandler = () => {
    toasterActionFun(data.action);
  };
  return (
    <>
      <div
        className={`${styles.wraper} ${data?.errorModule !== "" ? styles[data.errorModule] : ""}`}
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
              {data?.yes || "Save"}
            </span>
            <span
              onClick={toasterActionHandler}
              className={`${styles.secondaryBtn}`}
            >
              {data?.no || "Cancel"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToasterPopup;
