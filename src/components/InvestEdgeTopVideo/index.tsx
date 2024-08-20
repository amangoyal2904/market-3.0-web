import React from "react";
import styles from "./InvestEdgeTopVideo.module.scss";

const InvestEdgeTopVideo = ({ slide, index }: any) => {
  return (
    <div className={styles.right_vidBox} key={index} id={`section-${index}`}>
      <img
        src={slide.speakerImg}
        alt={slide.speakerName}
        title={slide.speakerName}
      />
      <h4>{slide.speakerName}</h4>
      <div className={styles.videoDetails}>
        <span className={styles.date}>14th Aug, 2024</span>
        <span className={styles.dash}>|</span>
        <span className={styles.views}>Views: 100</span>
      </div>
    </div>
  );
};

export default InvestEdgeTopVideo;
