import styles from "./InvestmentIdea.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "@/network/service";
import ViewAllLink from "../ViewAllLink";

const fetchInvestMentData = async () => {
  try {
    const response = await Service.get({
      url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=81409979`,
      params: {},
    });
    const data = await response?.json();
    const investmentData =
      (data &&
        data.searchResult &&
        data.searchResult[0] &&
        data.searchResult[0].data) ||
      [];
    return investmentData;
  } catch (e) {
    console.log("Error in fetching investment Data", e);
  }
};

const Card = ({ title, img, url, style }: any) => {
  return (
    <a href={url} className={`${styles.card} ${styles[style]}`} target="_blank">
      <img
        src={img}
        alt={title}
        className={styles.cardImage}
        loading="lazy"
        decoding="async"
      />
      <h2 className={styles.cardTitle}>{title}</h2>
    </a>
  );
};

const InvestmentIdea = async () => {
  const investmentData = await fetchInvestMentData();
  return investmentData && investmentData.length ? (
    <div className={styles.investMentWrapper}>
      <p className={styles.title}>
        Investment Ideas
        <span className={`eticon_caret_right ${styles.headingIcon}`} />
      </p>
      <div className={styles.investmentData}>
        <div className={styles.card1Container}>
          <Card key={0} {...investmentData[0]} style="first" />
        </div>
        <div className={styles.card2Container}>
          <div className={styles.card2InnerContainer}>
            {investmentData?.map((item: any, index: number) =>
              index > 0 && index < 4 ? (
                <Card key={index} {...item} style="second" />
              ) : (
                ""
              ),
            )}
          </div>
          <div className={styles.card3Container}>
            {investmentData?.map((item: any, index: number) =>
              index > 3 && index < 6 ? (
                <Card key={index} {...item} style="third" />
              ) : (
                ""
              ),
            )}
          </div>
        </div>
      </div>
      <ViewAllLink
        text="See All Investment ideas"
        link="https://economictimes.indiatimes.com/prime/investment-ideas"
      />
    </div>
  ) : (
    ""
  );
};
export default InvestmentIdea;
