import styles from "./styles.module.scss";
import Image from "next/image";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useRef, useState, useEffect } from "react";
import { redirectToPlanPage } from "@/utils/ga";

const SliderBanner = ({
  bannerText,
  buttonText,
  buttonSubText,
  closeHandler,
  isPrime,
  showTimeFrame,
}: any) => {
  const [showCenterSlider, setShowCenterSlider] = useState(false);
  const sliderRef = useRef<Slider>(null);
  console.log("slider banner code run");
  const settings: Settings = {
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000, // auto play for every 10 seconds
    dots: true,
    infinite: true,
    swipe: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 1,
    customPaging: (i) => <span className={styles.customDots} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
    ],
  };
  // const checkUserType = (value:string)=>{
  //   let lableText = "";
  //   if(value === "a"){
  //     lableText = "Top Nudge_1"
  //   }else if(value === "b"){
  //     lableText = "Top Nudge_2"
  //   }
  //   return lableText;
  // }
  const objTracking = {
    category: "Subscription Flow ET",
    action: "Flow Started | SYFT",
    label: `Mercury_Retargeting`,
    obj: {
      item_name: `Mercury_Retargeting`,
      item_brand: "product_interventions",
      item_category: "subscription_nudges",
      item_category2: "",
      item_category3: "subscription_nudges",
      item_category4: buttonText,
      item_id: "",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: buttonText,
    },
  };

  useEffect(() => {
    const timeNumber = Number(showTimeFrame) * 1000 || 30000;
    if (!isPrime) {
      const timer = setTimeout(() => {
        setShowCenterSlider(true);
      }, timeNumber);

      return () => clearTimeout(timer);
    }
  }, [isPrime]);
  useEffect(() => {
    const newObjTracking = { ...objTracking };
    newObjTracking.action = "Blocker impression";
    redirectToPlanPage(newObjTracking, "view_item_list", false);
  }, []);
  return (
    <>
      {showCenterSlider && (
        <div className={styles.mainSliderSec}>
          <div
            className={styles.overlayClick}
            onClick={() => closeHandler()}
          ></div>
          <div className={`${styles.mainNudgeWrap} mainCenterSlider`}>
            <span
              className={styles.crossbtn}
              onClick={() => closeHandler()}
            ></span>

            <div className={styles.modalWrap}>
              <div className={styles.mainSlider}>
                <div className={styles.left}>
                  <div className={styles.mainTxt}>
                    <span>Experience the New & Enhanced</span>
                  </div>
                  <div className={styles.imgSec}>
                    <img
                      src={`https://img.etimg.com/photo/msid-114256971/et-markets-logo.jpg`}
                      alt="et market logo"
                      width="118"
                      height="23"
                    />
                  </div>
                  <div className={styles.pTxt}>{bannerText}</div>
                  <div className={styles.btnSec}>
                    <span
                      className={styles.primeBtn}
                      onClick={() => redirectToPlanPage(objTracking)}
                    >
                      {buttonText}
                      <i className={styles.arrowMkt}></i>
                    </span>
                    <span className={styles.flatTxt}>{buttonSubText}</span>
                  </div>
                </div>
                <div className={styles.right}>
                  <Slider ref={sliderRef} {...settings}>
                    <div className={styles.rightSliderWrap}>
                      <div className={styles.rightTxtp}>
                        Know where the top investors are investing with{" "}
                        <strong>BigBull Portfolio.</strong>
                      </div>
                      <div className={styles.rightImg}>
                        <img
                          src={`https://img.etimg.com/photo/msid-114256952/sliderImg1.jpg`}
                          alt="slider img one"
                          width={310}
                          height={200}
                        />
                      </div>
                    </div>

                    <div className={styles.rightSliderWrap}>
                      <div className={styles.rightTxtp}>
                        Buy low & sell high with{" "}
                        <strong>Stock Reports Plus.</strong>
                      </div>
                      <div className={styles.rightImg}>
                        <img
                          src={`https://img.etimg.com/photo/msid-114256950/sliderImg2.jpg`}
                          alt="slider img one"
                          width={253}
                          height={195}
                        />
                      </div>
                    </div>

                    <div className={styles.rightSliderWrap}>
                      <div className={styles.rightTxtp}>
                        Analyse the market sentiments & trend reversal with{" "}
                        <strong>Market Mood.</strong>
                      </div>
                      <div className={styles.rightImg}>
                        <img
                          src={`https://img.etimg.com/photo/msid-114256948/sliderImg3.jpg`}
                          alt="slider img one"
                          width={322}
                          height={200}
                        />
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SliderBanner;
