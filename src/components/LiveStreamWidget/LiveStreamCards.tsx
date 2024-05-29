"use client";
import Share from "../Share";
import styles from "./Livestream.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";

export const LiveStreamCards = ({ data }: any) => {
  const getTimeDifference = (timestamp: number) => {
    const currentTimestamp = new Date().getTime();
    const differenceInMilliseconds = currentTimestamp - timestamp;

    const millisecondsInDay = 1000 * 60 * 60 * 24;

    const months = Math.floor(
      differenceInMilliseconds / (millisecondsInDay * 30),
    ); // Assuming a month is 30 days initially
    const remainingMillisecondsAfterMonths =
      differenceInMilliseconds - months * millisecondsInDay * 30;

    let days = Math.floor(remainingMillisecondsAfterMonths / millisecondsInDay);

    // Calculate the actual number of days in the remaining months
    let remainingMilliseconds =
      remainingMillisecondsAfterMonths - days * millisecondsInDay;
    const currentDate = new Date(currentTimestamp);
    for (let i = 0; i < months; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month
      days += daysInMonth;
    }

    const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
    remainingMilliseconds -= hours * 60 * 60 * 1000;

    const minutes = Math.floor(remainingMilliseconds / (1000 * 60));
    remainingMilliseconds -= minutes * 60 * 1000;

    const seconds = Math.floor(remainingMilliseconds / 1000);

    return {
      months,
      days,
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
        <img src={data.eventImageUrl} />
      </div>
      <div className={styles.textSection}>
        <div className={styles.topSec}>
          <p className={styles.hourAgo}>
            {`Streamed ${
              getTimeDifference(data?.startTime)?.months != 0
                ? getTimeDifference(data?.startTime)?.months +
                  (getTimeDifference(data?.startTime)?.months == 1
                    ? " month ago"
                    : " months ago")
                : getTimeDifference(data?.startTime)?.days != 0
                  ? getTimeDifference(data?.startTime)?.days +
                    (getTimeDifference(data?.startTime)?.days == 1
                      ? " day ago"
                      : " days ago")
                  : getTimeDifference(data?.startTime)?.hours != 0
                    ? getTimeDifference(data?.startTime)?.hours +
                      (getTimeDifference(data?.startTime)?.hours == 1
                        ? " hour ago"
                        : " hours ago")
                    : getTimeDifference(data?.startTime)?.minutes != 0
                      ? getTimeDifference(data?.startTime)?.minutes +
                        (getTimeDifference(data?.startTime)?.minutes == 1
                          ? " minute ago"
                          : " minutes ago")
                      : getTimeDifference(data?.startTime)?.seconds != 0
                        ? getTimeDifference(data?.startTime)?.seconds +
                          (getTimeDifference(data?.startTime)?.seconds == 1
                            ? " second ago"
                            : " seconds ago")
                        : ""
            }`}
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
              src={
                data?.meta?.userData?.expertImagePath
                  ? data?.meta?.userData?.expertImagePath
                  : "https://img.etimg.com/photo/42031747.cms"
              }
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
