import React from "react";
import styles from "./styles.module.scss";

interface HeadingComponentsProps {
  heading: string;
  description: string;
}

const PageHeaderSection: React.FC<HeadingComponentsProps> = React.memo(
  ({ heading, description }) => {
    return (
      <>
        {heading && <h1 className={styles.heading}>{heading}</h1>}
        {description && <p className={styles.desc}>{description}</p>}
      </>
    );
  },
);

PageHeaderSection.displayName = "PageHeaderSection";
export default PageHeaderSection;
