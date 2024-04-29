import React from "react";
import styles from "./FIIDII.module.scss";

const FiiDiiHeader = React.memo(
  ({
    heading = "FII & DII",
    desc = "Analyse the latest trend in major sectors by tracking the change in market-cap of individual sectors daily, quarterly, monthly, half-yearly and year-to-date. You can track it with the advance-decline graph of stocks plotted according to the change in market-cap contribution in their sector along with an absolute count of stocks advancing or declining.",
  }: {
    heading?: string;
    desc?: string;
  }) => {
    return (
      <>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.desc}>{desc}</p>
      </>
    );
  },
);

FiiDiiHeader.displayName = "FiiDiiHeader";
export default FiiDiiHeader;
