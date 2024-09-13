"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";
import VideoEmbed from "../VideoEmbed";
import { useEffect, useState } from "react";
import { formatDateIE, getViews, millisToMinutesAndSeconds } from "@/utils";
import InvestEdgeBox from "./InvestEdgeBox";
interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
interface VideoDetails {
  title: string;
  videoDuration: string;
}
const InvestEdgeVideoBox = (props: any) => {
  const { title, invementIdeaNavResult, sectionData, slug } = props;
  const [showLoader, setShowLoader] = useState(true);
  const [view, setView] = useState<View[]>([]);
  const [videoData, setVideoData] = useState<VideoDetails>();
  useEffect(() => {
    sectionData.length > 0 &&
      sectionData.map((slide: any, index: any) => {
        if (slide.msid == slug[1]) {
          viewsWrapper(slide.slikeId);
          setVideoData(slide);
        }
      });
  }, []);

  const viewsWrapper = async (slikeId: string) => {
    console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };
  const onIframeLoadTask = () => {
    setShowLoader(false);
  };
  return (
    <div className={styles.ieVidContainer}>
      <h2>{title}</h2>
      {slug[1] ? (
        <VideoEmbed
          url={
            "https://etdev8243.indiatimes.com/videodash.cms?autostart=1&msid=" +
            slug[1] +
            "&tpname=investedge&widget=video&skipad=true&primeuser=0&ismktwebpre=true"
          }
          showLoader={showLoader}
          onIframeLoadTask={onIframeLoadTask}
        />
      ) : (
        ""
      )}
      <div className={styles.vidDetailsContainer}>
        <h4 className={styles.title}>{videoData?.title}</h4>
        <div className={styles.videoDetails}>
          {videoData?.videoDuration && (
            <>
              <span className={styles.duration}>
                Duration: {"  "}
                <span>
                  {millisToMinutesAndSeconds(videoData.videoDuration)}
                </span>
              </span>
            </>
          )}
          <span className={styles.views}>
            Views: {"  "}
            <span>{view.length > 0 ? view[0].views : "Loading..."}</span>
          </span>
        </div>
        <div className={styles.socialDetails}>
          <span className={styles.socialSpan}>
            <span className={`eticon_share ${styles.socialIcon}`}></span>Share
          </span>
          <span className={styles.socialSpan}>
            <span className={`eticon_thumbs_up ${styles.socialIcon}`}></span>
            Like
          </span>
        </div>
      </div>
      <div className={styles.ieVidList}>
        {sectionData.length > 0 &&
          sectionData.map(
            (slide: any, index: any) =>
              slide.msid != slug[1] && (
                <InvestEdgeBox slide={slide} key={index} slug={slug} />
              ),
          )}
      </div>
    </div>
  );
};

export default InvestEdgeVideoBox;
