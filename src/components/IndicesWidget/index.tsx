"use client";
import { chartIntervals } from "@/utils/utility";
import styles from "./Indices.module.scss";
import SlickSlider from "../SlickSlider";
import StockCards from "./StockCards";
import { useEffect, useState } from "react";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV, dateFormat, dateStringToMilliseconds } from "@/utils/index";
import Service from "@/network/service";
import { useStateContext } from "@/store/StateContext";
import refreshConfig from "@/utils/refreshConfig.json";
import MarketStatus from "../MarketStatus";
import ViewAllLink from "../ViewAllLink";
import FIIDIIWIdget from "../FIIDIIWIdget";

const IndicesWidget = () => {
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
  const { state } = useStateContext();
  const { currentMarketStatus } = state.marketStatus;
  const [period, setPeriod] = useState("1d");
  const [changePeriod, setChangePeriod] = useState("change1Week");
  const [percentChange, setPercentChange] = useState("percentChange");
  const [indicesData, setIndicesData] = useState<any[]>([]);
  const [topNewsData, setTopNewsData] = useState<any[]>([]);
  const [fiiDiiCash, setFiiDiiCash] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<any>({});
  const [fiiCash, setFiiCash] = useState<any>({});
  const [diiCash, setDiiCash] = useState<any>({});
  const [screenWidth, setScreenWidth] = useState<any>("");
  const [iframeSrc, setIframeSrc] = useState(
    `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=NSE Index&exchange=NSE&period=${period}&height=220&transparentBg=1`,
  );

  const handleIntervalClick = (item: any) => {
    setPeriod(item?.value);
    setChangePeriod(item?.change);
    setPercentChange(item?.percentChange);
    setIframeSrc(
      `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${selectedIndex?.symbol}&exchange=${selectedIndex?.exchange}&period=${item?.value}&height=220&transparentBg=1`,
    );
  };
  useEffect(() => {
    getIndicesWidgetData();
    fetchTopNews();
    fetchFiiDIIData();
  }, []);
  const getIndicesWidgetData = async () => {
    const response = await Service.get({
      url: `${(APIS_CONFIG as any)?.INDICES_WIDGET[APP_ENV]}`,
      params: {},
    });
    const data = await response?.json();
    setIndicesData(data?.indicesList);
    setSelectedIndex((prevState: any) =>
      Object.keys(prevState)?.length ? prevState : data?.indicesList[0],
    );
    setFiiCash(data?.fiiData);
    setDiiCash(data?.diiData);
  };
  const onSelectIndex = (selectedItem: any) => {
    setSelectedIndex(selectedItem);
    setIframeSrc(
      `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${selectedItem?.symbol}&exchange=${selectedItem?.exchange}&period=${period}&height=220&transparentBg=1`,
    );
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
  const fetchFiiDIIData = async () => {
    try {
      const response = await Service.get({
        url: (APIS_CONFIG as any)?.FIIDIICash[APP_ENV],
        params: {},
      });
      const data = await response?.json();
      const fiidiiData =
        (data && data.datainfo && data.datainfo.fiiDiiChart) || {};
      setFiiDiiCash(fiidiiData);
    } catch (e) {
      console.log("Error in fetching investment Data", e);
    }
  };
  useEffect(() => {
    const intervalId: any = setInterval(() => {
      if (currentMarketStatus === "LIVE") {
        getIndicesWidgetData();
      }
    }, refreshConfig?.indicesDetail);
    const resWidth = window.screen.width;
    setScreenWidth(resWidth);

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
              dateTime={dateStringToMilliseconds(selectedIndex?.dateTime)}
              withSeparator={true}
            />
          </div>
        </div>
        <div className={styles.dataWrapper}>
          {indicesData.length && screenWidth <= 1820 ? (
            <SlickSlider
              slides={indicesData?.map((slides: any, index: any) => ({
                content: (
                  <StockCards
                    item={slides}
                    index={index}
                    selectedIndex={selectedIndex}
                    onSelectIndex={onSelectIndex}
                    changePeriod={changePeriod}
                    percentChange={percentChange}
                  />
                ),
              }))}
              key={`indicesSlider}`}
              sliderId={`slider-indices`}
              slidesToShow={5}
              slidesToScroll={1}
              rows={1}
              responsive={responsive}
              noPadding={true}
              topSpaceClass="indices"
              screenWidth={screenWidth}
            />
          ) : (
            <div className={styles.customTabs}>
              {indicesData.map((slides, index) => (
                <StockCards
                  key={`indicesTab${index}`}
                  item={slides}
                  index={index}
                  selectedIndex={selectedIndex}
                  onSelectIndex={onSelectIndex}
                  changePeriod={changePeriod}
                  percentChange={percentChange}
                />
              ))}
            </div>
          )}
          <div id="chart">
            <div className={styles.chartOpts}>
              <ul className={styles.interval}>
                {chartIntervals.map((item: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className={period === item.value ? styles.active : ""}
                      onClick={() => handleIntervalClick(item)}
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
                href={`https://economictimes.indiatimes.com/markets/technical-charts?symbol=${selectedIndex?.symbol}&exchange=${selectedIndex?.exchange}&entity=index`}
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
                height: "220px",
                border: "none",
                outline: "none",
              }}
            />
          </div>
          {selectedIndex?.indexName ? (
            <ViewAllLink
              text={`See ${selectedIndex?.indexName}`}
              link={`/markets/indices/${selectedIndex.seoName}`}
              alignRight={true}
              padding="0 0 10px 0"
            />
          ) : (
            ""
          )}
          <div className={styles.bottomWidgets}>
            <div className={styles.widget}>
              <div className="dflex align-item-center">
                <p className={styles.title}>Advance/Decline</p>
              </div>
              <div className={styles.bottom}>
                <div className="dflex align-item-center space-between">
                  <span className={`numberFonts ${styles.label}`}>
                    {selectedIndex?.advances
                      ? parseInt(selectedIndex?.advances)?.toFixed(2)
                      : ""}
                  </span>
                  <span className={`numberFonts ${styles.label}`}>
                    {selectedIndex?.declines
                      ? parseInt(selectedIndex?.declines)?.toFixed(2)
                      : ""}
                  </span>
                </div>
                <div
                  className={`dflex align-item-center space-between ${
                    selectedIndex?.advancesPerChange != "100" &&
                    selectedIndex?.declinesPerChange != "100"
                      ? styles.gap2
                      : ""
                  }`}
                >
                  <div
                    className={`${styles.bar} ${styles.up}`}
                    style={{ width: `${selectedIndex?.advancesPerChange}%` }}
                  ></div>
                  <div
                    className={`${styles.bar} ${styles.down}`}
                    style={{ width: `${selectedIndex?.declinesPerChange}%` }}
                  ></div>
                </div>
              </div>
              <p className={styles.date}>
                {" "}
                {dateFormat(
                  dateStringToMilliseconds(selectedIndex?.dateTime),
                  "%d %MMM, %Y",
                )}
              </p>
            </div>
            <div className={styles.widget}>
              <FIIDIIWIdget
                fiiDiiCash={fiiDiiCash}
                fiiCash={fiiCash}
                type="fiiEquity"
              />
            </div>
            <div className={styles.widget}>
              <FIIDIIWIdget
                fiiDiiCash={fiiDiiCash}
                diiCash={diiCash}
                type="diiEquity"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.newsContainer}>
        <p className={styles.title}>Top News</p>
        <ul>
          {topNewsData?.map((list, index) =>
            index < 6 ? (
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
          text="See All News"
          link="https://economictimes.indiatimes.com/markets/stocks"
          alignRight={true}
          padding="16px 0 0 0"
        />
      </div>
    </div>
  );
};
export default IndicesWidget;
