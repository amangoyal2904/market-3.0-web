import styles from "./styles.module.scss";
import { startTransition, useState, useRef, useEffect } from "react";
import SlickSlider from "../../SlickSlider";
import SectorCard from "../SectorCard";
import ViewAllCta from "../ViewAllCta";
import NoDataCard from "../DeclaredCards/NoDataCard";
import { trackingEvent } from "@/utils/ga";

const SectorAggregates = ({ data }: any) => {
  //const sliderRef = useRef<HTMLDivElement>(null);

  const [tabActive, setTabActive] = useState(0);
  const _tabData = data;
  const [tabContentData, setTabContentData] = useState(
    _tabData?.topSector || [],
  );
  const tabData = [
    { title: "Top Performing Sectors", id: 0 },
    { title: "Under Performing Sectors", id: 1 },
  ];
  const tabHandler = (value: number, title: string) => {
    setTabActive(value);
    if (value === 0) {
      setTabContentData(_tabData?.topSector || []);
    } else {
      setTabContentData(_tabData?.underSector || []);
    }
    gaTrackingTabClick(title);
    // if (sliderRef.current) {
    //   sliderRef.current.slickGoTo(0);
    // }
  };
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
        slidesToShow: 3,
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
  const gaTrackingTabClick = (sectorName: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_Earnings",
      event_action: "Sector Widget_Tab Change",
      event_category: "mercury_engagement",
      event_label: `Sector_ ${sectorName}`,
      feature_name: "Earnings",
      page_template: "Earnings_Overview",
      product_name: "Mercury_Earnings",
    });
  };
  return (
    <>
      <div className={styles.sectorWrap}>
        <div className={styles.headTxt}>Sector Aggregates</div>
        <ul className={styles.sectorTab}>
          {tabData.map((item: any, index: number) => {
            return (
              <li
                onClick={() => tabHandler(index, item?.title)}
                className={tabActive === index ? styles.active : ""}
                key={`${index}-${item.title}`}
              >
                {item.title}
              </li>
            );
          })}
        </ul>
        <div className={styles.tabContent}>
          {tabContentData && tabContentData.length > 0 ? (
            <>
              <div
                className={`${styles.contentWrap} ${tabContentData.length < 5 ? styles.noSliderWraper : ""}`}
              >
                {tabContentData.length > 4 ? (
                  <SlickSlider
                    // ref={sliderRef}
                    slides={tabContentData?.map((item: any, index: any) => ({
                      content: (
                        <SectorCard
                          item={item}
                          index={index}
                          key={`${index}-tabSecTab`}
                        />
                      ),
                    }))}
                    key={`slider-${tabActive}`}
                    sliderId={`slider-earningsTopSector`}
                    slidesToShow={5}
                    slidesToScroll={1}
                    rows={1}
                    responsive={responsive}
                    noPadding={true}
                    topSpaceClass="earningsTopSector"
                    //   screenWidth={screenWidth}
                  />
                ) : (
                  tabContentData?.map((item: any, index: number) => {
                    return (
                      <SectorCard
                        item={item}
                        index={index}
                        key={`${index}-tabSecTab`}
                      />
                    );
                  })
                )}
              </div>
              <ViewAllCta
                text={`${tabActive ? "View all Under Performing Sectors" : "View all Top Performing Sectors"}`}
                urlInternal="yes"
                url={`${tabActive ? "/markets/stocks/earnings/sector-aggregate/under-performing" : "/markets/stocks/earnings/sector-aggregate/top-performing"}`}
              />
            </>
          ) : (
            <NoDataCard title={`Not Enough Results published till date`} />
          )}
        </div>
      </div>
    </>
  );
};

export default SectorAggregates;
