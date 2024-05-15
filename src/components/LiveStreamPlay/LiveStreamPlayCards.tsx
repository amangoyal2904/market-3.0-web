import styles from "./LiveStreamPlay.module.scss";
import SlickSlider from "../SlickSlider";
import Share from "../Share";

const LiveStreamCards = ({
  slide,
  index,
  currentSIndex,
  iframeURL,
  iframeRef,
  onLoadIframe,
}: any) => {
  const utmSource = "?utm_source=MarketHome&utm_medium=Self-Referrals";
  const ET_WAP_URL = "https://m.economictimes.com/";
  const isLive = slide.eventStatus == 3;
  const expertName =
    (slide.expertName && slide.expertName.replace(/ /g, "")) || "";
  const expertId = slide.expertId;
  const expertURL = `${ET_WAP_URL}markets/etmarkets-live/expert-bio/expertname-${expertName},expertid-${expertId}.cms${utmSource}`;
  const userObj = (slide.meta && slide.meta.userData) || {};
  const imageMSID = userObj.imageMSID;
  const expertImg =
    imageMSID &&
    `https://img.etimg.com/thumb/msid-${imageMSID},width-58,height-54,imgsize-${imageMSID},resizemode-4/expert-image.jpg`;
  const streamid = slide.eventId || "";
  const streamURL =
    streamid &&
    `${ET_WAP_URL}markets/etmarkets-live/streams${!isLive ? "recorded" : ""}/streamid-${streamid},expertid-${expertId}.cms${utmSource}`;
  const viewsText = isLive ? slide.concurrentViewsText : slide.totalViewsText;

  return (
    <div className={styles.cardContainer} key={slide.eventId}>
      <div className={styles.frameWrapper}>
        <div className={styles.iframeContent}>
          {iframeURL && index === currentSIndex && (
            <iframe
              src={iframeURL}
              ref={iframeRef}
              onLoad={onLoadIframe}
              allowFullScreen={true}
              allow="autoplay"
            />
          )}
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
            // onClick={()=>handleClick("expert")}
          >
            {expertImg && (
              <img src={expertImg} alt={expertName} loading="lazy" />
            )}
            <p>
              {" "}
              <span className={styles.expertName}>{slide.expertName}</span>
              <span className={styles.followers}>4118 followers</span>
            </p>
          </a>
          <a
            href={expertURL}
            // onClick={()=>handleClick("watchButton")}
          >
            <p className={styles.follow}> + Follow</p>
          </a>
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
}: any) => {
  return (
    newsData?.length && (
      <div className={styles.liveStreamWrapper}>
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
              />
            ),
          }))}
          key={`liveStreamPlaySlider}`}
          sliderId={`slider-liveStreamPlay`}
          slidesToShow={1.1}
          slidesToScroll={1.1}
          rows={1}
          topSpaceClass="liveStreamPlay"
          onSlideChange={onSwitching}
        />
      </div>
    )
  );
};

export default LiveStreamPlayCards;
