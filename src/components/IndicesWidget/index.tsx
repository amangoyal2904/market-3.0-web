"use client";
import { chartIntervals } from "@/utils/utility";
import styles from "./Indices.module.scss";
import SlickSlider from "../SlickSlider";
import StockCards from "./StockCards";
import { useEffect, useState } from "react";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "@/network/service";
import { useStateContext } from "@/store/StateContext";
import refreshConfig from "@/utils/refreshConfig.json";
import MarketStatus from "../MarketStatus";
import ViewAllLink from "../ViewAllLink";

const IndicesWidget = () => {
  const responsive = [
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
    {
      breakpoint: 1601,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
    {
      breakpoint: 1361,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
  ];
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [period, setPeriod] = useState("1d");
  const [indicesData, setIndicesData] = useState<any[]>([]);
  const [topNewsData, setTopNewsData] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<any>({});
  const [iframeSrc, setIframeSrc] = useState("");
  const [symbol, setSymbol] = useState("");
  const handleIntervalClick = (period: string) => {
    setPeriod(period);
    makeChartUrl(selectedIndex);
  };
  useEffect(() => {
    getIndicesWidgetData();
    fetchTopNews();
  }, []);
  const getIndicesWidgetData = async () => {
    const response = await Service.get({
      url: `${(APIS_CONFIG as any)?.INDICES_WIDGET[APP_ENV]}`,
      params: {},
    });
    const data = await response?.json();
    setIndicesData(data);
    setSelectedIndex((prevState: any) =>
      Object.keys(prevState)?.length ? prevState : data[0],
    );
    makeChartUrl(data[0]);
  };
  const onSelectIndex = (selectedItem: any) => {
    setSelectedIndex(selectedItem);
    makeChartUrl(selectedItem);
  };
  const makeChartUrl = (selectedItem: any) => {
    const symbol =
      selectedItem?.segment == "NSE"
        ? selectedItem.scripCode1GivenByExhange
        : selectedItem.scripCode2GivenByExchange;
    const exchangeId = selectedItem?.segment;
    const url = `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${symbol}&exchange=${exchangeId}&period=${period}&height=320&transparentBg=1`;
    setSymbol(symbol);
    setIframeSrc(url);
  };
  const fetchTopNews = async () => {
    try {
      const response = await Service.get({
        url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=81409979`,
        params: {},
      });
      const data = await response?.json();
      const topNewsData =
        (data &&
          data.searchResult &&
          data.searchResult[0] &&
          data.searchResult[0].data) ||
        [];
      setTopNewsData(topNewsData);
    } catch (e) {
      console.log("Error in fetching top news", e);
    }
  };
  useEffect(() => {
    const intervalId: any = setInterval(() => {
      if (currentMarketStatus === "LIVE") {
        getIndicesWidgetData();
      }
    }, refreshConfig?.indicesDetail);

    return () => clearInterval(intervalId);
  }, [currentMarketStatus]);
  return (
    <div className={styles.widgetContainer}>
      <div className={styles.IndicesContainer}>
        <div className={styles.topWrapper}>
          <p className={styles.title}>
            Indices{" "}
            <span className={`eticon_caret_right ${styles.headingIcon}`} />
          </p>
          <div className={styles.liveStatus}>
            <MarketStatus
              currentMarketStatus={currentMarketStatus}
              dateTime={selectedIndex?.dateTimeYear}
            />
          </div>
        </div>
        <div className={styles.dataWrapper}>
          {indicesData.length ? (
            <SlickSlider
              slides={indicesData?.map((slides: any, index: any) => ({
                content: (
                  <StockCards
                    item={slides}
                    index={index}
                    selectedIndex={selectedIndex}
                    onSelectIndex={onSelectIndex}
                  />
                ),
              }))}
              key={`indicesSlider}`}
              sliderId={`slider-indices`}
              slidesToShow={5}
              slidesToScroll={5}
              rows={1}
              responsive={responsive}
              noPadding={true}
              topSpaceClass="indices"
            />
          ) : (
            ""
          )}
          <div id="chart">
            <div className={styles.chartOpts}>
              <ul className={styles.interval}>
                {chartIntervals.map((item: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className={period === item.value ? styles.active : ""}
                      onClick={() => handleIntervalClick(item.value)}
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
              <a
                className={styles.technical}
                target="_blank"
                title={`Technicals: ${selectedIndex?.indexName}`}
                href={`https://economictimes.indiatimes.com/markets/technical-charts?symbol=${symbol}&exchange=${selectedIndex?.segment}&entity=index`}
              >
                <span className="eticon_candlestick">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </span>
                Technicals
              </a>
            </div>
            <iframe
              src={iframeSrc}
              style={{
                width: "100%",
                height: "320px",
                border: "none",
                outline: "none",
              }}
            />
          </div>
          <div className={styles.bottomWidgets}>
            <div className={styles.widget}>
              <div className="dflex align-item-center">
                <p className={styles.title}>Advance/Decline</p>
              </div>
              <div className={styles.bottom}>
                <div className="dflex align-item-center space-between">
                  <p className={styles.head}>
                    {selectedIndex?.advances} Advances
                  </p>
                  <p className={styles.head}>
                    {selectedIndex?.declines} Declines
                  </p>
                </div>
                <div
                  className={`dflex align-item-center space-between ${selectedIndex?.advancesPercentange != "100" && selectedIndex?.declinesPercentange != "100" ? styles.gap2 : ""}`}
                >
                  <div
                    className={`${styles.bar} ${styles.up}`}
                    style={{ width: `${selectedIndex?.advancesPercentange}%` }}
                  ></div>
                  <div
                    className={`${styles.bar} ${styles.down}`}
                    style={{ width: `${selectedIndex?.declinesPercentange}%` }}
                  ></div>
                </div>
                <div className="dflex align-item-center space-between">
                  <span className={styles.label}>
                    {selectedIndex?.advancesPercentange
                      ? parseInt(selectedIndex?.advancesPercentange)?.toFixed(2)
                      : ""}
                    {selectedIndex?.advancesPercentange && "%"}
                  </span>
                  <span className={styles.label}>
                    {selectedIndex?.declinesPercentange
                      ? parseInt(selectedIndex?.declinesPercentange)?.toFixed(2)
                      : ""}
                    {selectedIndex?.declinesPercentange && "%"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.widget}></div>
            <div className={styles.widget}></div>
          </div>
        </div>
      </div>
      <div className={styles.newsContainer}>
        <p className={styles.title}>Top News</p>
        <ul>
          {topNewsData?.map((list, index) =>
            index < 5 ? (
              <li key={`topNews${index}`}>
                <a href={list?.url} className={styles.topNewsList}>
                  <p>
                    <span className={styles.topNewsTitle}>{list?.title}</span>
                    <span className={styles.readTime}>
                      {list.readtime} Mins ago{" "}
                    </span>
                  </p>
                  <img
                    width="55"
                    height="41"
                    src={list?.img}
                    loading="lazy"
                    decoding="async"
                  />
                  {list?.type == "videoshow" ? (
                    <span className={styles.videoIcon} />
                  ) : (
                    ""
                  )}
                </a>
              </li>
            ) : (
              ""
            ),
          )}
        </ul>
        <ViewAllLink
          text="See All Stocks"
          link="https://economictimes.indiatimes.com/markets/stocks"
          alignRight={true}
        />
      </div>
    </div>
  );
};
export default IndicesWidget;
