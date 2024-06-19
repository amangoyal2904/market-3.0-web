"use client";
import styles from "./styles.module.scss";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { getStockUrl } from "@/utils/utility";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import WatchlistAddition from "../../WatchlistAddition";
import { useStateContext } from "@/store/StateContext";
import dynamic from "next/dynamic";
import { redirectToPlanPage, trackingEvent } from "@/utils/ga";
import { usePathname } from "next/navigation";
const NonPrimeBlockerModule = dynamic(() => import("../../NonPrimeBlocker"), {
  ssr: false,
});
const WatchlistAddition = dynamic(() => import("../../WatchlistAddition"), {
  ssr: false,
});

const BigBullCard = ({ data, type, sectionName }: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const [showNonPrimeBlocker, setShowNonPrimeBlocker] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const router = usePathname();
  useEffect(() => {
    const arr = window.location.pathname.split("/");
    console.log("Card Router ---->", arr, arr[4]);
  }, [router]);

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
  const blurNameHandler = (topBatchName: any = "") => {
    const objTracking = {
      category: "mercury_engagement",
      action: "card_clicked",
      label: `${data?.investorIntro?.name}-${topBatchName}`,
      widget_name: `${sectionName}`,
      tab_name: "Overview",
      obj: {
        item_name: "bigbull_investors",
        item_id: data?.investorIntro?.name,
        item_brand: "market_tools",
        item_category: "bigbull",
        item_category2: `bigbull_Overview_${sectionName}`,
        item_category3: `subscriptions_blocker`,
        item_category4: "",
      },
      cdp: {
        event_nature: "impression",
        event_category: "subscription",
        event_name: "subscription_feature",
      },
    };
    setCompanyName(data?.investorIntro?.name);
    redirectToPlanPage(objTracking, "view_item_list", false);
    setShowNonPrimeBlocker(true);
    document.body.style.overflow = "hidden";
  };
  const blurNameHandlerClose = () => {
    setShowNonPrimeBlocker(false);
    document.body.style.overflow = "";
  };
  const gaTrackingCompanyNameClick = (comname: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "company_clicked",
      event_label: comname,
    });
  };
  const gaTrackingInvestorNameClick = (investorName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "investor_clicked",
      event_label: investorName,
    });
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
                        onClick={() => gaTrackingInvestorNameClick(slide.name)}
                        href={`/markets/top-india-investors-portfolio/${slide?.sharkSeoName},expertid-${slide?.sharkID}`}
                        className={styles.cardName}
                        title={slide.name}
                      >
                        <img
                          src={slide.imageURL}
                          width={28}
                          height={28}
                          alt={slide.name}
                          title={slide.name}
                          className={styles.imgWraper}
                          loading="lazy"
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
            onClick={() =>
              gaTrackingInvestorNameClick(data?.investorIntro?.name)
            }
            title={data?.investorIntro?.name}
            href={`/markets/top-india-investors-portfolio/${data?.investorIntro?.sharkSeoName},expertid-${data?.investorIntro?.sharkID}`}
            className={styles.top}
          >
            <img
              src={data?.investorIntro?.imageURL}
              width={52}
              height={52}
              alt={data?.investorIntro?.name}
              title={data?.investorIntro?.name}
              className={styles.expertImg}
              loading="lazy"
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
                    onClick={() =>
                      gaTrackingCompanyNameClick(
                        data?.companyData?.text ||
                          data?.bestPickStockData?.companyData?.text,
                      )
                    }
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
                      <span
                        className={`${data?.filingAwaitedTrend !== "" ? styles[data?.filingAwaitedTrend] : ""}`}
                      >
                        {data?.filingAwaitedText}
                      </span>
                    ) : data?.dealDateStr && data?.dealDateStr !== "" ? (
                      <span>{data?.dealDateStr}</span>
                    ) : (
                      ""
                    )}
                    {data?.companyData?.text ||
                      data?.bestPickStockData?.companyData?.text}
                  </a>
                ) : (
                  <span
                    className={styles.nameBlur}
                    onClick={blurNameHandler}
                  ></span>
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
                              onClick={() =>
                                gaTrackingCompanyNameClick(card?.uiLabel.text)
                              }
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
                            <span
                              className={styles.nameBlur}
                              onClick={() => blurNameHandler(card?.text)}
                            ></span>
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
      {showNonPrimeBlocker && (
        <Suspense fallback={<div>Loading</div>}>
          <NonPrimeBlockerModule
            oncloseModule={blurNameHandlerClose}
            companyName={companyName}
            sectionName={sectionName}
          />
        </Suspense>
      )}
    </>
  );
};

export default BigBullCard;
