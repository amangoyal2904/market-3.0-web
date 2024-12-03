import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import styles from "./TrendingInMarkets.module.scss";
import TrendingInMarketsList from "./list";

const getTrendingInMarkets = async () => {
  const response = await service.get({
    url: (APIS_CONFIG as any)["TRENDING_IN_MARKETS"][APP_ENV],
    params: {},
  });
  return await response?.json();
};

const TrendingInMarkets = async () => {
  const trendingList = await getTrendingInMarkets();
  if (!trendingList?.length) {
    return null;
  }

  return (
    <div className={styles.widget}>
      <h4 className={styles.headline}>Trending in markets:</h4>
      <div className={styles.list}>
        {trendingList.map((item: any, index: number) => (
          <TrendingInMarketsList item={item} key={`trending_${index}`} />
        ))}
      </div>
    </div>
  );
};

export default TrendingInMarkets;
