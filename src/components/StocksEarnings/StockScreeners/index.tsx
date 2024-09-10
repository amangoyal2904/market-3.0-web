import styels from "./style.module.scss";
import SlickSlider from "../../SlickSlider";
import Link from "next/link";

const StockScreeners = ({ data }: any) => {
  //console.log("____data___",data)
  const responsive = [
    {
      breakpoint: 2561,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1819,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1620,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1511,
      settings: {
        slidesToShow: 4,
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
  //console.log("______", data);
  return (
    <>
      <div className={styels.mainScrWrap}>
        <div className={styels.head2}>Stock Screeners - Quarterly Results</div>
        <div className={styels.scrSliderSec}>
          <SlickSlider
            slides={data[0]?.listScreenerMaster?.map(
              (item: any, index: any) => ({
                content: (
                  <div key={`${index}-scCard`} className={styels.mainScrCard}>
                    <Link
                      href={`/markets/stock-screener/${item.seoName}/screens/scrid-${item.screenerId}`}
                      className={styels.linkrap}
                    >
                      <div className={styels.leftCard}>
                        <div className={styels.headTxt}>{item.name}</div>
                        <div className={styels.descTxt}>{item.description}</div>
                      </div>
                      <div className={styels.rightCard}>
                        <div className={styels.scrCount}>
                          {item.resultsCompanyCount}
                          <span>Stocks</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ),
              }),
            )}
            key={`slider-ssc`}
            sliderId={`slider-earningsScreener`}
            slidesToShow={5}
            slidesToScroll={1}
            rows={1}
            responsive={responsive}
            noPadding={true}
            topSpaceClass="earningsScreener"
            //   screenWidth={screenWidth}
          />
        </div>
      </div>
    </>
  );
};

export default StockScreeners;
