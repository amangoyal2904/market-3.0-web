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
  responsive: any;
}

const SlickSlider: React.FC<SlickSliderProps> = ({
  slides = [],
  sliderId,
  slidesToShow,
  slidesToScroll,
  rows,
  topSpaceClass,
  responsive = [],
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings: Settings = {
    speed: 1000,
    arrows: false,
    dots: true,
    focusOnSelect: true,
    swipe: true,
    swipeToSlide: true,
    slidesToShow: slidesToShow || 5,
    slidesToScroll: slidesToScroll || 5,
    rows: rows || 1,
    appendDots: (dots) => (
      <div>
        <div
          className={`stockSliderIcons ${styles.SliderCommonIcons} ${styles[`${topSpaceClass}`]}`}
        >
          <div
            className={`slick-prev slick-arrow ${styles.arrowIcon}`}
            onClick={prevSlide}
          >
            <span className={`eticon_prev ${styles.commonArrow}`}></span>
          </div>
          <div className={`custom-slick-dots ${styles.commonDots}`}>
            <ul> {dots} </ul>
          </div>
          <div
            className={`slick-next slick-arrow ${styles.arrowIcon}`}
            onClick={nextSlide}
          >
            <span className={`eticon_next ${styles.commonArrow}`}></span>
          </div>
        </div>
      </div>
    ),
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlideIndex(newIndex);
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
  }, []);
  return (
    <div className={`stockSlider ${styles.sliderMain}`} id={`${sliderId}`}>
      <div className={styles["slick-slider"]}>
        <Slider ref={sliderRef} {...settings}>
          {slides.length &&
            slides.map((slide, index) => (
              <div key={index}>{slide.content}</div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default SlickSlider;
