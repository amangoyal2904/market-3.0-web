import styles from "./InvestEdgeVideoList.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { formatDateIE, getViews, millisToMinutesAndSeconds } from "@/utils";
import { useEffect, useState } from "react";
interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeBox = ({ slide, index, slug }: any) => {
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
      className={styles.right_vidBox}
      key={index}
      id={`section-${slide.msid}`}
    >
      <Link
        data-tt={slide.seoPath}
        href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].video}${slug?.[0]}/${slide.msid}`}
        // onClick={() => handleTabTracking(slide.label)}
        title={slide.label}
        className={styles.redirectLink}
      >
        <img src={slide.img} alt={slide.title} title={slide.title} />
        {slide?.videoDuration && (
          <span className={styles.duration}>
            {millisToMinutesAndSeconds(slide.videoDuration)}
          </span>
        )}
      </Link>
      <h4>{slide.title}</h4>
      <div className={styles.videoDetails}>
        {slide?.insertdate && (
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
export default InvestEdgeBox;
