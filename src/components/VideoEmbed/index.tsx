import React, { useEffect } from "react";
import styles from "./VideoEmbed.module.scss";
import Loading from "./Loading";

const VideoEmmbed = ({ url, onIframeLoadTask, showLoader }: any) => {
  useEffect(() => {
    let timeout: any;
    const videoEle: any = document.getElementById("videoShow");
    if (videoEle?.contentWindow) {
      timeout = setTimeout(() => onIframeLoadTask(), 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <div className={styles.videoContainer}>
        {showLoader ? (
          <div className={styles.loaderWrapper}>
            <Loading />
          </div>
        ) : (
          ""
        )}
        <iframe
          id="videoShow"
          className={styles.videoFrame}
          src={url}
          title="Video"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
};

export default VideoEmmbed;
