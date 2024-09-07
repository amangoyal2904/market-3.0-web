"use client";
import React, { useEffect, useState } from "react";
import styles from "./Investedge.module.scss";
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
const InvestEdgeClient = ({ resultData }: any) => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
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
  useEffect(() => {
    console.log("Result@@@@---->", resultData);
  }, []);

  return (
    <>
      <div className={styles.ieContainer}>
        <div className={styles.ieBox}>
          <h2>Stock Markets</h2>
          <div className={styles.ieBoxList}>
            <InvestEdgeLeftVideo
              videoId="video1"
              activeVideoId={activeVideoId}
              setActiveVideoId={setActiveVideoId}
            />

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
            <InvestEdgeLeftVideo
              videoId="video2"
              activeVideoId={activeVideoId}
              setActiveVideoId={setActiveVideoId}
            />
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
            <InvestEdgeLeftVideo
              videoId="video3"
              activeVideoId={activeVideoId}
              setActiveVideoId={setActiveVideoId}
            />
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
