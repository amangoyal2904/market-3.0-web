import styles from "./styles.module.scss";
import { removeHostname, replaceWidthHeight } from "@/utils/index";
import { trackingEvent } from "@/utils/ga";
import SlickSlider from "../../SlickSlider";
import ViewAllCta from "../ViewAllCta";

const LatestResultNewsSec = ({
  topNewsData,
  type = "",
  newsTitle = "Latest Results News",
  viewTxt = "",
  viewUrl = "",
}: any) => {
  const _viewTxt = viewTxt !== "" ? viewTxt : "View All News";
  const _viewUrl =
    viewUrl !== ""
      ? viewUrl
      : "https://economictimes.indiatimes.com/markets/stocks/earnings/news";
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
      <div
        className={`${styles.mainNewSec} ${type !== "" ? styles[type] : ""}`}
      >
        <div className={styles.topHead}>{newsTitle}</div>
        <SlickSlider
          slides={topNewsData?.map((list: any, index: any) => ({
            content: (
              <div key={`topNews${index}`} className={styles.newsCard}>
                <a
                  href={removeHostname(list?.url)}
                  className={styles.topNewsList}
                  target="_blank"
                  title={list?.title}
                  onClick={() =>
                    trackingEvent("et_push_event", {
                      event_category: "mercury_engagement",
                      event_action: "top_result_news_clicked",
                      event_label: `${index + 1} ${list?.title}`,
                    })
                  }
                >
                  <span
                    className={styles.topNewsTitle}
                    dangerouslySetInnerHTML={{
                      __html: list?.title,
                    }}
                  />
                  <img
                    width="75"
                    height="45"
                    src={replaceWidthHeight(list?.img, 75, 45)}
                    alt={`Top New Image`}
                    title={list?.title}
                  />
                  {list?.type == "videoshow" ? (
                    <span className={styles.videoIcon} />
                  ) : (
                    ""
                  )}
                </a>
              </div>
            ),
          }))}
          key={`earningsSlider}`}
          sliderId={`slider-earnings`}
          slidesToShow={5}
          slidesToScroll={1}
          rows={1}
          responsive={responsive}
          noPadding={true}
          topSpaceClass="earnings"
          //   screenWidth={screenWidth}
        />
        <ViewAllCta text={_viewTxt} url={_viewUrl} />
      </div>
    </>
  );
};

export default LatestResultNewsSec;
