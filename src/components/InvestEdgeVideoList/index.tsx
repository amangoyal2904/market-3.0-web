"use client";
import styles from "./InvestEdgeVideoList.module.scss";
import InvestEdgeBox from "./InvestEdgeBox";
import { getSeoNameFromUrl } from "@/utils";
const InvestEdgeVideoList = (props: any) => {
  const { title, invementIdeaNavResult, sectionData, slug } = props;

  return (
    <>
      <div className={styles.ieVidContainer}>
        <h2>{title}</h2>
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
