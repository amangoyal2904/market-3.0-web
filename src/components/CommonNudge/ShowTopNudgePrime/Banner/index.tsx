import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";
import { redirectToPlanPage } from "@/utils/ga";
import styles from "./styles.module.scss";

const TopBannerPrimeUser = ({
  bannerType,
  bannerBg,
  imageMsid,
  bannerText,
  bannerSubtext,
  buttonLink,
  buttonText,
  bannerCross,
  crossFrequency,
  closeHandler,
}: any) => {
  const validAccessPass = freeTrialElegibilty();

  const checkUserType = (value: string) => {
    let lableText = "";
    if (value === "grace_period") {
      lableText = "Grace Period_Nudge";
    } else if (value === "about_to_expire") {
      lableText = "NonRec - About to Expire_Nudge";
    } else if (value === "cancelled") {
      lableText = "Cancelled_Nudge";
    } else if (value === "cancelled_nonrec") {
      lableText = "Cancelled Non Recurring User Remandate_Nudge";
    } else if (value === "active_nonrec") {
      lableText = "Active Non Recurring User Remandate/_Nudge";
    } else if (value === "adFree") {
      lableText = "Adfree expired_Nudge";
    }
    return lableText;
  };
  const objTracking = {
    category: "Subscription Flow ET",
    action: "Flow Started | SYFT",
    label: `${checkUserType(bannerType)}`,
    obj: {
      item_name: `${checkUserType(bannerType)}`,
      item_brand: "product_interventions",
      item_category: "subscription_nudges",
      item_category2: "",
      item_category3: "subscription_nudges",
      item_category4: buttonText,
      item_id: "",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: buttonText,
    },
  };

  const planRedirection = () => {
    validAccessPass ? activateFreeTrial() : redirectToPlanPage(objTracking);
  };

  return (
    <>
      <div
        className={`${styles.topUserInfoBand} ${styles[bannerType]}`}
        style={{ background: bannerBg }}
        data-banner-type={bannerType}
      >
        <div className={styles.info_content}>
          <span className={styles.info_icon}>
            <img
              src={`https://img.etimg.com/photo/msid-${imageMsid},quality-100,imgsize-100.cms`}
              height="100%"
            />
          </span>
          <div className={styles.tac}>
            <p className={styles.info_text}>{bannerText}</p>
            {bannerSubtext && (
              <p className={styles.info_subtext}>{bannerSubtext}</p>
            )}
          </div>
          {/* <a className={styles.info_cta} href={buttonLink}>
            {buttonText}
          </a> */}
          <span className={styles.info_cta} onClick={planRedirection}>
            {validAccessPass ? "Start Free Trial" : buttonText}
          </span>
          {bannerCross === "TRUE" && (
            <span
              className={styles.info_cross}
              onClick={() => closeHandler(crossFrequency)}
              data-frequency={crossFrequency}
            ></span>
          )}
        </div>
      </div>
    </>
  );
};

export default TopBannerPrimeUser;
