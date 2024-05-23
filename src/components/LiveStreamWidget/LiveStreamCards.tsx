"use client";
import Share from "../Share";
import styles from "./Livestream.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";

export const LiveStreamCards = ({ data }: any) => {
  const getTimeDifference = (timestamp: number) => {
    const currentTimestamp = new Date().getTime();
    const differenceInMilliseconds = currentTimestamp - timestamp;
    const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
    const remainingMilliseconds =
      differenceInMilliseconds - hours * 60 * 60 * 1000;

    const minutes = Math.floor(remainingMilliseconds / (1000 * 60));
    const remainingMillisecondsAfterMinutes =
      remainingMilliseconds - minutes * 60 * 1000;
    const seconds = Math.floor(remainingMillisecondsAfterMinutes / 1000);

    return {
      hours,
      minutes,
      seconds,
    };
  };
  const url = `https://economictimes.indiatimes.com/markets/etmarkets-live/${data?.seoName}/streamsrecorded/streamid-${data?.eventId},expertid-${data?.meta?.userData?.expertID}.cms`;
  const expertUrl = `https://economictimes.indiatimes.com/markets/etmarkets-live/expert-bio/${data?.meta?.userData?.expertSeoName},expertid-${data?.meta?.userData?.expertID}.cms`;
  return data ? (
    <div className={styles.cardsWrapper}>
      <div className={styles.imgSection}>
        <img src={data.eventImageUrl} alt={data.title} title={data.title} />
      </div>
      <div className={styles.textSection}>
        <div className={styles.topSec}>
          <p className={styles.hourAgo}>
            {`Streamed ${
              getTimeDifference(data?.startTime)?.hours != 0
                ? `${getTimeDifference(data?.startTime)?.hours} hours ago`
                : getTimeDifference(data?.startTime)?.minutes != 0
                  ? `${getTimeDifference(data?.startTime)?.minutes} minutes ago`
                  : getTimeDifference(data?.startTime)?.seconds != 0
                    ? `${getTimeDifference(data?.startTime)?.seconds} seconds ago`
                    : ""
            }`}
          </p>
          <Share title={data.title} streamURL={url} />
        </div>
        <a href={url} className={styles.title} title={data.title}>
          <p>{data.title}</p>
        </a>
        <div className={styles.profileSection}>
          <a className={styles.userPic} title={data.title}>
            <img
              width={40}
              height={40}
              src={data?.meta?.userData?.expertImagePath}
              title={data.title}
              alt={data.title}
            />
          </a>
          <div className={styles.userName}>
            <p className={styles.expertName}>
              <a href={expertUrl} title={data.expertName}>
                {data.expertName}
              </a>
            </p>
            <p className={styles.totalViewsText}>{data.totalViewsText}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
