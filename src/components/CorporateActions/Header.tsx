import React from "react";
import styles from "./styles.module.scss";

const CorporateActionseHeader = React.memo(
  ({
    heading = "Corporate Actions",
    desc = "Stay ahead of market-moving events! Track key corporate actions like Mergers, Buybacks, Dividends, Spinoffs, Reverse Stock Splits, Bonus Issues, and Right Issues with our comprehensive insights.",
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

CorporateActionseHeader.displayName = "CorporateActionseHeader";
export default CorporateActionseHeader;
