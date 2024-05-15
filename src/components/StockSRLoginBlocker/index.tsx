import styles from "./StockSRLoginBlocker.module.scss";
import { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const loginHandler = () => {
    initSSOWidget();
  };

  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: location.pathname,
    obj: {
      item_name: "gainers",
      item_brand: "market_tools",
      item_category: "l3 - l4",
      item_category2: "gainers",
      item_category3: "field name",
      item_category4: "upgrade to prime",
      feature_name: "marketstats",
      site_section: "l1",
      site_sub_section: "l1/l2/l2",
    },
  };

  const planPageHandler = () => {
    redirectToPlanPage(objTracking);
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
