import React from "react";
import styles from "./IndicesDetails.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import SlickSlider from "../SlickSlider";
import IndicesNewsCard from "./IndicesNewsCard";
const LiveBlogIndexNews = React.memo(
  ({ indexName, indicesNews, liveblog }: any) => {
    const liveBlog = liveblog || {};
    const indexNews = indicesNews?.Item?.[0]?.NewsItem ?? [];
    const newsResponsive = [
      {
        breakpoint: 2561,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1921,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1601,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1361,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ];
    return (
      <>
        {!!liveBlog && liveBlog.msid != "" && (
          <div className={`${styles.wrapper} ${styles.liveBlog}`}>
            <div className="prel">
              <span className={styles.liveBlinker}></span>
              <span className={styles.heading}>Live Blog</span>
            </div>
            <a
              className={styles.linkBlog}
              href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/${liveBlog.seolocation}/liveblog/${liveBlog.msid}.cms`}
              target="_blank"
              title={liveBlog?.title}
              dangerouslySetInnerHTML={{
                __html: liveBlog?.title,
              }}
            ></a>
          </div>
        )}
        {!!indexNews.length && (
          <div className={`${styles.wrapper} ${styles.highlightedSection}`}>
            <h2 className={styles.heading}>{`${indexName} News`}</h2>
            <SlickSlider
              slides={indexNews?.map((slides: any, index: any) => ({
                content: <IndicesNewsCard data={slides} index={index} />,
              }))}
              key={`indicesNews}`}
              sliderId={`slider-news`}
              slidesToShow={4}
              slidesToScroll={1}
              rows={1}
              topSpaceClass="indicesNews"
              responsive={newsResponsive}
            />
          </div>
        )}
      </>
    );
  }
);

LiveBlogIndexNews.displayName = "LiveBlogIndexNews";
export default LiveBlogIndexNews;
