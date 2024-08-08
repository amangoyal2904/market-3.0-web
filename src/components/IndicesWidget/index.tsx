"use client";
import { chartIntervals, saveLogs } from "@/utils/utility";
import styles from "./Indices.module.scss";
import SlickSlider from "../SlickSlider";
import StockCards from "./StockCards";
import { useRef, useState } from "react";
import APIS_CONFIG from "@/network/api_config.json";
import {
  APP_ENV,
  dateFormat,
  dateStringToMilliseconds,
  removeHostname,
  replaceWidthHeigh,
} from "@/utils/index";
import Service from "@/network/service";
import { useStateContext } from "@/store/StateContext";
import refreshConfig from "@/utils/refreshConfig.json";
import MarketStatus from "../MarketStatus";
import ViewAllLink from "../ViewAllLink";
import FIIDIIWIdget from "../FIIDIIWIdget";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import useIntervalApiCall from "@/utils/useIntervalApiCall";

const IndicesWidget = ({ data, topNewsData, fiiDiiCash }: any) => {
  const indicesWidgetRef = useRef<HTMLDivElement>(null);
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
  const [changePeriod, setChangePeriod] = useState("netChange");
  const [percentChange, setPercentChange] = useState("percentChange");
  const [indicesData, setIndicesData] = useState<any[]>(data?.indicesList);
  const [selectedIndex, setSelectedIndex] = useState<any>(data?.indicesList[0]);
  const [fiiCash, setFiiCash] = useState<any>(data?.fiiData);
  const [diiCash, setDiiCash] = useState<any>(data?.diiData);
  const [screenWidth, setScreenWidth] = useState<any>("");
  const [iframeSrc, setIframeSrc] = useState(
    `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=NSE Index&exchange=NSE&period=${period}&height=220&transparentBg=1`,
  );

  const handleIntervalClick = (item: any) => {
    setPeriod(item?.value);
    setChangePeriod(item?.change);
    setPercentChange(item?.percentChange);
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "indices_chart_interaction",
      event_label: `duration_change_${item?.value}`,
    });
    setIframeSrc(
      `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${selectedIndex?.symbol}&exchange=${selectedIndex?.exchange}&period=${item?.value}&height=220&transparentBg=1`,
    );
  };
  const getIndicesWidgetData = async () => {
    try {
      const response = await Service.get({
        url: `${(APIS_CONFIG as any)?.INDICES_WIDGET[APP_ENV]}`,
        params: {},
      });
      const data = response ? await response?.json() : {};
      saveLogs({
        type: "Mercury",
        res: "success",
        msg: "Successfully fetched indices widget data",
      });
      if (data && data.indicesList) {
        setIndicesData(data?.indicesList);
        setSelectedIndex((prevState: any) =>
          Object.keys(prevState)?.length
            ? data?.indicesList?.filter(
                (stock: { indexId: any }) => stock.indexId == prevState.indexId,
              )?.[0]
            : data?.indicesList[0],
        );
        setFiiCash(data?.fiiData);
        setDiiCash(data?.diiData);
      }
    } catch (e) {
      console.log("error in fetching indices data", e);
      saveLogs({
        type: "Mercury",
        res: "error",
        msg: "Error in fetching indices widget data",
      });
    }
  };
  const onSelectIndex = (selectedItem: any, index: any) => {
    setSelectedIndex(selectedItem);
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "indices_selected",
      event_label: `indices_${selectedItem?.exchange}_${selectedItem?.symbol} ${index}`,
    });
    setIframeSrc(
      `${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/renderchart.cms?type=index&symbol=${selectedItem?.symbol}&exchange=${selectedItem?.exchange}&period=${period}&height=220&transparentBg=1`,
    );
  };

  useIntervalApiCall(
    () => {
      if (currentMarketStatus != "CLOSED") getIndicesWidgetData();
      const resWidth = window.screen.width;
      setScreenWidth(resWidth);
    },
    refreshConfig?.indicesDetail,
    [currentMarketStatus],
    indicesWidgetRef,
  );

  if (!indicesData.length) {
    return null;
  }

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.IndicesContainer} ref={indicesWidgetRef}>
        <div className={styles.topWrapper}>
          <h2 className={styles.title}>
            <a
              href="/markets/indices"
              title="Indices"
              target="_blank"
              onClick={() =>
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "widget_heading",
                  event_label: "Indices",
                })
              }
            >
              Indices
              <span className={`eticon_caret_right ${styles.headingIcon}`} />
            </a>
          </h2>
          <MarketStatus
            currentMarketStatus={currentMarketStatus}
            dateTime={dateStringToMilliseconds(selectedIndex?.dateTime)}
            withSeparator={true}
          />
        </div>
        <div className={styles.dataWrapper}>
          {indicesData?.length && screenWidth && screenWidth <= 1820 ? (
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
              {indicesData?.map((slides, index) => (
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
                href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/markets/technical-charts?symbol=${selectedIndex?.symbol}&exchange=${selectedIndex?.exchange}&entity=index`}
                title={`Technicals: ${selectedIndex?.indexName}`}
                onClick={() =>
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "indices_chart_interaction",
                    event_label: "chart_type_change_technical",
                  })
                }
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
              title={`Technical Charts`}
            />
          </div>
          {selectedIndex?.indexName ? (
            <ViewAllLink
              text={`See ${selectedIndex?.indexName}`}
              link={`/markets/indices/${selectedIndex?.seoName}`}
              alignRight={true}
              padding="0 0 10px 0"
            />
          ) : (
            ""
          )}
          <div className={styles.bottomWidgets}>
            <Link
              target="_blank"
              href="/markets/stock-market-mood"
              title="Advance/Decline"
              className={styles.widget}
              onClick={() =>
                trackingEvent("et_push_event", {
                  event_category: "mercury_engagement",
                  event_action: "widget_heading",
                  event_label: "Advance/Decline",
                })
              }
            >
              <div className="dflex align-item-center">
                <p className={styles.title}>Advance/Decline</p>
                <span className={`eticon_caret_right ${styles.icon}`} />
              </div>
              <div className={styles.bottom}>
                <div className="dflex align-item-center space-between">
                  <span className={`numberFonts ${styles.label}`}>
                    {`${
                      selectedIndex?.advances
                        ? parseInt(selectedIndex?.advances)
                        : ""
                    } Advance`}
                  </span>
                  <span className={`numberFonts ${styles.label}`}>
                    {`${
                      selectedIndex?.declines
                        ? parseInt(selectedIndex?.declines)
                        : ""
                    } Decline`}
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
                {dateFormat(
                  dateStringToMilliseconds(selectedIndex?.dateTime),
                  "%d %MMM, %Y",
                )}
              </p>
            </Link>
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
        <a
          href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/markets`}
          target="_blank"
          title="Top News"
          className={styles.title}
          onClick={() =>
            trackingEvent("et_push_event", {
              event_category: "mercury_engagement",
              event_action: "top_news_clicked",
              event_label: `widget_heading`,
            })
          }
        >
          Top News
        </a>
        <ul>
          {!!topNewsData &&
            topNewsData.length &&
            topNewsData?.slice(0, 6)?.map((list: any, index: number) =>
              list?.type === "lb" ? (
                <li key="liveblog">
                  <div className={`prel ${styles.liveBlog}`}>
                    <span className={styles.liveBlinker}></span>
                    <span className={styles.heading}>Live Updates</span>
                  </div>
                  <a
                    href={removeHostname(list?.wu)}
                    className={styles.topNewsList}
                    target="_blank"
                    title={list?.title}
                    onClick={() =>
                      trackingEvent("et_push_event", {
                        event_category: "mercury_engagement",
                        event_action: "top_news_clicked",
                        event_label: `1 ${list?.title}`,
                      })
                    }
                  >
                    <p>
                      <span
                        className={styles.topNewsTitle}
                        dangerouslySetInnerHTML={{
                          __html: list?.title,
                        }}
                      />
                    </p>
                  </a>
                </li>
              ) : (
                <li key={`topNews${index}`}>
                  <a
                    href={removeHostname(list?.wu)}
                    className={styles.topNewsList}
                    target="_blank"
                    title={list?.hl}
                    onClick={() =>
                      trackingEvent("et_push_event", {
                        event_category: "mercury_engagement",
                        event_action: "top_news_clicked",
                        event_label: `${index + 1} ${list?.hl}`,
                      })
                    }
                  >
                    <p>
                      <span
                        className={styles.topNewsTitle}
                        dangerouslySetInnerHTML={{
                          __html: list?.hl,
                        }}
                      />
                      {/* {list?.minRead ? (
                        <span className={styles.readTime}>{list.minRead}</span>
                      ) : (
                        ""
                      )} */}
                    </p>
                    {!!list?.im && (
                      <img
                        width="55"
                        height="41"
                        src={replaceWidthHeigh(list?.im, "55", "41")}
                        alt="Top News Image"
                        title={list?.hl}
                      />
                    )}
                    {list?.sv === "video" ? (
                      <span className={styles.videoIcon} />
                    ) : (
                      ""
                    )}
                  </a>
                </li>
              ),
            )}
        </ul>

        <ViewAllLink
          text="See All News"
          link={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/markets`}
          alignRight={true}
          padding="16px 0 0 0"
        />
      </div>
    </div>
  );
};
export default IndicesWidget;
