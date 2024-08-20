import React from "react";
import styles from "./VideoEmbed.module.scss";

const Loading = () => {
  return (
    <div className={styles.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
