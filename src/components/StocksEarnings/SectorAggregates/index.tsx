import styles from "./styles.module.scss";
import { startTransition, useState, useRef, useEffect } from "react";
import SlickSlider from "../../SlickSlider";
import SectorCard from "../SectorCard";
import ViewAllCta from "../ViewAllCta";

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
  const tabHandler = (value: number) => {
    setTabActive(value);
    if (value === 0) {
      setTabContentData(_tabData?.topSector || []);
    } else {
      setTabContentData(_tabData?.underSector || []);
    }
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

  return (
    <>
      <div className={styles.sectorWrap}>
        <div className={styles.headTxt}>Sector Aggregates</div>
        <ul className={styles.sectorTab}>
          {tabData.map((item: any, index: number) => {
            return (
              <li
                onClick={() => tabHandler(index)}
                className={tabActive === index ? styles.active : ""}
                key={`${index}-${item.title}`}
              >
                {item.title}
              </li>
            );
          })}
        </ul>
        <div className={styles.tabContent}>
          <div className={styles.contentWrap}>
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
          </div>
          <ViewAllCta
            text={`${tabActive ? "View all Under Performing Sectors" : "View all Top Performing Sectors"}`}
            urlInternal="yes"
            url="/markets/stocks/sector-aggregates"
          />
        </div>
      </div>
    </>
  );
};

export default SectorAggregates;
