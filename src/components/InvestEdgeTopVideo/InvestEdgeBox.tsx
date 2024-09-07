import React from "react";
import styles from "./InvestEdgeTopVideo.module.scss";
import Link from "next/link";
import GLOBAL_CONFIG from "../../network/global_config.json";

const InvestEdgeTopVideo1 = ({ slide, index }: any) => {
  return (
    <div className={styles.right_vidBox} key={index} id={`section-${index}`}>
      <img src={slide.img} alt={slide.title} title={slide.title} />
      <h4>{slide.title}</h4>
      <div className={styles.videoDetails}>
        <span className={styles.date}>14th Aug, 2024</span>
        <span className={styles.dash}>|</span>
        <span className={styles.views}>Views: 100</span>
      </div>
    </div>
  );
};

export default InvestEdgeTopVideo1;
