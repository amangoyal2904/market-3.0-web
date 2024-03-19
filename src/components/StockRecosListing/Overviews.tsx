import React from "react";
import SlickSlider from "../SlickSlider";
import StockReco from "../StockReco";
import styles from "./styles.module.scss";
import Link from "next/link";
import Blocker from "../Blocker";
import { useStateContext } from "../../store/StateContext";
interface Props {
  data: any;
  urlFilterHandle: any;
  activeApi: any;
}
const Overview: React.FC<Props> = ({ data, urlFilterHandle, activeApi }) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;

  // console.log("recos-", data);

  const responsive = [
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 5,
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
      breakpoint: 1361,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ];

  const redirectLink = (apiType: any) => {
    switch (apiType) {
      case "newRecos":
        return "/stocksrecos/newrecos/all";
      case "mostBuy":
        return "/stocksrecos/mostbuy";
      case "mostSell":
        return "/stocksrecos/mostsell";
      case "recoOnWatchlist":
        return "/stocksrecos/recos-on-your-watchlist";
      case "recoByFH":
        return "/stocksrecos/fundhousedetails";
      default:
        return "/stocksrecos/overview";
    }
  };
  return (
    <>
      {data?.recoData?.map((obj: any, index: any) => (
        <div key={`"overView"${index} `} className={styles.overviewMain}>
          <h2 className={styles.title} key={index}>
            {obj.name}
          </h2>
          {typeof obj?.data != "undefined" && obj?.data.length > 0 ? (
            obj?.data.length > 3 ? (
              <SlickSlider
                slides={obj.data?.map((card: any, index: any) => ({
                  content: (
                    <StockReco
                      data={card}
                      key={index}
                      activeTab={obj.apiType}
                      pageName={"stockRecosOverviewTab"}
                      urlFilterHandle={urlFilterHandle}
                    />
                  ),
                }))}
                key={`slider${obj.type}`}
                sliderId={`slider${obj.type}`}
                slidesToShow={3}
                slidesToScroll={1}
                rows={1}
                responsive={responsive}
              />
            ) : (
              <div className={styles.overViewCardWrap}>
                {obj?.data?.map((card: any, index: any) => (
                  <StockReco
                    data={card}
                    key={`overview_recos_${index}`}
                    activeTab={obj.apiType}
                    pageName={"stockRecosOverviewTab"}
                    urlFilterHandle={urlFilterHandle}
                  />
                ))}
              </div>
            )
          ) : (
            <div
              className={`${styles.overviewBlockerWrap} ${styles.listingWrap} ${styles.noDataFound}`}
            >
              {obj.apiType == "recoOnWL" ? (
                !isLogin ? (
                  <Blocker type="loginBlocker" />
                ) : (
                  <Blocker type={"noDataFound"} />
                )
              ) : (
                <Blocker type={"noDataFound"} />
              )}
            </div>
          )}
          {obj?.data.length > 3 && (
            <div className={styles.overviewViewAll}>
              <Link href={`${redirectLink(obj.apiType)}${urlFilterHandle()}`}>
                View all {obj.name}{" "}
                <span className={`eticon_next ${styles.arrowIcon}`}></span>
              </Link>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
export default Overview;
