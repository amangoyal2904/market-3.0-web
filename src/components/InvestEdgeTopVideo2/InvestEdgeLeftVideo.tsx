import React, { useEffect, useRef, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import VideoEmbed from "../VideoEmbed";

const InvestEdgeLeftVideo1 = ({
  videoId,
  activeVideoId,
  setActiveVideoId,
  videoDetails,
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const liveStreamRef = useRef(null);
  const lastVisibilityChangeTime = useRef(0);

  const DEBOUNCE_DELAY = 100; // Adjust the delay as needed (milliseconds)

  useEffect(() => {
    console.log("DATA+++++---->>", videoDetails);
    const observer = new IntersectionObserver(
      ([entry]) => {
        const now = Date.now();
        const currentlyVisible = entry.isIntersecting;

        // Debounce the visibility change to prevent rapid state updates
        if (
          currentlyVisible !== isVisible &&
          now - lastVisibilityChangeTime.current > DEBOUNCE_DELAY
        ) {
          setIsVisible(currentlyVisible);
          lastVisibilityChangeTime.current = now;

          if (currentlyVisible) {
            setActiveVideoId(videoId);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1, // Ensure the video is fully in view
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
  }, [isVisible, videoId, setActiveVideoId]);

  const loadVideoIframe = () => {
    setIsVisible(true);
    setShowLoader(true);
    setActiveVideoId(videoId); // Set this video as active
  };

  const onIframeLoadTask = () => {
    setShowLoader(false);
  };

  return (
    <div className={styles.left_ieContent} ref={liveStreamRef}>
      {!isVisible || activeVideoId !== videoId ? (
        <div className={styles.videoShowWrapper} onClick={loadVideoIframe}>
          {videoDetails && (
            <img
              src={videoDetails.img}
              alt={videoDetails.title}
              title={videoDetails.title}
              fetchPriority="high"
            />
          )}

          <span className={styles.playButton}>&#9658;</span>
        </div>
      ) : (
        <div className={styles.vid}>
          {videoDetails && (
            <VideoEmbed
              url={
                "https://etdev8243.indiatimes.com/videodash.cms?autostart=1&tpname=investedge&widget=video&skipad=true&primeuser=0&ismktwebpre=true&msid=" +
                videoDetails.msid
              }
              showLoader={showLoader}
              onIframeLoadTask={onIframeLoadTask}
            />
          )}
        </div>
      )}
      <h3>{videoDetails?.title}</h3>

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

export default InvestEdgeLeftVideo1;
