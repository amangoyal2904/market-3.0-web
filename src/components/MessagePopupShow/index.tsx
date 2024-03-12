"use client";
import { useEffect, useRef } from "react";
import styles from "./MessagePopup.module.scss";

const MessagePopupShow = ({ message, closePopup, mode = "success" }: any) => {
  const closeModal = () => {
    closePopup(false);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      closeModal();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <>
      <div className={styles.messageWrap}>
        <div
          className={`${styles.sec} ${mode === "success" ? styles.success : styles.failure}`}
        >
          <div className={styles.modalSec}>
            <h4 className={styles.textHead}>{message?.title} </h4>
            <span className={styles.closePopup} onClick={closeModal}></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePopupShow;
