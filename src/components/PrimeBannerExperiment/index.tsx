import { renderIconPaths } from "@/utils/iconUtils";
import styles from "./styles.module.scss";
import { activateFreeTrial, freeTrialElegibilty } from "@/utils/freeTrail";
import { redirectToPlanPage } from "@/utils/ga";

const PrimeBannerExperiment = ({ pageName, pageId }: any) => {
  const validAccessPass = freeTrialElegibilty();
  const rotatingWords = [
    "Stock Score",
    "Potential Upside",
    "Investment Ideas",
    "Stock Recommendations",
  ];
  const objTracking = {
    category: "Subscription Flow ET",
    action: "Flow Started | SYFT",
    label: "Market_Stats Prime_Banner_Experiment",
    obj: {
      et_product: "MarketsStats_Experiment",
      feature_name: "Market Stats Prime BanExp",
      item_name: "et_primecarosel_listingpage",
      item_id: pageId,
      item_brand: "market_tools",
      item_category: "et_primecarosel",
      item_category2: pageName,
      item_category3: "paywall_blocker_cta",
      item_category4: validAccessPass
        ? "Start Free Trial"
        : "Subscribe to ETPrime",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: validAccessPass ? "Start Free Trial" : "Subscribe to ETPrime",
    },
  };
  const planNavigation = (flag: any) => {
    objTracking.cdp["cta_text"] = flag;
    redirectToPlanPage(objTracking);
  };

  return (
    <div className={styles.bannerExperiment}>
      <div className={styles.headline}>
        <span className={styles.icon}>
          <i className="eticon_prime_logo">
            {renderIconPaths("eticon_prime_logo")}
          </i>
        </span>
        Multiply the power of your investment decisions with
        <div className={styles.words}>
          {rotatingWords.map((word, index) => (
            <span key={index}>{word}</span>
          ))}
        </div>
      </div>
      <div
        className={styles.cta}
        onClick={() => {
          validAccessPass
            ? activateFreeTrial()
            : planNavigation("Subscribe to ETPrime");
        }}
      >
        {validAccessPass ? "Start Free Trial" : "Subscribe to ETPrime"}
      </div>
    </div>
  );
};

export default PrimeBannerExperiment;
