import jStorageReact from "jstorage-react";
import styles from "./ChartPatternPaywall.module.scss";
import { useEffect, useState } from "react";
import { initSSOWidget } from "@/utils";
import { redirectToPlanPage } from "@/utils/ga";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import ChartPatternLogo from "./ChartPatternLogo";
import service from "@/network/service";

// Constants
const API_URL = `${(APIS_CONFIG as any)?.["DOMAIN"][APP_ENV]}/reactfeed_metainfo.cms?msid=104293917&feedtype=json&type=nonprimedata`;
const CACHE_KEY = "nonPrimeData";
const CACHE_DURATION = 600000; // 10 minutes in milliseconds

const fetchNonPrimeData = async () => {
  try {
    const response = await service.get({ url: API_URL, params: {} });
    const data = await response.json();
    return data?.data || {};
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
  const [nonPrimeOfferText, setNonPrimeOfferText] = useState({
    text: "Market Savvy Offer: Flat 20% Discount",
    ctaText: "Subscribe to ETPrime",
  });

  useEffect(() => {
    const loadNonPrimeText = async () => {
      // Try to get cached data
      const cachedText = getCachedNonPrimeOfferData();
      if (cachedText) {
        setNonPrimeOfferText(cachedText);
      } else {
        // Fetch new data if not cached or expired
        const fetchedText = await fetchNonPrimeData();
        if (!!fetchedText) {
          setNonPrimeOfferText(fetchedText);
          cacheNonPrimeOfferData(fetchedText);
        }
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
        <div className={styles.containerMain}>
          <div className={styles.leftSec}>
            <ChartPatternLogo primeLogo={false} />
            <h4 className={styles.hl}>
              Spot real-time patterns and maximise your profits
              <span>with 5+ trading ideas every day.</span>
            </h4>
            <img
              src="https://img.etimg.com/photo/msid-114377332/chart_pattern_banner.jpg"
              className={styles.patternBanner}
              alt="Chart Pattern Features"
            />
          </div>
          {!isPrime && (
            <div className={styles.rightSec}>
              <p className={styles.title}>{nonPrimeOfferText?.text}</p>
              <div
                className={styles.cta}
                onClick={() => {
                  redirectToPlanPage({
                    ...getRedirectData("click", "paywall"),
                    cdp: {
                      ...getRedirectData("click", "paywall").cdp,
                      cta_text: nonPrimeOfferText?.ctaText,
                    },
                  });
                }}
              >
                {nonPrimeOfferText?.ctaText}
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
      </div>
      <div className={styles.modalOverlay} onClick={handleClose}></div>
    </>
  );
};

export default ChartPatternPaywall;
