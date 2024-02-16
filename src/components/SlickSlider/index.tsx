import React, { useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./SlickSlider.module.scss";

interface SlickSliderProps {
  slides: JSX.Element[];
}

interface DotsContainerProps {
  currentSlideIndex: number;
  goToSlide: (index: number) => void; // Function to change slide
}

const DotsContainer: React.FC<DotsContainerProps> = ({
  currentSlideIndex,
  goToSlide,
}) => {
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotsContainerRef.current) {
      const slickDotsElement = document.querySelector(".slick-dots");
      const customDotsContainer = document.createElement("div");
      customDotsContainer.className = `${styles.commonDots} custom-slick-dots`;
      if (slickDotsElement) {
        customDotsContainer.appendChild(slickDotsElement.cloneNode(true));
        dotsContainerRef.current.innerHTML = "";
        dotsContainerRef.current.appendChild(customDotsContainer);
      }
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dotIndex = parseInt(target.dataset.index || "", 10);
      if (!isNaN(dotIndex)) {
        goToSlide(dotIndex);
      }
    };

    if (dotsContainerRef.current) {
      dotsContainerRef.current.addEventListener("click", handleClick);
      return () => {
        dotsContainerRef.current?.removeEventListener("click", handleClick);
      };
    }
  }, [goToSlide]);

  return <div ref={dotsContainerRef} />;
};

const SlickSlider: React.FC<SlickSliderProps> = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const sliderConfig: Settings = {
    speed: 1000,
    arrows: false,
    dots: true,
    focusOnSelect: true,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    rows: 2,
    centerPadding: "0",
    swipe: true,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlideIndex(newIndex);
    },
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, []);

  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
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

  return (
    <div className={`stockSlider ${styles.sliderMain}`}>
      <div className={styles["slick-slider"]}>
        <Slider ref={sliderRef} {...sliderConfig}>
          {slides.map((slide, index) => (
            <div key={index}>{slide}</div>
          ))}
        </Slider>
      </div>
      <div className={`stockSliderIcons ${styles.SliderCommonIcons}`}>
        <div
          className={`slick-prev slick-arrow ${styles.arrowIcon}`}
          onClick={prevSlide}
        >
          <span className={`eticon_prev ${styles.commonArrow}`}></span>
        </div>
        <DotsContainer
          currentSlideIndex={currentSlideIndex}
          goToSlide={goToSlide}
        />
        <div
          className={`slick-next slick-arrow ${styles.arrowIcon}`}
          onClick={nextSlide}
        >
          <span className={`eticon_next ${styles.commonArrow}`}></span>
        </div>
      </div>
    </div>
  );
};

export default SlickSlider;
