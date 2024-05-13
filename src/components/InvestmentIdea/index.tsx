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

const Card = ({ data }: any) => {
  return (
    <a href={data?.url} className={`${styles.card}`} target="_blank">
      <img
        src={data?.img}
        alt={data?.title}
        className={styles.cardImage}
        loading="lazy"
        decoding="async"
      />
      <h2 className={styles.cardTitle}>{data?.title}</h2>
    </a>
  );
};

const InvestmentIdea = async () => {
  const investmentData = await fetchInvestMentData();
  return investmentData && investmentData.length ? (
    <div className="sectionWrapper">
      <h2 className={styles.title}>
        <a
          title="Investment Ideas"
          href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}prime/investment-ideas`}
        >
          Investment Ideas
        </a>
        <span className={`eticon_caret_right ${styles.headingIcon}`} />
      </h2>
      <div className={styles.investmentData}>
        {investmentData?.map((data: any, index: any) =>
          index < 4 ? (
            <Card key={`investment${index}`} data={data} index={index} />
          ) : (
            ""
          ),
        )}
      </div>
      <ViewAllLink
        text="See All Investment Ideas"
        link={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}prime/investment-ideas`}
      />
    </div>
  ) : (
    ""
  );
};
export default InvestmentIdea;
