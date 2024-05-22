import React from "react";
import SlickSlider from "../SlickSlider";
import StockReco from "../StockReco";
import styles from "./styles.module.scss";
import Link from "next/link";
import Blocker from "../Blocker";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";
interface Props {
  data: any;
  urlFilterHandle: any;
  activeApi: any;
  overViewFilterRes: any;
}
const Overview: React.FC<Props> = ({
  data,
  urlFilterHandle,
  activeApi,
  overViewFilterRes,
}) => {
  const { state, dispatch } = useStateContext();
  const { isLogin } = state.login;

  const responsive = [
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1601,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1281,
      settings: {
        slidesToShow: 2,
      },
    },
  ];

  const handleLowerCase = (item: any) => {
    return item.toLowerCase().replace(/\s+/g, "-");
  };

  const redirectLink = (apiType: any) => {
    let tabName = handleLowerCase(apiType);

    //console.log("tabName --- ", tabName);

    switch (tabName) {
      case "recoonwl":
        return (GLOBAL_CONFIG as any)["STOCK_RECOS"]["recos-on-your-watchlist"]; //"/stocksrecos/recos-on-your-watchlist";
      case "recobyfh":
        return (GLOBAL_CONFIG as any)["STOCK_RECOS"]["fundhousedetails"]; //"/stocksrecos/fundhousedetails";
      default:
        return (GLOBAL_CONFIG as any)["STOCK_RECOS"][tabName]; //"/stocksrecos/newrecos/all";
    }
  };

  const overviewHtmlHandle = (data: any) => {
    console.log(JSON.stringify(data));
    return (
      <>
        {data?.recoData?.map((obj: any, index: any) => (
          <div
            key={`overView_${obj.apiType}_${index} `}
            className={styles.overviewMain}
          >
            <h2 className={styles.title} key={index}>
              <Link
                className="linkHover"
                href={`${redirectLink(obj.apiType)}${urlFilterHandle(obj.indexid ? obj.indexid : "")}`}
              >
                {obj.name}
              </Link>
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
                        filterIndex={obj.indexid ? obj.indexid : ""}
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
                <div
                  className={`${styles.overViewCardWrap} ${obj?.data.length < 3 ? styles.noGridCardView : ""}`}
                >
                  {obj?.data?.map((card: any, index: any) => (
                    <StockReco
                      data={card}
                      key={`overview_recos_${index}`}
                      activeTab={obj.apiType}
                      pageName={"stockRecosOverviewTab"}
                      urlFilterHandle={urlFilterHandle}
                      filterIndex={obj.indexid ? obj.indexid : ""}
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
                <Link
                  href={`${redirectLink(obj.apiType)}${urlFilterHandle(obj.indexid ? obj.indexid : "")}`}
                >
                  <span className="linkHover">View all {obj.name} </span>
                  <span className={`eticon_next ${styles.arrowIcon}`}></span>
                </Link>
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      {overviewHtmlHandle(data)}
      <div className="overview_filer">
        {overviewHtmlHandle(overViewFilterRes)}
      </div>
    </>
  );
};
export default Overview;
