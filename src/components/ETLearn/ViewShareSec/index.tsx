import styles from "./styles.module.scss";
import Share from "../../Share";
import { formatTimestamp, calculateExtendedViews, formatDateIE } from "@/utils";

const ViewShareSec = ({
  data,
  dataFormate = "",
  shareBoxShow = "yes",
}: any) => {
  const { videoDetails, view, videoSecSeoPath, videoMsid } = data;
  //console.log(data)
  const streamURL = `https://economictimes.indiatimes.com/markets/etlearn/video/${videoSecSeoPath}/${videoMsid}`;
  return (
    <>
      <div className={styles.videoDetails}>
        {videoDetails?.insertdate && (
          <span className={styles.date}>
            {dataFormate === "two"
              ? formatDateIE(videoDetails.insertdate)
              : formatTimestamp(videoDetails.insertdate)}
          </span>
        )}
        <span className={styles.dash}>|</span>
        <span className={styles.views}>
          Views:{" "}
          {view.length > 0
            ? calculateExtendedViews(view?.[0]?.views)
            : calculateExtendedViews(2)}
        </span>
        <span className={styles.dash}>|</span>
        <div className={styles.socialDetails}>
          {shareBoxShow === "yes" && (
            <Share
              title={videoDetails?.title || ""}
              streamURL={streamURL}
              shareIconStyle="round"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewShareSec;
