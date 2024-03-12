import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV, getStockRecosDetail } from "@/utils";
import service from "@/network/service";
import { getSelectedFilter } from "@/utils/utility";
import Subhead from "@/components/StockRecosListing/Subhead";
import InnerLeftNav from "@/components/StockRecosListing/InnerLeftNav";

export default async function stocksrecos({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  console.log("params.slug ----> ", params.slug);

  const { slug } = params || [];

  // =====  Get Left Nav Data =======
  const RECOS_NAV_Link = (APIS_CONFIG as any)["STOCK_RECOS_NAV"][APP_ENV];
  const recosNavPromise = await service.get({
    url: RECOS_NAV_Link,
    params: {},
  });

  const recosNavResult = await recosNavPromise?.json();

  const getApiType = () => {
    const activeObj = recosNavResult?.tabs.filter(
      (item: any) => item.seoPath == slug?.[0],
    );
    return slug.includes("fundhousedetails") && slug.length > 1
      ? "FHDetail"
      : slug.includes("fundhousedetails")
        ? "recoByFH"
        : activeObj[0]?.apiType;
  };

  const intFilter = 0;
  const selectedFilter = await getSelectedFilter(intFilter);

  const recosDetailResult = await getStockRecosDetail(getApiType(), slug);
  const fundHouseListResult =
    getApiType() == "FHDetail"
      ? await getStockRecosDetail("recoByFH", slug)
      : "";

  const navListData =
    getApiType() == "FHDetail" ? fundHouseListResult : recosDetailResult;

  return (
    <>
      <div className={styles.recosPageWrap}>
        <div className={styles.recosHeadWrap}>
          <h1 className={styles.hdg}>Stock Recommendations</h1>
          <p className={styles.desc}>
            Stocks with their SMA50 trading above their SMA200. Technical
            Screener whose SMA 50 recently crossed above their SMA 200. Commonly
            known as Golden Cross & important technical indicator for bullish
            stocks.
          </p>
        </div>
        <Subhead
          showIndexFilter={true}
          selectedFilter={selectedFilter}
          recosNavResult={recosNavResult}
          activeTab={slug?.[0]}
          slug={slug}
        />
        {getApiType() == "FHDetail" && (
          <div className={styles.brokerageWrap}>
            <div className={styles.totalRecosWrap}>
              <span className={styles.totalRecosTitle}>Total Recos</span>
              <span className={styles.totalRecosval}>
                {recosDetailResult.recoData?.[0].topSection.totalCount}
              </span>
            </div>
            <div className={styles.pipe}></div>
            <div className={styles.buyWrap}>
              <span className={styles.buyTitle}>Buy</span>
              <span className={styles.buyval}>
                {recosDetailResult.recoData?.[0].topSection.buyCount}
              </span>
            </div>
            <div className={styles.sellWrap}>
              <span className={styles.sellTitle}>Sell</span>
              <span className={styles.sellVal}>
                {recosDetailResult.recoData?.[0].topSection.sellCount}
              </span>
            </div>
            <div className={styles.holdWrap}>
              <span className={styles.holdTitle}>Hold</span>
              <span className={styles.holdVal}>
                {recosDetailResult.recoData?.[0].topSection.holdCount}
              </span>
            </div>
            <div className={styles.addWrap}>
              <span className={styles.addTitle}>Add</span>
              <span className={styles.addVal}>-</span>
            </div>
            <div className={styles.accumulateWrap}>
              <span className={styles.accumulateTitle}>Accumulate</span>
              <span className={styles.accumulateVal}>-</span>
            </div>
            <div className={styles.neutralWrap}>
              <span className={styles.neutralTitle}>Neutral</span>
              <span className={styles.neutralVal}>-</span>
            </div>
          </div>
        )}
        <div
          className={`${styles.contentWrap} ${slug?.[0] == "overview" ? styles.overviewWrap : ""}`}
        >
          {(getApiType() == "newRecos" ||
            slug.includes("fundhousedetails")) && (
            <InnerLeftNav
              recosNavResult={recosNavResult}
              recosDetailResult={navListData}
              activeApi={getApiType()}
              slug={slug}
            />
          )}
          <StockRecosListing
            showIndexFilter={true}
            recosDetailResult={recosDetailResult}
            activeApi={getApiType()}
            slug={slug}
          />
        </div>
      </div>
    </>
  );
}
