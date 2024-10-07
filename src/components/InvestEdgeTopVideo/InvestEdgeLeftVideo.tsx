import React, { useEffect, useRef, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import VideoEmbed from "../VideoEmbed";
import { formatTimestamp, getViews, millisToMinutesAndSeconds } from "@/utils";
import Share from "../Share";

// Define the interface for the view object
interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeLeftVideo = ({
  videoId,
  activeVideoId,
  setActiveVideoId,
  videoDetails,
  videoMsid,
  videoSecSeoPath,
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [view, setView] = useState<View[]>([]);
  const liveStreamRef = useRef(null);
  const lastVisibilityChangeTime = useRef(0);

  const DEBOUNCE_DELAY = 100; // Adjust the delay as needed (milliseconds)

  useEffect(() => {
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

  useEffect(() => {
    viewsWrapper(videoDetails?.slikeId);
  }, [videoDetails?.slikeId]);

  const viewsWrapper = async (slikeId: string) => {
    console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };

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

          <div className={styles.playBtn}></div>
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
        {videoDetails?.insertdate && (
          <span className={styles.date}>
            {formatTimestamp(videoDetails.insertdate)}
          </span>
        )}
        {videoDetails?.videoDuration && (
          <>
            <span className={styles.dash}>|</span>
            <span className={styles.duration}>
              Duration: {millisToMinutesAndSeconds(videoDetails.videoDuration)}
            </span>
          </>
        )}
        <span className={styles.dash}>|</span>
        <span className={styles.views}>
          Views: {view.length > 0 ? view?.[0]?.views : "Loading..."}
        </span>
      </div>
      <div className={styles.socialDetails}>
        {/* <span className={styles.socialSpan}>
          <span className={`eticon_share ${styles.socialIcon}`}></span>Share
        </span> */}
        <Share
          title={videoDetails?.title || ""}
          streamURL={`https://economictimes.indiatimes.com/markets/etlearn/video/${videoSecSeoPath}/${videoMsid}`}
          shareIconStyle="round"
        />
        <span className={styles.socialSpan}>
          <span className={`eticon_thumbs_up ${styles.socialIcon}`}></span>Like
        </span>
      </div>
    </div>
  );
};

export default InvestEdgeLeftVideo;
