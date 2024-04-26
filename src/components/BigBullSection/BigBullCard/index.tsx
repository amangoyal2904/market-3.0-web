import styles from "./styles.module.scss";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getStockUrl } from "@/utils/utility";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WatchlistAddition from "../../WatchlistAddition";
import { useStateContext } from "@/store/StateContext";

const BigBullCard = ({ data, type }: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  // const isPrime = true;
  console.log("isPrime", isPrime);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings: Settings = {
    speed: 500,
    arrows: true,
    dots: false,
    infinite: false,
    swipe: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    rows: 1,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlideIndex(newIndex);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
    ],
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
    <>
      <div className={`${styles.card} ${styles[type]}`}>
        {type === "card3" ? (
          <div className={styles.top}>
            <div className={styles.totalCTxt}>
              HELD BY {data.totalCompany} BULLS
            </div>
            <div className={`nameSliderCustome ${styles.sliderWrap}`}>
              <Slider ref={sliderRef} {...settings}>
                {data.investorsList.length &&
                  data?.investorsList.map((slide: any, index: number) => (
                    <div key={index}>
                      <Link
                        href={`/markets/top-india-investors-portfolio/${slide?.sharkSeoName},expertid-${slide?.sharkID}`}
                        target="_blank"
                        className={styles.cardName}
                        title={slide.name}
                      >
                        <img
                          src={slide.imageURL}
                          width={28}
                          height={28}
                          alt={slide.name}
                          className={styles.imgWraper}
                        />
                        <span className={styles.smallTxt}>{slide.name}</span>
                      </Link>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        ) : (
          <Link
            href={`/markets/top-india-investors-portfolio/${data?.investorIntro?.sharkSeoName},expertid-${data?.investorIntro?.sharkID}`}
            target="_blank"
            className={styles.top}
          >
            <img
              src={data?.investorIntro?.imageURL}
              width={52}
              height={52}
              alt={data?.investorIntro?.name}
              className={styles.expertImg}
            />
            <span className={styles.expertName}>
              {data && data.dealSignal && data.dealSignal !== "" ? (
                <span className={`${styles[data?.dealSignal]}`}>
                  {data?.dealSignal} By
                </span>
              ) : (
                ""
              )}
              {data?.investorIntro?.name}
            </span>
          </Link>
        )}
        {(type === "card2" || type === "card3") && (
          <div className={styles.middleTop}>
            <div className={styles.mtLeft}>
              {/* <div className={styles.updateDate}>Updated for Mar24 Qtr</div> */}
              <div className={styles.cname}>
                {isPrime ? (
                  <a
                    href={getStockUrl(
                      data?.companyData?.companyId ||
                        data?.bestPickStockData?.companyData?.companyId,
                      data?.companyData?.companySeoName ||
                        data?.bestPickStockData?.companyData?.companySeoName,
                      data?.companyData?.companyType ||
                        data?.bestPickStockData?.companyData?.companyType,
                    )}
                    target="_blank"
                  >
                    {data?.filingAwaitedText &&
                    data?.filingAwaitedText !== "" ? (
                      <span>{data?.filingAwaitedText}</span>
                    ) : data?.dealDateStr && data?.dealDateStr !== "" ? (
                      <span>{data?.dealDateStr}</span>
                    ) : (
                      ""
                    )}
                    {data?.companyData?.text ||
                      data?.bestPickStockData?.companyData?.text}
                  </a>
                ) : (
                  <span className={styles.nameBlur}></span>
                )}
              </div>
            </div>
            <div className={styles.mtRight}>
              {isPrime && (
                <WatchlistAddition
                  companyName={
                    data?.companyData?.text ||
                    data?.bestPickStockData?.companyData?.text
                  }
                  companyId={
                    data?.companyData?.companyId ||
                    data?.bestPickStockData?.companyData?.companyId
                  }
                  companyType={
                    data?.companyData?.companyType ||
                    data?.bestPickStockData?.companyData?.companyType
                  }
                  customStyle={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              )}
            </div>
          </div>
        )}
        {data?.stockGroupdata && data?.stockGroupdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.stockGroupdata.map((item: any, index: number) => {
                const __classname =
                  item?.uiValue?.trend === "UP"
                    ? "up"
                    : item?.uiValue?.trend === "DOWN"
                      ? "down"
                      : "";
                return (
                  <li key={`${index}-dinv`}>
                    <span>{item?.uiLabel?.text}</span>
                    <span
                      className={`${styles.noTxt} ${styles[__classname]}`}
                      dangerouslySetInnerHTML={{ __html: item?.uiValue?.text }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}

        {data?.stockdata && data?.stockdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.stockdata.map((item: any, index: number) => {
                const __classname =
                  item?.uiValue?.trend === "UP"
                    ? "up"
                    : item?.uiValue?.trend === "DOWN"
                      ? "down"
                      : "";
                return (
                  index <= 2 && (
                    <li key={`${index}-dinv`}>
                      <span>{item?.uiLabel?.text}</span>
                      <span
                        className={`${styles.noTxt} ${styles[__classname]}`}
                        dangerouslySetInnerHTML={{
                          __html: item?.uiValue?.text,
                        }}
                      />
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}

        {data?.bestPickStockData?.stockdata &&
        data?.bestPickStockData?.stockdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.bestPickStockData.stockdata.map(
                (item: any, index: number) => {
                  const __classname =
                    item?.uiValue?.trend === "UP"
                      ? "up"
                      : item?.uiValue?.trend === "DOWN"
                        ? "down"
                        : "";
                  return (
                    index <= 2 && (
                      <li key={`${index}-dinv`}>
                        <span>{item?.uiLabel?.text}</span>
                        <span
                          className={`${styles.noTxt} ${styles[__classname]}`}
                          dangerouslySetInnerHTML={{
                            __html: item?.uiValue?.text,
                          }}
                        />
                      </li>
                    )
                  );
                },
              )}
            </ul>
          </div>
        ) : (
          ""
        )}

        {type === "card1" && (
          <div className={styles.bottom}>
            <ul className={styles.cardListBtm}>
              {data?.cards && data?.cards.length > 0
                ? data.cards.map((card: any, i: number) => {
                    const __classname =
                      card?.uiValue?.trend === "UP"
                        ? "up"
                        : card?.uiValue?.trend === "DOWN"
                          ? "down"
                          : "";
                    return (
                      <li key={`${i}-cds`}>
                        <span
                          className={`${styles.topBatch} ${i === 0 ? styles.suc : styles.wr}`}
                        >
                          {card?.text}
                        </span>
                        <h4>
                          {isPrime ? (
                            <a
                              href={getStockUrl(
                                card.uiLabel.companyId,
                                card.uiLabel.companySeoName,
                                card.uiLabel.companyType,
                              )}
                              target="_blank"
                            >
                              {card?.uiLabel.text}
                            </a>
                          ) : (
                            <span className={styles.nameBlur}></span>
                          )}
                        </h4>
                        <h5>
                          <span
                            className={`${styles[__classname]}`}
                            dangerouslySetInnerHTML={{
                              __html: card?.uiValue.text,
                            }}
                          />
                        </h5>
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default BigBullCard;
