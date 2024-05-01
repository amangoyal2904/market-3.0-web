import React, { useState } from "react";
import styles from "./FIIDII.module.scss";
import Loader from "../Loader";

const FIIDIIChart = ({ apiType }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Set a timeout to hide the loader after 10 seconds even if onLoad doesn't fire
  setTimeout(() => {
    setIsLoading(false);
  }, 3000);

  return (
    <div className={styles.wrapper}>
      <h2 className={`${styles.heading3} ${styles.center}`}>
        FII & DII Buy-Sell Activity: Last 30 Days
      </h2>
      {isLoading && <Loader loaderType={"container"} />}
      <iframe
        src={`https://etdev8243.indiatimes.com/feeds/render_fiidiichart.cms?apitype=${apiType}&platform=web&height=400`}
        style={{
          width: "100%",
          height: "400px",
          border: "none",
          outline: "none",
          visibility: isLoading ? "hidden" : "visible", // Hide iframe while loading
        }}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default FIIDIIChart;
