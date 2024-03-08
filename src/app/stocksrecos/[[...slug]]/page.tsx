import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import { getSelectedFilter } from "@/utils/utility";
import Subhead from "@/components/StockRecosListing/Subhead";

export default async function stocksrecos({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  console.log("params.slug", params.slug);

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

  //console.log("recosNavResult--", recosNavResult);

  // =====  Get STOCK_RECOS_DETAIL Data =======
  const getStockRecosDetail = async () => {
    const STOCK_RECOS_DETAIL_Link = (APIS_CONFIG as any)["STOCK_RECOS_DETAIL"][
      APP_ENV
    ];
    const headers = {
      "Content-Type": "application/json",
    };
    const payload = {
      apiType: getApiType(),
      filterType: "",
      filterValue: [],
      recoType: slug?.[1] || "all",
      pageSize: 30,
      pageNumber: 1,
    };

    console.log("payload----", payload);

    const recosDetailPromise = await service.post({
      url: STOCK_RECOS_DETAIL_Link,
      headers: headers,
      body: JSON.stringify(payload),
      params: {},
    });

    const recosDetailResult = await recosDetailPromise?.json();

    // console.log("recosDetailResult----", JSON.stringify(recosDetailResult));

    return recosDetailResult;
  };

  //console.log("recosNavResult--", recosDetailResult);
  const intFilter = 0;
  const selectedFilter = await getSelectedFilter(intFilter);
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
        <StockRecosListing
          recosNavResult={recosNavResult}
          recosDetailResult={await getStockRecosDetail()}
          selectedFilter={selectedFilter}
          activeApi={getApiType()}
          slug={slug}
        />
      </div>
    </>
  );
}
