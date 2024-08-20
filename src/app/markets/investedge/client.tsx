"use client";
import React, { useState } from "react";
import styles from "./Investedge.module.scss";
import VideoEmbed from "@/components/VideoEmbed";
import SlickSlider from "@/components/SlickSlider";
import InvestEdgeTopVideo from "@/components/InvestEdgeTopVideo";
import InvestEdgeLeftVideo from "@/components/InvestEdgeTopVideo/InvestEdgeLeftVideo";

const responsive = [
  {
    breakpoint: 2560,
    settings: {
      slidesToShow: 5,
    },
  },
  {
    breakpoint: 1921,
    settings: {
      slidesToShow: 4,
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
const InvestEdgeClient = () => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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
  const masterClass = [
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112496176.cms",
      speakerName: "Prof. Aswath Damodaran",
      speakerDesignation: "Stern School of Business, NYU Valuation Guru",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112520689.cms",
      speakerName: "Dr. Ram Charan",
      speakerDesignation: "Global Advisor to CEOs & Corporate Boards",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112496278.cms",
      speakerName: "Warren Knight",
      speakerDesignation: "Global Advisor & Digital Transformation Expert",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112496381.cms",
      speakerName: "Ameen Haque",
      speakerDesignation: "Founder & Story Monk",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112496249.cms",
      speakerName: "Linda Scott",
      speakerDesignation:
        "Leadership, Communication & Culture Change Expert | Business Advisor | Keynote Speaker",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112496040.cms",
      speakerName: "Dr. Stuart L. Hart",
      speakerDesignation: "Author | Speaker | Thought Leader",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112495878.cms",
      speakerName: "Marshall Goldsmith",
      speakerDesignation: "Leadership Guru",
    },
    {
      speakerImg: "https://economictimes.indiatimes.com/photo/112495249.cms",
      speakerName: "Jason Morgan",
      speakerDesignation: "Best-selling author, TED and Keynote Speaker",
    },
  ];
  return (
    <>
      <div className={styles.ieContainer}>
        <div className={styles.ieBox}>
          <h2>Stock Markets</h2>
          <div className={styles.ieBoxList}>
            <InvestEdgeLeftVideo />
            {/* <div className={styles.left_ieContent}>
                    {!loadVideo ? (
                        <div className={styles.videoShowWrapper} onClick={loadVideoIframe}>
                            <img src="https://economictimes.indiatimes.com/photo/112520689.cms" alt="Ram Charan" title="" fetchPriority="high" />
                            <span className={styles.playButton}>&#9658;</span>
                        </div>
                    ) : (
                        <VideoEmbed url={"https://economictimes.indiatimes.com/videodash.cms?autostart=1&amp;msid=112619727&amp;tpname=investedge&amp;widget=video&amp;skipad=false&amp;primeuser=0"} showLoader={showLoader} onIframeLoadTask={onIframeLoadTask} />
                    )}
                        <h3>How Does Stock Split Work</h3>
                        <div className={styles.videoDetails}>
                            <span className={styles.date}>14th Aug, 2024</span>
                            <span className={styles.dash}>|</span>
                            <span className={styles.duration}>Duration: 10:00</span>
                            <span className={styles.dash}>|</span>
                            <span className={styles.views}>Views: 100</span>
                        </div>
                        <div className={styles.socialDetails}>
                            <span>Share</span>
                            <span>Post</span>
                            <span>Comment</span>
                        </div>
                    </div> */}
            <div className={styles.right_ieContent}>
              <SlickSlider
                slides={masterClass?.map((slide: any, index: any) => ({
                  content: <InvestEdgeTopVideo slide={slide} index={index} />,
                }))}
                key={`sliderNews`}
                sliderId={`sliderStockMarkets`}
                slidesToShow={3}
                slidesToScroll={1}
                rows={2}
                responsive={responsive}
              />
            </div>
          </div>
        </div>
        <div className={styles.ieBox}>
          <h2>Mutual Funds</h2>
          <div className={styles.ieBoxList}>
            <InvestEdgeLeftVideo />
            <div className={styles.right_ieContent}>
              <SlickSlider
                slides={masterClass?.map((slide: any, index: any) => ({
                  content: <InvestEdgeTopVideo slide={slide} index={index} />,
                }))}
                key={`sliderNews`}
                sliderId={`sliderMutualFunds`}
                slidesToShow={3}
                slidesToScroll={1}
                rows={2}
                responsive={responsive}
              />
            </div>
          </div>
        </div>
        <div className={styles.ieBox}>
          <h2>Investment Styles</h2>
          <div className={styles.ieBoxList}>
            <InvestEdgeLeftVideo />
            <div className={styles.right_ieContent}>
              <SlickSlider
                slides={masterClass?.map((slide: any, index: any) => ({
                  content: <InvestEdgeTopVideo slide={slide} index={index} />,
                }))}
                key={`sliderNews`}
                sliderId={`sliderInvestorType`}
                slidesToShow={3}
                slidesToScroll={1}
                rows={2}
                responsive={responsive}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestEdgeClient;
