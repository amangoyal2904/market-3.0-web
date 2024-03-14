import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV, getStockRecosDetail } from "@/utils";
import service from "@/network/service";
import { getSelectedFilter, getSearchParams } from "@/utils/utility";

export default async function stocksrecos({
  params,
  searchParams,
}: {
  params: {
    slug: string[];
  };
  searchParams: any;
}) {
  console.log("params.slug ----> ", params.slug);
  const intFilter = searchParams?.filter ? parseInt(searchParams.filter) : 0;
  const selectedFilter = await getSelectedFilter(intFilter);

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

  const recosDetailResult = await getStockRecosDetail({
    getApiType: getApiType(),
    slug,
    niftyFilterData: selectedFilter,
  });

  const navListData =
    getApiType() == "FHDetail"
      ? await getStockRecosDetail({
          getApiType: "recoByFH",
          slug,
          niftyFilterData: selectedFilter,
        })
      : recosDetailResult;

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
        <StockRecosListing
          showIndexFilter={true}
          selectedFilter={selectedFilter}
          recosNavResult={recosNavResult}
          recosDetailResult={recosDetailResult}
          navListData={navListData}
          activeApi={getApiType()}
          slug={slug}
        />
      </div>
    </>
  );
}
