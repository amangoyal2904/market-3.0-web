import { useEffect, useRef } from "react";

import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";
import styles from "./StockSRLoginBlocker.module.scss";
import { redirectToPlanPage } from "../../utils/ga";
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
  const validAccessPass = freeTrialElegibilty();
  const modalRef = useRef<HTMLDivElement>(null);
  const loginHandler = () => {
    initSSOWidget();
  };

  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: `stock_report_plus_${srTabActivemenu}`,
    obj: {
      item_name: "stock_report_plus",
      item_brand: "market_tools",
      item_category: "stock_report_plus",
      item_category2: `stock_report_plus_${srTabActivemenu}`,
      item_category3: "paywall_blocker_cta",
      item_category4: "Subscribe Now",
      item_id: `${srTabActivemenu}`,
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: "Subscribe Now",
    },
  };

  const planPageHandler = () => {
    validAccessPass ? activateFreeTrial() : redirectToPlanPage(objTracking);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef?.current && !modalRef?.current.contains(event.target)) {
        handleClick(false, "", false);
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
        <h5 className={styles.desc}>
          {validAccessPass
            ? "Activate your 15 days free trial and unlock all reports now."
            : overlayBlockerData.textBenefits}
        </h5>
        <div className={styles.planCta} onClick={planPageHandler}>
          {validAccessPass ? "Start Free Trial" : overlayBlockerData.ctaText}
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
