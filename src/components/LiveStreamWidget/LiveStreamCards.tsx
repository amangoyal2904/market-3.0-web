import styles from "./Livestream.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";

export const LiveStreamCards = ({ data }: any) => {
  const getHours = (timestamp: number) => {
    const currentTimestamp = new Date().getTime();
    const differenceInMilliseconds = currentTimestamp - timestamp;
    const differenceInHours = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60),
    );
    return differenceInHours;
  };
  const url = `${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/etmarkets-live/${data?.seoName}/streamsrecorded/streamid-${data?.eventId},expertid-${data?.meta?.userData?.expertID}.cms`;
  const expertUrl = `${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/etmarkets-live/expert-bio/${data?.meta?.userData?.expertSeoName},expertid-${data?.meta?.userData?.expertID}.cms`;
  return (
    <div>
      <div className={styles.cardsWrapper}>
        <div className={styles.imgSection}>
          <img src={data.eventImageUrl} />
        </div>
        <div className={styles.textSection}>
          <p className={styles.hourAgo}>
            {`Streamed ${getHours(data?.startTime)} hours ago`}
            <span className={`eticon_share ${styles.shareIcon}`}></span>
          </p>
          <a href={url} className={styles.title}>
            <p>{data.title}</p>
          </a>
          <div className={styles.profileSection}>
            <a className={styles.userPic}>
              <img
                width={40}
                height={40}
                src={data.meta.userData.expertImagePath}
              />
            </a>
            <div className={styles.userName}>
              <p className={styles.expertName}>
                <a href={expertUrl}>{data.expertName}</a>
              </p>
              <p className={styles.totalViewsText}>{data.totalViewsText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
