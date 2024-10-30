"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import { trackingEvent } from "@/utils/ga";
import VideoEmbed from "../VideoEmbed";
import { useEffect, useState } from "react";
import { getViews, millisToMinutesAndSeconds } from "@/utils";
import InvestEdgeBox from "./InvestEdgeBox";
import { getSeoNameFromUrl } from "@/utils";
import ViewShareSec from "@/components/ETLearn/ViewShareSec";

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
  synopsis?: any;
}
const InvestEdgeVideoBox = ({ data }: any) => {
  const { title, sectionData, pageSlug, videoMsid } = data;
  const videoSecSeoPath: string = pageSlug || "";
  const [showLoader, setShowLoader] = useState(true);
  const [view, setView] = useState<View[]>([]);
  const [videoData, setVideoData] = useState<VideoDetails>();

  const viewsWrapper = async (slikeId: string) => {
    //console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };
  const onIframeLoadTask = () => {
    setShowLoader(false);
  };
  const viewData = {
    videoDetails: { ...videoData },
    view,
    videoSecSeoPath,
    videoMsid,
  };
  useEffect(() => {
    sectionData.length > 0 &&
      sectionData.map((slide: any, index: any) => {
        if (slide.msid == videoMsid) {
          viewsWrapper(slide.slikeId);
          setVideoData(slide);
        }
      });
  }, []);
  return (
    <div className={styles.ieVidContainer}>
      <h2>{videoData?.title}</h2>
      {videoMsid ? (
        <VideoEmbed
          videoMsid={videoMsid}
          showLoader={showLoader}
          onIframeLoadTask={onIframeLoadTask}
          herovideo="yes"
        />
      ) : (
        ""
      )}
      <div className={styles.vidDetailsContainer}>
        <div
          className={styles.descSec}
          dangerouslySetInnerHTML={{ __html: videoData?.synopsis }}
        />
        <ViewShareSec data={viewData} />
      </div>
      <div className={styles.ieVidList}>
        {sectionData.length > 0 &&
          sectionData.map(
            (slide: any, index: any) =>
              slide.msid != videoMsid && (
                <InvestEdgeBox
                  slide={slide}
                  key={`slikde-${index}`}
                  slug={videoSecSeoPath}
                  videoTitelSlug={getSeoNameFromUrl(slide?.url, "videoshow")}
                />
              ),
          )}
      </div>
    </div>
  );
};

export default InvestEdgeVideoBox;
