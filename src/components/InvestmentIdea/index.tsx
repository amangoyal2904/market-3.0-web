import styles from "./InvestmentIdea.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import ViewAllLink from "../ViewAllLink";
import Card from "./Card";
import HeadingHome from "../ViewAllLink/HeadingHome";

const InvestmentIdea = ({ investmentData }: any) => {
  if (!investmentData || investmentData.length === 0) return null;
  return (
    <div className="sectionWrapper">
      <HeadingHome
        title="Investment Ideas"
        url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/prime/investment-ideas`}
      />
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
        text="Check Latest Investment Ideas"
        link={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/prime/investment-ideas`}
      />
    </div>
  );
};
export default InvestmentIdea;
