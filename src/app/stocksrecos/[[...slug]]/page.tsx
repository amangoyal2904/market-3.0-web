import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import { getSelectedFilter } from "@/utils/utility";
import StockRecosOverview from "@/components/StockRecosOverview";

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

  // console.log("recosNavResult--", recosNavResult);

  // =====  Get Left Nav Data =======
  const STOCK_RECOS_DETAIL_Link = (APIS_CONFIG as any)["STOCK_RECOS_DETAIL"][
    APP_ENV
  ];
  const headers = {
    "Content-Type": "application/json",
  };
  const payload = {
    apiType: slug?.[0] || "overview",
    filterType: "",
    filterValue: [],
    recoType: slug?.[1] || "all",
    pageSize: 30,
    pageNumber: 1,
  };
  const recosDetailPromise = await service.post({
    url: STOCK_RECOS_DETAIL_Link,
    headers: headers,
    body: JSON.stringify(payload),
    params: {},
  });

  const recosDetailResult = await recosDetailPromise?.json();

  console.log("recosNavResult --->", recosDetailResult.recoData);
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
        {/* <StockRecosListing
          recosNavResult={recosNavResult}
          recosDetailResult={recosDetailResult}
          selectedFilter={selectedFilter}
        /> */}
        <StockRecosOverview
          recosNavResult={recosNavResult}
          recosDetailResult={recosDetailResult}
          selectedFilter={selectedFilter}
        />
      </div>
    </>
  );
}
