import React, { useEffect, useRef, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import VideoEmbed from "../VideoEmbed";

const InvestEdgeLeftVideo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const liveStreamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentlyVisible = entry.isIntersecting;
        if (currentlyVisible !== isVisible) {
          setIsVisible(currentlyVisible);
        }
        //setIsVisible(entry.intersectionRatio === 1);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      },
    );

    if (liveStreamRef.current) {
      observer.observe(liveStreamRef.current);
    }

    return () => {
      if (liveStreamRef.current) {
        observer.unobserve(liveStreamRef.current);
      }
    };
  }, [isVisible]);

  const loadVideoIframe = () => {
    // if(!isVisible){
    setIsVisible(true);
    setShowLoader(true);
    //}
  };

  const onIframeLoadTask = () => {
    setShowLoader(false);
  };

  return (
    <div className={styles.left_ieContent} ref={liveStreamRef}>
      {!isVisible ? (
        <div className={styles.videoShowWrapper} onClick={loadVideoIframe}>
          <img
            src="https://economictimes.indiatimes.com/photo/112520689.cms"
            alt="Ram Charan"
            title=""
            fetchPriority="high"
          />
          <span className={styles.playButton}>&#9658;</span>
        </div>
      ) : (
        <VideoEmbed
          url={
            "https://etdev8243.indiatimes.com/videodash.cms?autostart=1&msid=112619727&tpname=investedge&widget=video&skipad=true&primeuser=0&ismktwebpre=true"
          }
          showLoader={showLoader}
          onIframeLoadTask={onIframeLoadTask}
        />
      )}
      <h3>How Does Stock Split Work</h3>
      <div className={styles.videoDetails}>
        <span className={styles.date}>14th Aug, 2024</span>
        <span className={styles.dash}>|</span>
        <span className={styles.duration}>Duration: 10:00</span>
        <span className={styles.dash}>|</span>
        <span className={styles.views}>Views: 100</span>
      </div>
      <div className={styles.socialDetails}>
        <span>Share</span>
        <span>Post</span>
        <span>Comment</span>
      </div>
    </div>
  );
};

export default InvestEdgeLeftVideo;
