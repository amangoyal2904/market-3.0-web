import styles from "./StockSRLoginBlocker.module.scss";
import { useEffect, useRef } from "react";
import { goToPlansPage } from "../../utils/ga";
import { initSSOWidget } from "../../utils";
interface StockSRLoginBlockerProps {
  isLoginUser: any;
  handleClick: any;
  overlayBlockerData: {
    textForData: string;
    textForReport: string;
    ctaText: string;
    textBenefits: string;
    discCoupon: string;
  };
  srTabActivemenu?: string;
  stockname?: string;
}

export default function StockSRLoginBlocker({
  isLoginUser,
  handleClick,
  overlayBlockerData,
  srTabActivemenu,
  stockname,
}: StockSRLoginBlockerProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const loginHandler = () => {
    initSSOWidget();
  };

  const planPageHandler = () => {
    goToPlansPage();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef?.current && !modalRef?.current.contains(event.target)) {
        handleClick(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.loginWrap}>
        <div className={styles.loginSec} ref={modalRef}>
          <div className={styles.etPrimeLogo}></div>
          <div className={styles.textMember}>
            {overlayBlockerData.textForData}
          </div>
          <div className={styles.textMember2}>
            {overlayBlockerData.textBenefits}
          </div>
          <div className={styles.subBtn}>
            <span className={styles.subLink} onClick={planPageHandler}>
              {overlayBlockerData.ctaText}
            </span>
            {!isLoginUser && (
              <p>
                Already a member?
                <span className={styles.loginBtn} onClick={loginHandler}>
                  Sign in Now
                </span>
              </p>
            )}
          </div>
          <div className={styles.footerTxt}>
            {overlayBlockerData.discCoupon}
          </div>
        </div>
      </div>
    </>
  );
}
