import styles from "./styles.module.scss";
import ViewAllCta from "../ViewAllCta";
import { trackingEvent } from "@/utils/ga";
import SlickSlider from "../../SlickSlider";
import { useEffect } from "react";

const OtherSectors = ({ title, viewTxt, viewUrl, data }: any) => {
  const responsive = [
    {
      breakpoint: 2561,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1819,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1620,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1511,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1366,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1180,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ];
  const ChangeNumberFormate = (number: any) => {
    const formattedNumber = number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedNumber;
  };
  const __onSlideChange = (value: any) => {
    const allSlides = document.querySelectorAll(
      "#slider-otherSectorEarning .slick-slide.slick-active"
    );
    allSlides.forEach((slide: any) => {
      slide.style.borderRight = "solid 1px rgb(204, 204, 204)"; // Remove any existing border
    });
  };
  const gaTrackingCardClick = (sectorName: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "page_card_click",
      event_category: "mercury_engagement",
      event_label: `Card Click ${sectorName}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  useEffect(() => {
    __onSlideChange(0);
  }, []);
  return (
    <>
      <div className={styles.mainWrap}>
        <div className={styles.mainHead}>{title}</div>
        <div className={styles.secSliderWrap}>
          <SlickSlider
            slides={data?.map((list: any, index: any) => ({
              content: (
                <a
                  href={`/markets/stocks/earnings/sector-aggregate/${list?.assetSeoName}/id-${list?.assetId}`}
                  key={`topNews${index}`}
                  className={styles.newsCard}
                  onClick={() => gaTrackingCardClick(list?.assetName)}
                >
                  <div className={styles.topHeadTxt}>
                    <span>{list?.assetName}</span>
                  </div>
                  <div className={styles.mcap}>
                    {ChangeNumberFormate(list?.marketCap)}
                  </div>

                  <div className={styles.adDecSec}>
                    <div className={styles.topTxt}>
                      <span>{list?.advances} Advances</span>
                      <span>{list?.declines} Declines</span>
                    </div>
                    <div className={styles.grapSec}>
                      <span
                        style={{ width: `${list?.advancesPercentage}%` }}
                      ></span>
                      <span
                        style={{ width: `${list?.declinesPercentage}%` }}
                      ></span>
                    </div>
                    <div className={styles.btmSec}>
                      <span>{list?.advancesPercentage}%</span>
                      <span>{list?.declinesPercentage}%</span>
                    </div>
                  </div>
                </a>
              ),
            }))}
            key={`earningSector}`}
            sliderId={`slider-otherSectorEarning`}
            slidesToShow={5}
            slidesToScroll={1}
            rows={1}
            responsive={responsive}
            noPadding={true}
            onSlideChange={__onSlideChange}
            topSpaceClass="otherSectorEarning"
            //   screenWidth={screenWidth}
          />
        </div>
        <ViewAllCta text={viewTxt} url={viewUrl} />
      </div>
    </>
  );
};

export default OtherSectors;
