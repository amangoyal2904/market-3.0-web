import React, { useEffect, useState } from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { formatDateIE, getViews, millisToMinutesAndSeconds } from "@/utils";
interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeTopVideo = ({ slide, index, seoPath, sliderFlag }: any) => {
  const [view, setView] = useState<View[]>([]);
  useEffect(() => {
    viewsWrapper(slide?.slikeId);
  }, [slide?.slikeId]);

  const viewsWrapper = async (slikeId: string) => {
    console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };

  return (
    <div
      className={`${styles.right_vidBox} ${!sliderFlag ? styles["noSlider"] : styles["yesSlider"]}`}
      key={index}
      id={`section-${index}`}
    >
      <Link
        data-tt={seoPath}
        href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].video}${seoPath}/${slide.msid}`}
        //onClick={() => handleTabTracking(item.label)}
        title={slide.title}
        className={styles.redirectLink}
      >
        <img src={slide.img} alt={slide.title} title={slide.title} />
        {slide?.videoDuration && (
          <span className={styles.duration}>
            {millisToMinutesAndSeconds(slide.videoDuration)}
          </span>
        )}
        {/* <span className={styles.playButton}>&#9658;</span> */}
      </Link>
      <h4>{slide.title}</h4>
      <div className={styles.videoDetails}>
        {slide.insertdate && (
          <>
            <span className={styles.date}>
              {formatDateIE(slide.insertdate)}
            </span>
            <span className={styles.dash}>|</span>
          </>
        )}
        <span className={styles.views}>
          Views: {view.length > 0 ? view[0].views : "Loading..."}
        </span>
      </div>
    </div>
  );
};

export default InvestEdgeTopVideo;
