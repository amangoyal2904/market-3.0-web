import styles from "./LiveStreamPlay.module.scss";
import SlickSlider from "../SlickSlider";
import Share from "../Share";
import APIS_CONFIG from "../../network/api_config.json";
import Service from "../../network/service";
import { APP_ENV, getCookie, initSSOWidget } from "@/utils";
import { useStateContext } from "@/store/StateContext";
import { useEffect, useRef, useState } from "react";

const LiveStreamCards = ({
  slide,
  index,
  currentSIndex,
  iframeURL,
  iframeRef,
  onLoadIframe,
  expertFollowers,
  followingData,
  fetchFollowingExperts,
}: any) => {
  const { state, dispatch } = useStateContext();
  const [isVisible, setIsVisible] = useState(false);
  const liveStreamRef = useRef(null);
  const { isLogin } = state.login;
  const utmSource = "?utm_source=MarketHome&utm_medium=Self-Referrals";
  const ET_WAP_URL = "https://m.economictimes.com/";
  const isLive = slide.eventStatus == 3;
  const expertName =
    (slide.expertName && slide.expertName.replace(/ /g, "")) || "";
  const expertId = slide.expertId;
  const expertURL = `${ET_WAP_URL}markets/etmarkets-live/expert-bio/expertname-${expertName},expertid-${expertId}.cms${utmSource}`;
  const userObj = (slide.meta && slide.meta.userData) || {};
  const imageMSID = userObj?.imageMSID;
  const expertImg = imageMSID
    ? `https://img.etimg.com/thumb/msid-${imageMSID},width-58,height-54,imgsize-${imageMSID},resizemode-4/expert-image.jpg`
    : "https://img.etimg.com/photo/42031747.cms";
  const streamid = slide.eventId || "";
  const streamURL =
    streamid &&
    `${ET_WAP_URL}markets/etmarkets-live/streams${!isLive ? "recorded" : ""}/streamid-${streamid},expertid-${expertId}.cms${utmSource}`;
  const viewsText = isLive ? slide.concurrentViewsText : slide.totalViewsText;
  const followExpert = async () => {
    try {
      if (isLogin) {
        const data = {
          action: checkIfAlreadyFollowed(expertId) ? 0 : 1,
          userSettingSubType: 23,
          position: 0,
          source: 1,
          stype: 2,
          msid: expertId,
        };
        const authorization: any = getCookie("peuuid")
          ? getCookie("peuuid")
          : "";
        if (!!authorization) {
          const apiUrl = (APIS_CONFIG as any)?.["followExpert"][APP_ENV];
          const response: any = await Service.post({
            url: apiUrl,
            headers: {
              Authorization: authorization,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
            params: {},
            cache: "no-store",
          });
          const followStatus = await response?.json();
          console.log("@@@@@-->folllow", followStatus);
          if (followStatus && followStatus.status == "success") {
            fetchFollowingExperts();
          }
        }
      } else {
        initSSOWidget();
      }
    } catch (e) {
      console.log("error in follow api ", e);
    }
  };

  const checkIfAlreadyFollowed = (id: any) => {
    for (let i = 0; i < followingData?.length; i++) {
      if (followingData[i].prefDataVal == id) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
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
  }, []);
  const loadVideo = (url: string | undefined) => {
    return (
      <iframe
        src={url}
        ref={iframeRef}
        onLoad={onLoadIframe}
        allowFullScreen={true}
        allow="autoplay"
      />
    );
  };
  return (
    <div
      className={styles.cardContainer}
      key={slide.eventId}
      ref={liveStreamRef}
    >
      <div
        style={{ backgroundImage: `url(${slide.eventImageUrl})` }}
        className={styles.frameWrapper}
      >
        <div className={styles.iframeContent}>
          {isVisible &&
            iframeURL &&
            index === currentSIndex &&
            loadVideo(iframeURL)}
        </div>
      </div>
      <div className={styles.desc}>
        <div className={styles.topSec}>
          <p>
            <span className={styles.liveBlinker}></span>LIVE
          </p>
          <Share title={slide.title} streamURL={streamURL} />
        </div>
        <div>
          <a
            href={streamURL}
            title={slide.title}
            // onClick={()=>handleClick("storyTitle")}
          >
            <p className={styles.cardTitle}>{slide.title}</p>
          </a>
          {viewsText && <p className={styles.views}>{viewsText}</p>}
        </div>
        <div className={styles.expert}>
          <a
            href={expertURL}
            target="_blank"
            title={slide.expertName}
            // onClick={()=>handleClick("expert")}
          >
            {expertImg && (
              <img
                src={expertImg}
                alt={expertName}
                title={expertName}
                loading="lazy"
              />
            )}
            <p>
              {" "}
              <span className={styles.expertName}>{slide.expertName}</span>
              {expertFollowers > 50 ? (
                <span className={styles.followers}>
                  {expertFollowers + 500} followers
                </span>
              ) : (
                ""
              )}
            </p>
          </a>
          <p
            onClick={followExpert}
            className={`${styles.follow} ${checkIfAlreadyFollowed(expertId) ? styles.following : ""}`}
          >
            {checkIfAlreadyFollowed(expertId) ? "Following" : "+ Follow"}
          </p>
        </div>
      </div>
    </div>
  );
};

const LiveStreamPlayCards = ({
  newsData = [],
  currentSIndex,
  iframeURL,
  iframeRef,
  onSwitching,
  onLoadIframe,
  expertFollowers,
  followingData = [],
  fetchFollowingExperts,
}: any) => {
  return (
    newsData?.length && (
      <SlickSlider
        slides={newsData?.map((slides: any, index: any) => ({
          content: (
            <LiveStreamCards
              slide={slides}
              iframeRef={iframeRef}
              onLoadIframe={onLoadIframe}
              iframeURL={iframeURL}
              index={index}
              currentSIndex={currentSIndex}
              expertFollowers={expertFollowers}
              followingData={followingData}
              fetchFollowingExperts={fetchFollowingExperts}
            />
          ),
        }))}
        key={`liveStreamPlaySlider}`}
        sliderId={`slider-liveStreamPlay`}
        slidesToShow={1}
        slidesToScroll={1}
        rows={1}
        topSpaceClass="liveStreamPlay"
        onSlideChange={onSwitching}
      />
    )
  );
};

export default LiveStreamPlayCards;
