import React, { useEffect } from "react";
import styles from "./VideoEmbed.module.scss";
import Loader from "../Loader";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

const VideoEmbed = ({
  onIframeLoadTask,
  showLoader,
  herovideo = "",
  videoMsid = "",
  selectedcategory,
}: any) => {
  const domainUrl = `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}`;
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
        {/* {!showLoader ? (
          <Loader loaderType="inner"/>
        ) : (
          ""
        )} */}
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

export default VideoEmbed;
