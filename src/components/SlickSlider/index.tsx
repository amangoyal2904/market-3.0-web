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
  dotsNum: any;
}

const SlickSlider: React.FC<SlickSliderProps> = ({
  slides = [],
  sliderId,
  dotsNum,
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
    slidesToShow: 5,
    slidesToScroll: 5,
    rows: 2,
    appendDots: (dots) => (
      <div>
        <div className={`stockSliderIcons ${styles.SliderCommonIcons}`}>
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
      dotsNum(newIndex);
    },
    responsive: [
      {
        breakpoint: 1921,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1601,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1361,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, []);

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
