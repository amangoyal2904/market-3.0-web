"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Investedge.module.scss";
import SlickSlider from "@/components/SlickSlider";
import InvestEdgeTopVideo from "@/components/InvestEdgeTopVideo";
import InvestEdgeLeftVideo from "@/components/InvestEdgeTopVideo/InvestEdgeLeftVideo";
import { trackingEvent } from "@/utils/ga";
import Link from "next/link";
import GLOBAL_CONFIG from "@/network/global_config.json";
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
      slidesToShow: 2,
    },
  },
  {
    breakpoint: 1281,
    settings: {
      slidesToShow: 2,
    },
  },
];

const InvestEdgeClient = ({ resultData, invementIdeaNavResult }: any) => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [activeTab, setActiveTab] = useState<string>(""); // State to track the active tab

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

  const settings = {
    dots: false,
    arrow: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 2,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1281,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const removeSpaceandSmallCase = (elem: string) => {
    return elem.replace(" ", "").toLowerCase();
  };

  const handleTabTracking = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: "InvestEdge_" + tabName,
    });
  };

  // Scroll to the corresponding ieBox section with a 100px offset from the top
  const scrollToSection = (label: string) => {
    const sectionId = removeSpaceandSmallCase(label);
    const section = sectionRefs.current[sectionId];

    if (section) {
      // Get the offset position of the section and subtract 100px for the gap
      const topOffset =
        section.getBoundingClientRect().top + window.scrollY - 100;

      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });

      // Set the active tab when clicked
      setActiveTab(sectionId);
    }
  };

  // Handle tab highlighting when section comes into viewport
  const observeSections = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveTab(sectionId); // Set active tab based on section in the viewport
          }
        });
      },
      {
        root: null,
        rootMargin: "-100px 0px 0px 0px", // Adjust for a 100px offset
        threshold: 0.5, // Trigger when 50% of the section is visible
      },
    );

    // Observe each section
    Object.values(sectionRefs.current).forEach((section: any) => {
      if (section) {
        observer.observe(section);
      }
    });
  };

  useEffect(() => {
    observeSections(); // Start observing sections when component mounts
  }, [resultData]); // Re-observe if resultData changes
  console.log("___resultData", resultData);
  return (
    <>
      <div className={styles.subHead}>
        <ul className={styles.mainTabsList}>
          {invementIdeaNavResult?.tabs.map((item: any, index: any) => {
            const tabId = removeSpaceandSmallCase(item.label);
            return (
              <li
                key={`investEdge_main_${index}`}
                className={`${styles.mainTab} ${activeTab === tabId ? styles.active : ""}`} // Highlight active tab
                onClick={() => {
                  handleTabTracking(item.label);
                  scrollToSection(item.label); // Scroll on tab click
                }}
              >
                {item.label === "Live Stream" ? (
                  <Link
                    href={item.redirectLink}
                    target="_blank"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.ieContainer}>
        {resultData?.map((item: any, index: any) => {
          const sectionId = removeSpaceandSmallCase(item?.label);
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
                    href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].list}${item.seoPath}`}
                    className={styles.spanTxt}
                  >
                    {item?.label}
                  </a>
                </h2>
                <div className={styles.ieBoxList}>
                  <InvestEdgeLeftVideo
                    videoId={`video${item?.data[0]?.msid}`}
                    videoMsid={`${item?.data[0]?.msid}`}
                    activeVideoId={activeVideoId}
                    setActiveVideoId={setActiveVideoId}
                    videoDetails={item?.data[0]}
                    videoSecSeoPath={item?.seoPath}
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
                          />
                        ))
                    )}
                  </div>
                </div>
                <Link
                  data-tt={item.seoPath}
                  href={`${(GLOBAL_CONFIG as any)["INVESTEDGE_BASELINK"].list}${item.seoPath}`}
                  title={item.label}
                  className={styles.viewall}
                >
                  View All {item.label} videos{" "}
                  <span className={`eticon_next ${styles.nextIcon}`}></span>
                </Link>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default InvestEdgeClient;
