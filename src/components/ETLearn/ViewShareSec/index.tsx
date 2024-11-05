import styles from "./styles.module.scss";
import Share from "../../Share";
import { formatTimestamp, calculateExtendedViews, formatDateIE } from "@/utils";

const ViewShareSec = ({
  data,
  dataFormate = "",
  shareBoxShow = "yes",
  showTimeStamp = "no",
}: any) => {
  const { videoDetails, view, videoSecSeoPath, videoMsid, shareUrl } = data;
  //console.log(data)

  return (
    <>
      <div className={styles.videoDetails}>
        {videoDetails?.insertdate && showTimeStamp === "yes" && (
          <>
            <span className={styles.date}>
              {dataFormate === "two"
                ? formatDateIE(videoDetails.insertdate)
                : formatTimestamp(videoDetails.insertdate)}
            </span>
            <span className={styles.dash}>|</span>
          </>
        )}

        <span className={styles.views}>
          Views:{" "}
          {view.length > 0
            ? calculateExtendedViews(view?.[0]?.views)
            : calculateExtendedViews(2)}
        </span>
        <span className={styles.dash}>|</span>
        <div className={styles.socialDetails}>
          {shareBoxShow === "yes" && (
            <>
              <Share
                title={
                  `check out this new video on ET Learn:  ${videoDetails?.title}` ||
                  ""
                }
                streamURL={shareUrl}
                shareIconStyle="round"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewShareSec;
