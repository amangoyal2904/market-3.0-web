import SocialShare from "@/utils/SocialShare";
import styles from "./Share.module.scss";
import { trackingEvent } from "@/utils/ga";

const Share = ({
  title,
  streamURL,
  shareIconStyle = "",
  selectedcategory,
}: any) => {
  let shareParam: { title: any; url: any; type?: any };
  if (title && streamURL) {
    shareParam = {
      title: title ? title : "",
      url: streamURL ? streamURL : "",
    };
  } else {
    shareParam = {
      title: "",
      url: "",
    };
  }

  const gaTrackingClickHandler = () => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "share",
      event_category: "mercury_engagement",
      event_label: `${title}`,
      feature_name: "ETLearn",
      page_template: "etlearn",
      product_name: "Mercury_Earnings",
      selected_category: selectedcategory,
    });
  };
  return (
    <div className={styles.shareWrapper}>
      <div
        className={`${styles.socialShare} ${shareIconStyle === "round" ? styles.shareDivParent : ""}`}
      >
        {shareIconStyle === "round" ? (
          <span className={styles.shareRoundSec}></span>
        ) : (
          <span className={`eticon_share ${styles.shareIcon}`}></span>
        )}

        <div className={styles.sharingIcon}>
          <span
            aria-label="facebook"
            className={`${styles.fb} ${styles.icon}`}
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Facebook#Share#${streamURL}`}
            onClick={(e) => {
              SocialShare.Share(e, { ...shareParam, type: "fb" });
              gaTrackingClickHandler();
            }}
            data-share-title={`"Facebook#Share#${streamURL}`}
            title="facebook"
          ></span>
          <span
            className={`${styles.tw} ${styles.icon}`}
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Twitter#Tweet#${streamURL}`}
            onClick={(e) => {
              SocialShare.Share(e, { ...shareParam, type: "twt" });
              gaTrackingClickHandler();
            }}
            data-share-title={title}
            aria-label="twitter"
            title="twitter"
          ></span>
          <span
            aria-label="linkedin"
            className={`${styles.lin} ${styles.icon}`}
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`LinkedIn#Share#${streamURL}`}
            onClick={(e) => {
              SocialShare.Share(e, { ...shareParam, type: "lin" });
              gaTrackingClickHandler();
            }}
            data-share-title={title}
            title="linkedin"
          ></span>
          <span
            className={`${styles.wp} ${styles.icon}`}
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Whatsapp#Share#${streamURL}`}
            onClick={(e) => {
              SocialShare.Share(e, { ...shareParam, type: "wa" });
              gaTrackingClickHandler();
            }}
            data-watext="Hey, This might interest you! %0A%0A"
            data-share-title={title}
            aria-label="whatsapp"
            title="whatsapp"
          ></span>
        </div>
      </div>
    </div>
  );
};
export default Share;
