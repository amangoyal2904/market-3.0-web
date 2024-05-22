"use client";
import React, { useEffect, useState } from "react";
import styles from "./StockRecommendations.module.scss";
import StockReco from "../StockReco";
import SlickSlider from "../SlickSlider";
import ViewAllLink from "../ViewAllLink";
import HeadingHome from "../ViewAllLink/HeadingHome";
import { getStockRecosDetail } from "@/utils";
import { useStateContext } from "../../store/StateContext";
import Blocker from "../Blocker";
import Loader from "../Loader";
import { trackingEvent } from "@/utils/ga";
interface Props {
  stockRecoResult: any;
  recosNav: any;
}
const StockRecommendations: React.FC<Props> = ({
  stockRecoResult,
  recosNav,
}) => {
  const tabNames = recosNav?.tabs;
  const responsive = [
    {
      breakpoint: 2560,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
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
      breakpoint: 1281,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ];
  const [activeTab, setActiveTab] = useState(
    tabNames && tabNames?.length ? tabNames[0] : [],
  );
  const [stockData, setStockData] = useState<any[]>(
    stockRecoResult?.recoData[0]?.data,
  );
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const [loaderState, setLoaderState] = useState(false);

  const handleTabClick = (tab: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: `${tab.label} Stock Recos`,
    });
    setLoaderState(true);
    setActiveTab(tab);
    fetchData(tab.apiType);
  };
  const fetchData = async (type: any) => {
    const recosDetailResult = await getStockRecosDetail({
      getApiType: type,
      ssoid: isLogin ? ssoid : "",
      pageNo: 1,
    });

    // const payload = {
    //   apiType: type,
    //   filterType: "",
    //   filterValue: [],
    //   recoType: "all",
    //   pageSize: 30,
    //   pageNumber: 1,
    // };

    setStockData(recosDetailResult?.recoData[0]?.data);
  };

  useEffect(() => {
    setLoaderState(false);
  }, [stockData]);

  return (
    <div className="sectionWrapper">
      <HeadingHome
        title="Stock Recommendations"
        url={`/markets/stock-recos/overview`}
      />
      <div className={styles.tabMainBox}>
        <ul className={styles.tabs}>
          {tabNames?.map((tab: any, index: any) => (
            <li
              key={`${tab.seoPath}_${index}`}
              className={`${styles.tab} ${activeTab.seoPath === tab.seoPath ? styles.active : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </li>
          ))}
        </ul>

        <div className={styles.tabContentWraper}>
          <div
            className={`stockrecos_slickslide ${styles.tabContentBox} ${activeTab.seoPath === activeTab.seoPath ? styles.active : ""}`}
          >
            {loaderState ? (
              <Loader loaderType="inner" />
            ) : typeof stockData != "undefined" && stockData?.length > 0 ? (
              <SlickSlider
                slides={stockData?.map((card: any, index: any) => ({
                  content: (
                    <StockReco
                      data={card}
                      key={index}
                      activeTab={activeTab.apiType}
                      pageName="stockRecosPage"
                      urlFilterHandle={undefined}
                      source="home"
                    />
                  ),
                }))}
                key={`slider${activeTab.apiType}`}
                sliderId={`slider${activeTab.apiType}`}
                slidesToShow={3}
                slidesToScroll={3}
                rows={2}
                responsive={responsive}
              />
            ) : activeTab.seoPath == "recos-on-your-watchlist" && !isLogin ? (
              <Blocker type="loginBlocker" />
            ) : (
              <Blocker type={"noDataFound"} />
            )}
          </div>
        </div>
      </div>
      <ViewAllLink
        text="See All Stock Recommendations"
        link="/markets/stock-recos/overview"
      />
    </div>
  );
};

export default StockRecommendations;
