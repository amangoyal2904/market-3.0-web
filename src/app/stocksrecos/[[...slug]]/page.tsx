import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV, getFundHouseInfo, getStockRecosDetail } from "@/utils";
import service from "@/network/service";
import { fetchSelectedFilter, getSearchParams } from "@/utils/utility";
import Disclaimer from "@/components/StockRecosListing/Disclaimer";

export default async function stocksrecos({
  params,
  searchParams,
}: {
  params: {
    slug: string[];
  };
  searchParams: any;
}) {
  // console.log("params.slug ----> ", params.slug);
  const intFilter = searchParams?.filter ? parseInt(searchParams.filter) : 0;
  const selectedFilter = await fetchSelectedFilter(intFilter);

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

  // console.log("StockRecosHeadTitle(getApiType, selectedFilter, slug)", StockRecosHeadTitle(getApiType(), selectedFilter, slug))

  const StockRecosHeadTitle = (
    activeApi: any,
    niftyFilterData: any,
    slug: any,
  ) => {
    // console.log("StockRecosHeadTitle----", activeApi, niftyFilterData, slug);
    const fundHouseInfo = getFundHouseInfo("", slug);
    switch (activeApi) {
      case "overview":
        return (
          <h1 className={styles.hdg}>
            Stock Recommendations{" "}
            {niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""}
          </h1>
        );
      case "newRecos":
        return (
          <h1 className={styles.hdg}>
            New Recos{" "}
            {niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""}
          </h1>
        );
      case "mostBuy":
        return (
          <h1 className={styles.hdg}>
            Most Buys Stock Recos{" "}
            {niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""}
          </h1>
        );
      case "mostSell":
        return (
          <h1 className={styles.hdg}>
            Most Sells Stock Recos{" "}
            {niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""}
          </h1>
        );
      case "recoOnWatchlist":
        return <h1 className={styles.hdg}>Recos on Your Watchlist</h1>;
      case "recoByFH":
        return <h1 className={styles.hdg}>Recos by Brokerages</h1>;
      case "FHDetail":
        return (
          <h1 className={`${styles.hdg} ${styles.FHDetailHead}`}>
            <span>Brokerages</span>
            <span className={styles.pipe}> | </span>
            <span>
              {fundHouseInfo.fundHounseName} {slug?.[2]}{" "}
              {niftyFilterData.name != "All Stocks"
                ? " in " + niftyFilterData.name
                : ""}
            </span>
          </h1>
        );
      default:
        return <h1 className={styles.hdg}>Stock Recommendations</h1>;
    }
  };

  return (
    <>
      <div className={styles.recosPageWrap}>
        <div className={styles.recosHeadWrap}>
          {StockRecosHeadTitle(getApiType(), selectedFilter, slug)}
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
      <Disclaimer />
    </>
  );
}
