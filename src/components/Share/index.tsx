import SocialShare from "@/utils/SocialShare";
import styles from "./Share.module.scss";

const Share = ({ title, streamURL }: any) => {
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
  return (
    <div className={styles.shareWrapper}>
      <div className={styles.socialShare}>
        <span className={`eticon_share ${styles.shareIcon}`}></span>
        <div className={styles.sharingIcon}>
          <a
            aria-label="facebook"
            className={`${styles.fb} ${styles.icon}`}
            href="javascript://"
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Facebook#Share#${streamURL}`}
            onClick={(e) => SocialShare.Share(e, { ...shareParam, type: "fb" })}
            data-share-title={title}
            title="facebook"
          ></a>
          <a
            className={`${styles.tw} ${styles.icon}`}
            href="javascript://"
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Twitter#Tweet#${streamURL}`}
            onClick={(e) =>
              SocialShare.Share(e, { ...shareParam, type: "twt" })
            }
            data-share-title={title}
            aria-label="twitter"
            title="twitter"
          ></a>
          <a
            aria-label="linkedin"
            className={`${styles.lin} ${styles.icon}`}
            href="javascript://"
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`LinkedIn#Share#${streamURL}`}
            onClick={(e) =>
              SocialShare.Share(e, { ...shareParam, type: "lin" })
            }
            data-share-title={title}
            title="linkedin"
          ></a>
          <a
            className={`${styles.wp} ${styles.icon}`}
            href="javascript://"
            rel="nofollow"
            data-dimension="1"
            data-ga-onshare={`Whatsapp#Share#${streamURL}`}
            onClick={(e) => SocialShare.Share(e, { ...shareParam, type: "wa" })}
            data-watext="Hey, This might interest you! %0A%0A"
            data-share-title={title}
            aria-label="whatsapp"
            title="whatsapp"
          ></a>
        </div>
      </div>
    </div>
  );
};
export default Share;
