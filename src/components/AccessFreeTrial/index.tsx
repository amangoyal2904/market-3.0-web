"use client";
import React, { useEffect, useState } from "react";

import { redirectToPlanPage } from "@/utils/ga";
import styles from "./styles.module.scss";

const AccessFreeTrial = () => {
  const [showDialog, setShowDialog] = useState({ show: false, flag: "" });

  useEffect(() => {
    const dialogStateChange = (e: any) => {
      console.log(e.detail, "###########");
      setShowDialog({ show: true, flag: e.detail });
    };

    document.addEventListener("freeTrialStateChange", dialogStateChange);

    return () => {
      document.removeEventListener("freeTrialStateChange", dialogStateChange);
    };
  }, []);

  const closeDialog = () => {
    setShowDialog({ show: false, flag: "" });
    window.location.reload();
  };

  return (
    showDialog?.show && (
      <div className={styles.rdmWrapper}>
        <div className={styles.boxWrapper}>
          {showDialog.flag === "availedAPError" ? (
            <>
              <div className={`${styles.overlay} ${styles.error}`} />
              <div className={styles.apDialog}>
                <img
                  onClick={closeDialog}
                  className={styles.closeIcon}
                  height="24"
                  width="24"
                  src="https://img.etimg.com/photo/111599011.cms"
                />
                <img
                  height="113"
                  width="125"
                  src="https://img.etimg.com/photo/111598571.cms"
                />
                <p className={styles.ap_heading}>Free trial already availed.</p>
                <p className={styles.ap_desc}>
                  Free trials are available only for new users.
                  <br />
                  <br /> Our records show that you have already availed the free
                  trial.
                </p>
                <div className={`${styles.flexCenter} ${styles.btmButtons}`}>
                  <button
                    onClick={redirectToPlanPage}
                    className={styles.sub_btn}
                  >
                    Subscribe to ETPrime
                  </button>
                  <a onClick={closeDialog} className={styles.continueBtn}>
                    Continue Reading
                  </a>
                </div>
              </div>
            </>
          ) : showDialog?.flag === "availedAPError" ? (
            <>
              <div className={`${styles.overlay} ${styles.error}`} />
              <div className={styles.apDialog}>
                <img
                  onClick={closeDialog}
                  className={styles.closeIcon}
                  height="24"
                  width="24"
                  src="https://img.etimg.com/photo/111599011.cms"
                />
                <img
                  height="113"
                  width="125"
                  src="https://img.etimg.com/photo/111598571.cms"
                />
                <p className={styles.ap_heading}>
                  Oops! Free trial offer not applicable for you!
                </p>
                <p className={styles.ap_desc}>
                  Free trials are available only for new users.
                  <br />
                  <br /> Since your email/mobile has had a subscription before,
                  this offer does not apply.
                </p>
                <div className={`${styles.flexCenter} ${styles.btmButtons}`}>
                  <button
                    onClick={redirectToPlanPage}
                    className={styles.sub_btn}
                  >
                    Subscribe to ETPrime
                  </button>
                  <a onClick={closeDialog} className={styles.continueBtn}>
                    Continue Reading
                  </a>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  );
};

export default AccessFreeTrial;
