import styles from "./StockSRLoginBlocker.module.scss";
import { useEffect, useRef } from "react";
import { goToPlansPage } from "../../utils/ga";
import { initSSOWidget } from "../../utils";
interface StockSRLoginBlockerProps {
  isLoginUser: any;
  handleClick: any;
  overlayBlockerData: {
    textForData: string;
    ctaText: string;
    textBenefits: string;
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
      <div id={styles.srPaywalled} ref={modalRef}>
        <div className={styles.srLogo}>
          <span className={`eticon_prime_logo ${styles.logo}`}>
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </span>
          <div className={styles.prime}>ETPrime</div>
        </div>
        <h2 className={styles.hl}>{overlayBlockerData.textForData}</h2>
        <h5 className={styles.desc}>{overlayBlockerData.textBenefits}</h5>
        <div className={styles.planCta} onClick={planPageHandler}>
          {overlayBlockerData.ctaText}
        </div>
        {!isLoginUser && (
          <p className={styles.helpTxt}>
            Already a member?
            <a onClick={loginHandler} title="Sign in Now">
              Sign in Now
            </a>
          </p>
        )}
      </div>
      <div id={styles.srPaywalledOverlay}></div>
    </>
  );
}
