"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";
import VideoEmbed from "../VideoEmbed";
import { useState } from "react";
import { formatDateIE } from "@/utils";
import InvestEdgeBox from "./InvestEdgeBox";

const InvestEdgeVideoBox = (props: any) => {
  const { title, invementIdeaNavResult, sectionData, slug } = props;
  const [showLoader, setShowLoader] = useState(true);
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
      <div className={styles.ieVidList}>
        {sectionData.length > 0 &&
          sectionData.map(
            (slide: any, index: any) => (
              <InvestEdgeBox slide={slide} key={index} slug={slug} />
            ),
            // <div
            //   className={styles.right_vidBox}
            //   key={index}
            //   id={`section-${slide.msid}`}
            // >
            //   <Link
            //     data-tt={slide.seoPath}
            //     href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].video}${slug?.[0]}/${slide.msid}`}
            //     // onClick={() => handleTabTracking(slide.label)}
            //     title={slide.label}
            //   >
            //     <img src={slide.img} alt={slide.title} title={slide.title} />
            //   </Link>
            //   <h4>{slide.title}</h4>
            //   <div className={styles.videoDetails}>
            //     {slide?.insertdate && (
            //       <>
            //         <span className={styles.date}>{formatDateIE(slide.insertdate)}</span>
            //         <span className={styles.dash}>|</span>
            //       </>
            //     )}
            //     <span className={styles.views}>Views: 100</span>
            //   </div>
            // </div>
          )}
      </div>
    </div>
  );
};

export default InvestEdgeVideoBox;
