"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import InvestEdgeBox from "./InvestEdgeBox";
import { getSeoNameFromUrl } from "@/utils";
const InvestEdgeVideoList = (props: any) => {
  const {
    title,
    invementIdeaNavResult,
    sectionData,
    slug,
    headTag = "",
  } = props;

  return (
    <>
      <div className={styles.ieVidContainer}>
        {headTag === "h1" ? (
          <h1 className={styles.titelHead}>{title}</h1>
        ) : (
          <div className={styles.titelHead}>{title}</div>
        )}

        <div className={styles.ieVidList}>
          {sectionData.length > 0 &&
            sectionData.map((slide: any, index: any) => (
              <InvestEdgeBox
                slide={slide}
                key={index}
                slug={slug[0]}
                videoTitelSlug={getSeoNameFromUrl(slide?.url, "videoshow")}
                selectedcategory={title}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default InvestEdgeVideoList;
