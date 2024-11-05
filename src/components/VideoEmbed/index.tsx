import React, { useEffect } from "react";
import styles from "./VideoEmbed.module.scss";
import Loading from "./Loading";

const VideoEmmbed = ({
  onIframeLoadTask,
  showLoader,
  herovideo = "",
  videoMsid = "",
}: any) => {
  const domainUrl = "https://etdev8243.indiatimes.com";
  const iframeUrl = `${domainUrl}/videodash.cms?autostart=1&tpname=investedge&widget=video&skipad=true&primeuser=0&ismktwebpre=true&msid=${videoMsid}`;

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
          className={`${styles.videoFrame} ${herovideo === "yes" ? styles.herovideo : ""}`}
          src={iframeUrl}
          title="Video"
          loading="lazy"
          allowFullScreen={true}
        ></iframe>
      </div>
    </>
  );
};

export default VideoEmmbed;
