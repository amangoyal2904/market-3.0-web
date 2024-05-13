import styles from "./styles.module.scss";
import APIS_CONFIG from "../../network/api_config.json";
import Service from "@/network/service";
import { APP_ENV } from "../../utils/index";
import SlickSlider from "../SlickSlider";
import StockScreenCards from "./StockScreenCards";
import ViewAllLink from "../ViewAllLink";
import { useState } from "react";

const fetchData = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=10`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await Service.get({
    url: API_URL,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const StockScreenerWidget = async () => {
  const responsive = [
    {
      breakpoint: 2560,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
  ];
  const data = await fetchData();
  const StockScreenerData: any =
    data &&
    data.datainfo &&
    data.datainfo.screenerCollectionMasterInfo &&
    data.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo &&
    data.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo.length > 0
      ? data.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo
      : [];

  return (
    <div className="sectionWrapper">
      <h2 className="heading">
        <a href="/markets/stock-screener" title="Stock Screeners">
          Stock Screeners
        </a>
        <span className={`eticon_caret_right headingIcon`} />
      </h2>
      <div className={styles.screenerCards}>
        {StockScreenerData.length && (
          <SlickSlider
            slides={StockScreenerData?.map((slides: any, index: any) => ({
              content: <StockScreenCards item={slides} index={index} />,
            }))}
            key={`screenerSlider}`}
            sliderId={`slider-screener`}
            slidesToShow={3}
            slidesToScroll={3}
            rows={1}
            topSpaceClass="screener"
            responsive={responsive}
          />
        )}
      </div>
      <ViewAllLink text="View All Screeners" link="/markets/stock-screener" />
    </div>
  );
};

export default StockScreenerWidget;
