import React, { useEffect, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { getViews, millisToMinutesAndSeconds } from "@/utils";
import { calculateExtendedViews } from "../../utils";
import ViewShareSec from "@/components/ETLearn/ViewShareSec";
import { trackingEvent } from "@/utils/ga";

interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeTopVideo = ({
  slide,
  index,
  seoPath,
  sliderFlag,
  videoTitelSlug,
  selectedcategory,
}: any) => {
  const [view, setView] = useState<View[]>([]);

  const viewsWrapper = async (slikeId: string) => {
    //console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };

  const viewData = {
    videoDetails: { ...slide },
    view,
    videoSecSeoPath: videoTitelSlug,
    videoMsid: slide.msid,
    shareUrl: `https://economictimes.indiatimes.com${seoPath}/${videoTitelSlug}/${slide.msid}`,
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

  const imgUrlGenrate = `https://img.etimg.com/thumb/width-488,height-370,imgsize-527126,resizemode-100,msid-${slide?.msid}/markets/etlearn/${seoPath}/${videoTitelSlug}.jpg`;

  useEffect(() => {
    viewsWrapper(slide?.slikeId);
  }, [slide?.slikeId]);
  return (
    <div
      className={`${styles.right_vidBox} ${!sliderFlag ? styles["noSlider"] : styles["yesSlider"]}`}
      key={index}
      id={`section-${index}`}
    >
      <Link
        data-tt={seoPath}
        href={`${seoPath}/${videoTitelSlug}/${slide.msid}`}
        onClick={() => gaTrackingClickHandler(slide.title)}
        title={slide.title}
        className={styles.redirectLink}
      >
        <img src={imgUrlGenrate} alt={slide.title} title={slide.title} />
        {slide?.videoDuration && (
          <span className={styles.duration}>
            {millisToMinutesAndSeconds(slide.videoDuration)}
          </span>
        )}
        {/* <span className={styles.playButton}>&#9658;</span> */}
      </Link>
      <h4>
        <Link
          data-tt={seoPath}
          href={`${seoPath}/${videoTitelSlug}/${slide.msid}`}
          onClick={() => gaTrackingClickHandler(slide.title)}
        >
          <span
            dangerouslySetInnerHTML={{
              __html:
                slide.title.length > 40
                  ? slide.title.substring(0, 40) + "..."
                  : slide.title,
            }}
          />
        </Link>
      </h4>
      <ViewShareSec
        data={viewData}
        dataFormate="two"
        shareBoxShow="yes"
        selectedcategory={selectedcategory}
      />
    </div>
  );
};

export default InvestEdgeTopVideo;
