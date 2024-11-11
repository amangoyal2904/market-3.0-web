import styles from "./styles.module.scss";
import Share from "../../Share";
import { calculateExtendedViews } from "@/utils";

const ViewShareSec = ({
  data,
  dataFormate = "",
  shareBoxShow = "yes",
  showTimeStamp = "no",
  selectedcategory = "",
}: any) => {
  const { videoDetails, view, videoSecSeoPath, videoMsid, shareUrl } = data;
  //console.log(data)

  return (
    <>
      <div className={styles.videoDetails}>
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
                selectedcategory={selectedcategory}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewShareSec;
