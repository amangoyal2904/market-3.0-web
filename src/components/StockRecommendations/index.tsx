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
import GLOBAL_CONFIG from "../../network/global_config.json";
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
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1601,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1281,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ];

  const [windowWidth, setWindowWidth] = useState(0);
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
      event_label: `StockRecos_${tab.label}`,
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
  // ------------- Start to set windows Inner width -------------
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  // ------------- End to set windows Inner width -------------
  // ------------- Start Function for Getting slideToShow Value when window resize from responsive array -------------
  const getWindowSlidesToShow = (windowWidth: any, responsive: any) => {
    let nearestBreakpoint = null;

    // Find the nearest breakpoint greater than windowWidth
    for (const breakpoint of responsive) {
      if (
        breakpoint.breakpoint > windowWidth &&
        (!nearestBreakpoint ||
          breakpoint.breakpoint < nearestBreakpoint.breakpoint)
      ) {
        nearestBreakpoint = breakpoint;
      }
    }

    // Return the slidesToShow value of the nearest breakpoint
    return nearestBreakpoint
      ? nearestBreakpoint.settings.slidesToShow
      : responsive[0].settings.slidesToShow; // Default to the first breakpoint's slidesToShow if no suitable breakpoint found
  };
  // ------------- End Function for Getting slideToShow Value when window resize from responsive array -------------
  useEffect(() => {
    setLoaderState(false);
  }, [stockData]);

  // ------------- Start Window resizing Immidiate effect -------------
  useEffect(() => {
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);
  // ------------- End Window resizing Immidiate effect -------------

  // ------------- Start Getting slideToShow Value when window resize from responsive array -------------
  const slidesToShowexcat = getWindowSlidesToShow(windowWidth, responsive);
  // ------------- End Getting slideToShow Value when window resize from responsive array -------------

  if (stockRecoResult === null || recosNav === null) {
    // Return null to avoid rendering the component
    return null;
  }

  return (
    <div className="sectionWrapper">
      <HeadingHome
        title="Stock Recommendations"
        url={
          (GLOBAL_CONFIG as any)["STOCK_RECOS"][activeTab.seoPath] ||
          (GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"]
        }
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
                slidesToShow={slidesToShowexcat}
                slidesToScroll={1}
                rows={2}
                topSpaceClass={activeTab?.apiType}
                responsive={responsive}
              />
            ) : activeTab.seoPath == "recos-on-your-watchlist" && !isLogin ? (
              <Blocker type="watchlitFilterBlocker" />
            ) : (
              <Blocker type={"noDataFound"} />
            )}
          </div>
        </div>
      </div>
      <ViewAllLink
        text={`View All ${activeTab.label}`}
        link={
          (GLOBAL_CONFIG as any)["STOCK_RECOS"][activeTab.seoPath] ||
          (GLOBAL_CONFIG as any)["STOCK_RECOS"]["overview"]
        }
      />
    </div>
  );
};

export default StockRecommendations;
