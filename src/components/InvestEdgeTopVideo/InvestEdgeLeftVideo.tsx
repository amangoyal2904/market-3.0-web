import React, { useEffect, useRef, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import VideoEmbed from "../VideoEmbed";
import { getViews } from "@/utils";
import { getCookie } from "@/utils";
import Link from "next/link";
import ViewShareSec from "@/components/ETLearn/ViewShareSec";
import { trackingEvent } from "@/utils/ga";

// Define the interface for the view object
interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeLeftVideo = ({ videoPlayData, selectedcategory }: any) => {
  const {
    videoId,
    activeVideoId,
    setActiveVideoId,
    videoDetails,
    videoMsid,
    videoSecSeoPath,
    videoTitelSlug,
  } = videoPlayData;
  console.log(videoPlayData);
  const [isVisible, setIsVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [view, setView] = useState<View[]>([]);
  const liveStreamRef = useRef(null);
  const lastVisibilityChangeTime = useRef(0);

  const DEBOUNCE_DELAY = 100; // Adjust the delay as needed (milliseconds)
  const viewData = {
    videoDetails,
    view,
    videoSecSeoPath,
    videoMsid,
    shareUrl: `https://economictimes.indiatimes.com${videoSecSeoPath}/${videoTitelSlug}/${videoMsid}`,
  };
  const checkUserAllreadyLikeOrNot = async () => {
    const APIURL = `https://etusersqc2.economictimes.indiatimes.com/et/getpref?stype=2&usersettingsubType=23`;
    const _authorization: any = getCookie("peuuid");

    const resData = await fetch(APIURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: _authorization,
      },
    });
    const response = await resData.json();
    //console.log("__checkUserAllreadyLikeOrNot", response);
  };
  const checkLikeCount = async () => {
    const APIURL =
      "https://etusersqc2.economictimes.indiatimes.com/et/fetchprefdatavalcount";
    const _authorization: any = getCookie("peuuid");
    const bodyPayload = [
      {
        prefDataVal: videoMsid,
        userSettingSubType: "Stream",
      },
    ];

    const resData = await fetch(APIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: _authorization,
      },
      body: JSON.stringify(bodyPayload),
    });
    const response = await resData.json();
    //console.log("__responseCount", response);
  };
  const likeAPICall = async (dataBody: any) => {
    const followData = {
      action: dataBody?.likeStatus === "likeUp" ? 1 : 0,
      applicationname: 1,
      articletype: dataBody?.type,
      position: 0,
      source: 0,
      stype: 2,
      msid: videoMsid,
    };
    const _authorization: any = getCookie("peuuid");
    const APIURL =
      "https://etusersqc2.economictimes.indiatimes.com/et/savesettings/json";
    const resData = await fetch(APIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: _authorization,
      },
      body: JSON.stringify(followData),
    });
    const response = await resData.json();
    //console.log("__response", response);
    checkLikeCount();
  };
  const likeHandler = () => {
    const dataBody = {
      likeStatus: "likeUp",
      type: 23,
    };
    checkUserAllreadyLikeOrNot();
    likeAPICall(dataBody);
  };

  const viewsWrapper = async (slikeId: string) => {
    //console.log("SlikeId---", slikeId);
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
  const gaTrackingClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "Click",
      event_category: "mercury_engagement",
      event_label: `${value}`,
      feature_name: "ETLearn",
      page_template: "etlearn",
      product_name: "Mercury_Earnings",
      selected_category: selectedcategory,
    });
  };
  const imgMsid = videoDetails?.msid || "75267040";
  const imgUrlGenrate = `https://img.etimg.com/thumb/width-750,height-350,imgsize-527126,resizemode-100,msid-${imgMsid}/markets/etlearn/${videoSecSeoPath}/${videoTitelSlug}.jpg`;
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

  return (
    <div className={styles.left_ieContent} ref={liveStreamRef}>
      {!isVisible || activeVideoId !== videoId ? (
        <div className={styles.videoShowWrapper} onClick={loadVideoIframe}>
          {videoDetails && (
            <img
              src={imgUrlGenrate}
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
              videoMsid={videoDetails?.msid}
              showLoader={showLoader}
              onIframeLoadTask={onIframeLoadTask}
            />
          )}
        </div>
      )}
      <h3>
        <Link
          data-tt={videoSecSeoPath}
          href={`${videoSecSeoPath}/${videoTitelSlug}/${videoMsid}`}
          onClick={() => gaTrackingClickHandler(videoDetails?.title)}
          title={videoSecSeoPath.title}
        >
          {videoDetails?.title}
        </Link>
      </h3>
      <ViewShareSec data={viewData} selectedcategory={selectedcategory} />
    </div>
  );
};

export default InvestEdgeLeftVideo;
