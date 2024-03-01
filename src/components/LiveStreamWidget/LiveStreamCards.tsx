import styles from "./Livestream.module.scss";
export const LiveStreamCards = ({ data }: any) => {
  return (
    <div>
      <div className={styles.cardsWrapper}>
        <div className={styles.imgSection}>
          <img src={data.eventImageUrl} />
        </div>
        <div className={styles.textSection}>
          <p>{data.startTime}</p>
          <a href="" className={styles.title}>
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
              <p>{data.expertName}</p>
              <p>{data.totalViewsText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
