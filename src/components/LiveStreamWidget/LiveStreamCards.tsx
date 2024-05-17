"use client";
import Share from "../Share";
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
  const url = `https://economictimes.indiatimes.com/markets/etmarkets-live/${data?.seoName}/streamsrecorded/streamid-${data?.eventId},expertid-${data?.meta?.userData?.expertID}.cms`;
  const expertUrl = `https://economictimes.indiatimes.com/markets/etmarkets-live/expert-bio/${data?.meta?.userData?.expertSeoName},expertid-${data?.meta?.userData?.expertID}.cms`;
  return data ? (
    <div className={styles.cardsWrapper}>
      <div className={styles.imgSection}>
        <img src={data.eventImageUrl} />
      </div>
      <div className={styles.textSection}>
        <div className={styles.topSec}>
          <p className={styles.hourAgo}>
            {`Streamed ${getHours(data?.startTime)} hours ago`}
          </p>
          <Share title={data.title} streamURL={url} />
        </div>
        <a href={url} className={styles.title}>
          <p>{data.title}</p>
        </a>
        <div className={styles.profileSection}>
          <a className={styles.userPic}>
            <img
              width={40}
              height={40}
              src={data?.meta?.userData?.expertImagePath}
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
  ) : (
    ""
  );
};
