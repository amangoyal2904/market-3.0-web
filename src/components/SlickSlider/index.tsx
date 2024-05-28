"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./SlickSlider.module.scss";

interface Slide {
  content: JSX.Element;
}

interface SlickSliderProps {
  slides: Slide[];
  sliderId: string;
  slidesToShow?: any;
  slidesToScroll?: any;
  rows?: any;
  topSpaceClass?: string;
  responsive?: any;
  noPadding?: boolean;
  screenWidth?: any;
  onSlideChange?: any;
}

const SlickSlider: React.FC<SlickSliderProps> = ({
  slides = [],
  sliderId,
  slidesToShow,
  slidesToScroll,
  rows,
  topSpaceClass = "",
  responsive = [],
  noPadding,
  screenWidth,
  onSlideChange,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const variableWidth = ["indices"];
  const isVariableWidth =
    variableWidth.includes(topSpaceClass) && screenWidth > 1240;

  const settings: Settings = {
    className: isVariableWidth ? "slider variable-width" : "",
    variableWidth: isVariableWidth,
    speed: 500,
    arrows: false,
    dots: true,
    infinite: false,
    swipe: true,
    slidesToShow: slidesToShow || 5,
    slidesToScroll: 1,
    rows: rows || 1,
    appendDots: (dots: any) => (
      <div>
        <div
          className={`stockSliderIcons ${styles.SliderCommonIcons} ${styles[`${topSpaceClass}`]}`}
        >
          <div
            className={`slick-prev slick-arrow ${styles.arrowIcon}`}
            onClick={currentSlideIndex == 0 ? () => {} : prevSlide}
          >
            <span
              className={`eticon_prev ${styles.commonArrow} ${currentSlideIndex == 0 ? styles.disableBtn : ""}`}
            ></span>
          </div>
          <div className={`custom-slick-dots ${styles.commonDots}`}>
            <ul> {dots} </ul>
          </div>
          <div
            className={`slick-next slick-arrow ${styles.arrowIcon} `}
            onClick={
              dots?.length == Math.ceil(currentSlideIndex / slidesToScroll) + 1
                ? () => {}
                : nextSlide
            }
          >
            <span
              className={`eticon_next ${styles.commonArrow} ${dots?.length == Math.ceil(currentSlideIndex / slidesToScroll) + 1 ? styles.disableBtn : ""}`}
            ></span>
          </div>
        </div>
      </div>
    ),
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlideIndex(newIndex);
    },
    afterChange: (newIndex: any) => {
      topSpaceClass == "liveStreamPlay" ? onSlideChange(newIndex) : "";
    },
    responsive: responsive,
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
    if (noPadding && topSpaceClass === "indices") {
      const elements: any = document.querySelectorAll(".slick-slide");
      if (elements.length > 0) {
        elements.forEach(
          (element: {
            classList: any;
            style: {
              padding: string;
            };
          }) => {
            element.style.padding = "0px";
          },
        );
      }
    }
  }, []);
  useEffect(() => {
    if (topSpaceClass === "recoOnWatchlist") {
      const elements: NodeListOf<HTMLElement> =
        document.querySelectorAll(".recoOnWatchlist");
      let NoOfChild: number = 0;
      elements.forEach((element) => {
        const activeElements = element.querySelectorAll(".slick-active");
        if (activeElements) {
          NoOfChild = activeElements.length;
        }
        if (NoOfChild < slidesToShow) {
          const slickTrackElement = element.querySelector(".slick-track");
          slickTrackElement?.classList.add("noTransform");
        }
      });

      // console.log("slidesToShow --->", slidesToShow, NoOfChild, topSpaceClass);
    }
  }, [slidesToShow, topSpaceClass]);

  useEffect(() => {
    const element: HTMLElement | null = document.getElementById(sliderId);
    if (element) {
      const slickTrack = element.querySelector(".slick-track");
      if (slickTrack) {
        const activeElements = slickTrack.querySelectorAll(".slick-slide");
        if (activeElements.length === 1) {
          const stockSliderIconsElement =
            element.querySelector(".stockSliderIcons");
          stockSliderIconsElement?.classList.add("disNone");
        }
        console.log(
          "slidesToShow --->",
          slidesToShow,
          activeElements.length,
          sliderId,
        );
      }
    }
  }, [sliderId, slidesToShow]);

  return (
    <div
      className={`stockSlider ${styles.sliderMain} ${topSpaceClass === "indices" ? styles.addMargin : ""} ${topSpaceClass === "recoOnWatchlist" ? "recoOnWatchlist" : ""}`}
      id={`${sliderId}`}
    >
      <div className={styles["slick-slider"]}>
        <Slider ref={sliderRef} {...settings}>
          {slides.length &&
            slides.map((slide, index) => (
              <div
                key={index}
                className={`${topSpaceClass === "indices" ? styles.indicesStyle : ""}`}
              >
                {slide.content}
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default SlickSlider;
