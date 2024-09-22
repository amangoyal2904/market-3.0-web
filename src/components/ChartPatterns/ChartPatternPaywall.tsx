import jStorageReact from "jstorage-react";
import styles from "./ChartPatternPaywall.module.scss";
import { useEffect, useState } from "react";
import { initSSOWidget } from "@/utils";
import { redirectToPlanPage } from "@/utils/ga";
import { renderIconPaths } from "@/utils/iconUtils";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

// Constants
const API_URL = `${(APIS_CONFIG as any)?.["DOMAIN"][APP_ENV]}reactfeed_metainfo.cms?msid=104293917&feedtype=json&type=nonprimedata`;
const CACHE_KEY = "nonPrimeData";
const CACHE_DURATION = 600000; // 10 minutes in milliseconds

const fetchNonPrimeData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data?.data?.text || "";
  } catch (error) {
    return ""; // Fallback text in case of error
  }
};

const getCachedNonPrimeOfferData = () => {
  return jStorageReact.get(CACHE_KEY);
};

const cacheNonPrimeOfferData = (text: any) => {
  jStorageReact.set(CACHE_KEY, text, { TTL: CACHE_DURATION });
};

const ChartPatternPaywall = ({
  showPayWall = false,
  isPrime = false,
  isLogin,
  pageUrl,
  pageName,
  onPaywallStateChange,
}: {
  showPayWall: boolean;
  isPrime: boolean;
  isLogin: boolean;
  pageUrl: string;
  pageName?: string;
  onPaywallStateChange: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(showPayWall);
  const [nonPrimeOfferText, setNonPrimeOfferText] = useState("");

  useEffect(() => {
    const loadNonPrimeText = async () => {
      // Try to get cached data
      const cachedText = getCachedNonPrimeOfferData();
      if (cachedText) {
        setNonPrimeOfferText(cachedText);
      } else {
        // Fetch new data if not cached or expired
        const fetchedText = await fetchNonPrimeData();
        setNonPrimeOfferText(fetchedText);
        cacheNonPrimeOfferData(fetchedText);
      }
    };

    if (!isPrime) {
      loadNonPrimeText();
    }
  }, [isPrime]);

  const getRedirectData = (eventNature: string, eventName: string) => ({
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: pageUrl,
    obj: {
      item_name: "chart_patterns",
      item_id: "chart_patterns_" + pageName?.toLowerCase().replaceAll(" ", "_"),
      item_brand: "market_tools",
      item_category: "chart_patterns",
      item_category2: "Chart Patterns",
      item_category3: "paywall_blocker_cta",
      item_category4: "Subscribe Now",
      feature_name: "Chart_Patterns",
      site_section: pageName,
      site_sub_section: pageUrl,
    },
    cdp: {
      event_nature: eventNature,
      event_category: "subscription",
      event_name: eventName,
    },
  });

  const handleClose = () => {
    jStorageReact.set("chartPatternPaywallShown", true);
    onPaywallStateChange();
    setIsVisible(false);
  };

  useEffect(() => {
    if (showPayWall) {
      setIsVisible(true);
      redirectToPlanPage(
        getRedirectData("impression", "subscription_feature"),
        "view_item_list",
        false,
      );
    }
  }, [showPayWall]);

  if (!isVisible) return null;

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <div className={styles.closeIcon} onClick={handleClose}>
          <i className="eticon_cross"></i>
        </div>
        <div className={styles.logo}>
          <div className={styles.icon}>
            <span className="eticon_prime_logo">
              {renderIconPaths("eticon_prime_logo")}
            </span>
          </div>
          <div className={styles.prime}>ETPrime</div>
          <h1 className={styles.heading}>
            <i className="eticon_chart_pattern"></i>AI Chart
            <span>Patterns</span>
          </h1>
        </div>
        <h4 className={styles.hl}>
          Get 5+ trading ideas daily
          <span>Now make informed decisions.</span>
        </h4>
        <img
          src="/marketsmweb/img/chart_pattern_banner.svg"
          className={styles.patternBanner}
          alt="Chart Pattern Features"
        />
        {!isPrime && (
          <div className={styles.bottom}>
            <p className={styles.title}>{nonPrimeOfferText}</p>
            <div
              className={styles.cta}
              onClick={() => {
                redirectToPlanPage({
                  ...getRedirectData("click", "paywall"),
                  cdp: {
                    ...getRedirectData("click", "paywall").cdp,
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
