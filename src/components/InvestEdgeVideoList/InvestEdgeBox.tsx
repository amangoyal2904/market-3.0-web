import styles from "./InvestEdgeVideoList.module.scss";
import Link from "next/link";
import { getViews, millisToMinutesAndSeconds } from "@/utils";
import { useEffect, useState } from "react";
import ViewShareSec from "@/components/ETLearn/ViewShareSec";
import { trackingEvent } from "@/utils/ga";

interface View {
  sid: string;
  views: number;
  views3sec: number;
  likes: number;
  dislikes: number;
}
const InvestEdgeBox = ({
  slide,
  slug,
  videoTitelSlug,
  selectedcategory = "",
}: any) => {
  const [view, setView] = useState<View[]>([]);

  const viewsWrapper = async (slikeId: string) => {
    // console.log("SlikeId---", slikeId);
    const viewsJson = await getViews(slikeId);
    if (viewsJson && viewsJson?.data?.length > 0) {
      setView(viewsJson.data);
    }
  };
  const videoUrl = `/markets/etlearn/${slug}/${videoTitelSlug}/${slide.msid}`;
  const viewData = {
    videoDetails: { ...slide },
    view,
    videoSecSeoPath: videoTitelSlug,
    videoMsid: slide.msid,
    shareUrl: `https://economictimes.indiatimes.com${videoUrl}`,
  };
  const gaTrackingClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "Click",
      event_category: "mercury_engagement",
      event_label: `${value}`,
      feature_name: "ETLearn",
      page_template: slug,
      product_name: "Mercury_Earnings",
      selected_category: selectedcategory,
    });
  };
  const imgUrlGenrate = `https://img.etimg.com/thumb/width-580,height-390,imgsize-527126,resizemode-100,msid-${slide?.msid}/markets/etlearn/${videoTitelSlug}.jpg`;
  useEffect(() => {
    viewsWrapper(slide?.slikeId);
  }, [slide?.slikeId]);
  return (
    <div className={styles.right_vidBox} id={`section-${slide.msid}`}>
      <Link
        data-tt={slide.seoPath}
        href={`${videoUrl}`}
        onClick={() => gaTrackingClickHandler(slide.title)}
        title={slide.label}
        className={styles.redirectLink}
      >
        <img src={imgUrlGenrate} alt={slide.title} title={slide.title} />
        {slide?.videoDuration && (
          <span className={styles.duration}>
            {millisToMinutesAndSeconds(slide.videoDuration)}
          </span>
        )}
      </Link>
      <h4>
        <Link
          data-tt={slide.seoPath}
          href={`${videoUrl}`}
          onClick={() => gaTrackingClickHandler(slide.title)}
          className={styles.redirectLink}
        >
          <span
            dangerouslySetInnerHTML={{
              __html:
                slide.title.length > 48
                  ? slide.title.substring(0, 48) + "..."
                  : slide.title,
            }}
          />
        </Link>
      </h4>
      <ViewShareSec
        data={viewData}
        dataFormate="two"
        selectedcategory={selectedcategory}
      />
    </div>
  );
};
export default InvestEdgeBox;
