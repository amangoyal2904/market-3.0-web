"use client";
import React, { useRef, useState } from "react";
import styles from "./Investedge.module.scss";
import SlickSlider from "@/components/SlickSlider";
import InvestEdgeTopVideo from "@/components/InvestEdgeTopVideo";
import InvestEdgeLeftVideo from "@/components/InvestEdgeTopVideo/InvestEdgeLeftVideo";
import ETLearnTabs from "@/components/ETLearn/Tabs";
import TopHero from "@/components/ETLearn/TopHero";
import { trackingEvent } from "@/utils/ga";
import { getSeoNameFromUrl } from "@/utils";
const responsive = [
  {
    breakpoint: 2560,
    settings: {
      slidesToShow: 4,
    },
  },
  {
    breakpoint: 1921,
    settings: {
      slidesToShow: 3,
    },
  },
  {
    breakpoint: 1601,
    settings: {
      slidesToShow: 3,
    },
  },
  {
    breakpoint: 1281,
    settings: {
      slidesToShow: 2,
    },
  },
];

const ETLearnClient = ({ resultData, invementIdeaNavResult }: any) => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null); // State to track the active tab

  // Create a ref to store references for each ieBox section
  const sectionRefs = useRef<any>({});
  const loadVideoIframe = () => {
    setLoadVideo(true);
    setShowLoader(true);
  };

  const loadIframe = (url: string) => {};

  const onIframeLoadTask = () => {
    setShowLoader(false);
  };

  const removeSpaceandSmallCase = (elem: string) => {
    return elem.replace(" ", "").toLowerCase();
  };

  const gaTrackingClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "TitleClick",
      event_category: "mercury_engagement",
      event_label: `Click ${value}`,
      feature_name: "ETLearn",
      page_template: "etlearn",
      product_name: "Mercury_Earnings",
      selected_category: value,
    });
  };
  const gaTrackingViewAllClickHandler = (value: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "ViewAllClick",
      event_category: "mercury_engagement",
      event_label: `Click view all ${value} videos`,
      feature_name: "ETLearn",
      page_template: "etlearn",
      product_name: "Mercury_Earnings",
      selected_category: value,
    });
  };

  const pageDesc = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/etlearn`
    );
    return activeObj[0]?.desc;
  };
  //console.log("invementIdeaNavResult?.tabs", invementIdeaNavResult?.tabs);
  return (
    <>
      <TopHero head="ET Learn" headTag="h1" desc={pageDesc()} link="" />
      <ETLearnTabs tabData={invementIdeaNavResult?.tabs} />

      <div className={styles.ieContainer}>
        {resultData?.map((item: any, index: any) => {
          const sectionId = removeSpaceandSmallCase(item?.label);
          const videoPlayData = {
            videoId: item?.data[0]?.msid,
            videoMsid: item?.data[0]?.msid,
            activeVideoId: activeVideoId,
            setActiveVideoId: setActiveVideoId,
            videoDetails: item?.data[0],
            videoSecSeoPath: item?.seoPath,
            videoTitelSlug: getSeoNameFromUrl(item?.data[0]?.url, "videoshow"),
          };
          return (
            item.data.length > 0 && (
              <div
                id={sectionId}
                className={styles.ieBox}
                ref={(el) => {
                  sectionRefs.current[sectionId] = el; // Assign the ref, but don't return anything
                }}
                key={index}
              >
                <h2 className={styles.catHead}>
                  <a
                    href={`${item?.seoPath}`}
                    className={styles.spanTxt}
                    onClick={() => gaTrackingClickHandler(item?.label)}
                  >
                    {item?.label}
                  </a>
                </h2>
                <div className={styles.ieBoxList}>
                  <InvestEdgeLeftVideo
                    videoPlayData={videoPlayData}
                    selectedcategory={item?.label}
                  />
                  <div
                    className={`${styles.right_ieContent} ${item.data.length < 7 ? styles["noSlider"] : ""}`}
                  >
                    {item.data.length > 6 ? (
                      <SlickSlider
                        slides={item?.data
                          ?.slice(1)
                          .map((slide: any, index: any) => ({
                            content: (
                              <InvestEdgeTopVideo
                                slide={slide}
                                index={index}
                                seoPath={item.seoPath}
                                sliderFlag={true}
                                key={`${index}-slider`}
                                videoTitelSlug={getSeoNameFromUrl(
                                  slide?.url,
                                  "videoshow"
                                )}
                                selectedcategory={item?.label}
                              />
                            ),
                          }))}
                        key={`sliderNews`}
                        sliderId={`slider${item.seoPath}`}
                        slidesToShow={3}
                        slidesToScroll={1}
                        rows={2}
                        responsive={responsive}
                      />
                    ) : (
                      item?.data
                        ?.slice(1)
                        .map((elem: any, index: any) => (
                          <InvestEdgeTopVideo
                            slide={elem}
                            index={index}
                            seoPath={item.seoPath}
                            sliderFlag={false}
                            key={index}
                            videoTitelSlug={getSeoNameFromUrl(
                              elem?.url,
                              "videoshow"
                            )}
                            selectedcategory={item?.label}
                          />
                        ))
                    )}
                  </div>
                </div>
                <a
                  data-tt={item.seoPath}
                  href={`${item.seoPath}`}
                  title={item.label}
                  className={styles.viewall}
                  onClick={() => gaTrackingViewAllClickHandler(item.label)}
                >
                  {`View All ${item.label} videos`}
                  <span className={`eticon_next ${styles.nextIcon}`}></span>
                </a>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default ETLearnClient;
