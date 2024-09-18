import jStorageReact from "jstorage-react";
import styles from "./ChartPatternPaywall.module.scss";
import { useEffect, useState } from "react";
import { initSSOWidget } from "@/utils";
import { redirectToPlanPage } from "@/utils/ga";

const ChartPatternPaywall = ({
  showPayWall = false,
  isPrime = false,
  isLogin,
  pageUrl,
  onPaywallStateChange,
}: {
  showPayWall: boolean;
  isPrime: boolean;
  isLogin: boolean;
  pageUrl: string;
  onPaywallStateChange: () => void;
}) => {
  // Internal state for managing visibility
  const [isVisible, setIsVisible] = useState(showPayWall);

  // Handle closing the paywall and persist the state in storage
  const handleClose = () => {
    jStorageReact.set("chartPatternPaywallShown", true);
    onPaywallStateChange();
    setIsVisible(false);
  };

  // Trigger visibility whenever `showPayWall` prop changes
  useEffect(() => {
    if (showPayWall) {
      setIsVisible(true); // Open paywall when requested by parent
    }
  }, [showPayWall]);

  // Return null if not visible
  if (!isVisible) return null;

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <div className={styles.closeIcon} onClick={handleClose}>
          <i className="eticon_cross"></i>
        </div>
        <img
          src="/marketsmweb/img/chart_patterns_header.svg"
          className={styles.patternHeader}
          alt="Chart Pattern"
        />
        <h4 className={styles.hl}>
          Make confident trades with
          <br /> AI-powered real-time Chart Patterns.
        </h4>
        <img
          src="/marketsmweb/img/chart_pattern_banner.svg"
          className={styles.patternBanner}
          alt="Chart Pattern Features"
        />
        {!isPrime && (
          <div className={styles.bottom}>
            <p className={styles.title}>
              Access 8-10 short term trading ideas daily
            </p>
            <div
              className={styles.cta}
              onClick={() => {
                redirectToPlanPage({
                  category: "Subscription Flow ET",
                  action: "SYFT | Flow Started",
                  label: pageUrl,
                  obj: {
                    item_name: "chart_patterns",
                    item_id: "chart_patterns_",
                    item_brand: "market_tools",
                    item_category: "chart_patterns",
                    item_category2: "Chart Patterns",
                    item_category3: "paywall_blocker_cta",
                    item_category4: "Subscribe Now",
                    feature_name: "chart-patterns",
                    site_section: "Chart Patterns",
                    site_sub_section: pageUrl,
                  },
                  cdp: {
                    event_nature: "click",
                    event_category: "subscription",
                    event_name: "paywall",
                    cta_text: "Subscribe Now",
                  },
                });
              }}
            >
              Subscribe Now
            </div>
            {!isLogin && (
              <p className={styles.bottomTxt}>
                Already a member?{" "}
                <span onClick={initSSOWidget}>Sign in Now</span>
              </p>
            )}
          </div>
        )}
      </div>
      <div className={styles.modalOverlay} onClick={handleClose}></div>
    </>
  );
};

export default ChartPatternPaywall;
