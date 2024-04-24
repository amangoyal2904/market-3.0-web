import StockRecosListing from "@/components/StockRecosListing";
import styles from "./styles.module.scss";
import APIS_CONFIG from "../../../network/api_config.json";
import {
  APP_ENV,
  getFundHouseInfo,
  getStockRecosDetail,
  capitalize,
} from "@/utils";
import service from "@/network/service";
import {
  fetchSelectedFilter,
  fnGenerateMetaData,
  getSearchParams,
} from "@/utils/utility";
import Disclaimer from "@/components/StockRecosListing/Disclaimer";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import BreadCrumb from "@/components/BreadCrumb";

const StockRecosMeta = (activeApi: any, niftyFilterData: any, slug: any) => {
  try {
    const fundHouseInfo = getFundHouseInfo("", slug);
    switch (activeApi) {
      case "overview":
        return {
          title: `Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } `,
          desc: `Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          }: Checkout stock recommendations and advices to find best Stock Recommendations stocks on The Economic Times`,
          keywords: `Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          }, Stock Recommendations, Stock Analysis, Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } stocks`,
          pageTitle: (
            <h1 className={styles.hdg}>
              Stock Recommendations{" "}
              {niftyFilterData.name != "All Stocks"
                ? " in " + niftyFilterData.name
                : ""}
            </h1>
          ),
        };
      case "newRecos":
        return {
          title: `New ${slug?.[1] != "all" ? slug?.[1] : ""} Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } `,
          desc: `New ${slug?.[1] != "all" ? slug?.[1] : ""} Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          }: Checkout stock recommendations and advices to find best New ${slug?.[1] != "all" ? slug?.[1] : ""} Recommendations stocks on The Economic Times `,
          keywords: `New ${slug?.[1] != "all" ? slug?.[1] : ""} Recommendations, Stock Recommendations, Stock Analysis, New ${slug?.[1] != "all" ? slug?.[1] : ""} Recommendations Stocks`,
          pageTitle: (
            <h1 className={styles.hdg}>
              New {slug?.[1] != "all" ? slug?.[1] : ""} Recos{" "}
              {niftyFilterData.name != "All Stocks"
                ? " in " + niftyFilterData.name
                : ""}
            </h1>
          ),
        };
      case "mostBuy":
        return {
          title: `High Upside Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } `,
          desc: `High Upside Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          }: Checkout stock recommendations and advices to find best High Upside stocks on The Economic Times `,
          keywords: `High Upside, Stock Recommendations, Stock Analysis, High Upside Stocks`,
          pageTitle: (
            <h1 className={styles.hdg}>
              High Upside Stock Recos{" "}
              {niftyFilterData.name != "All Stocks"
                ? " in " + niftyFilterData.name
                : ""}
            </h1>
          ),
        };
      case "mostSell":
        return {
          title: `High Downside Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } `,
          desc: `High Downside Stock Recommendations ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          }: Checkout stock recommendations and advices to find best High Downside stocks on The Economic Times `,
          keywords: `High Downside, Stock Recommendations, Stock Analysis, High Downside Stocks`,
          pageTitle: (
            <h1 className={styles.hdg}>
              High Downside Stock Recos{" "}
              {niftyFilterData.name != "All Stocks"
                ? " in " + niftyFilterData.name
                : ""}
            </h1>
          ),
        };
      case "recoOnWatchlist":
        return {
          title: `Stock Recommendations on Your Watchlist `,
          desc: `Stock Recommendations on Your Watchlist:  Checkout stock recommendations and advices to find best stocks on The Economic Times`,
          keywords: `Stock Recommendations on Your Watchlist, Stock Recommendations, Stock Analysis`,
          pageTitle: <h1 className={styles.hdg}>Recos on Your Watchlist</h1>,
        };
      case "recoByFH":
        return {
          title: `Stock Recommendations by Brokerages `,
          desc: `Stock recommendations by Brokerages: Checkout stock recommendations and advices to find best stocks on The Economic Times`,
          keywords: `Stock Recommendations, Stock Analysis`,
          pageTitle: <h1 className={styles.hdg}>Recos by Brokerages</h1>,
        };
      case "FHDetail":
        return {
          title: `Brokerages | ${fundHouseInfo.fundHounseName} ${slug?.[2]} ${
            niftyFilterData.name != "All Stocks"
              ? " in " + niftyFilterData.name
              : ""
          } `,
          desc: `${capitalize(fundHouseInfo.fundHounseName)} ${slug?.[2]} Stock Recommendations: Checkout stock recommendations and advices to find best ${slug?.[2]} stocks from ${fundHouseInfo.fundHounseName} on The Economic Times`,
          keywords: `${fundHouseInfo.fundHounseName}, ${fundHouseInfo.fundHounseName} ${slug?.[2]}, Stock Recommendations, Stock Analysis
          ${slug?.[2]} Stocks,  ${fundHouseInfo.fundHounseName} Stocks, ${fundHouseInfo.fundHounseName} ${slug?.[2]} Stocks`,
          pageTitle: (
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
          ),
        };
      default:
        return {
          title: `Stock Recommendations `,
          desc: `Checkout stock recommendations and advices to find best Stock Recommendations stocks on The Economic Times`,
          keywords: `Stock Recommendations, Stock Analysis`,
          pageTitle: <h1 className={styles.hdg}>Stock Recommendations</h1>,
        };
    }
  } catch (err) {
    console.log("StockRecosMeta Error:", err);
    return {
      title: `Stock Recommendations `,
      desc: `Checkout stock recommendations and advices to find best Stock Recommendations stocks on The Economic Times`,
      keywords: `Stock Recommendations, Stock Analysis`,
      pageTitle: <h1 className={styles.hdg}>Stock Recommendations</h1>,
    };
  }
};

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: {
      slug: string[];
    };
    searchParams: any;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const intFilter = searchParams?.filter ? parseInt(searchParams.filter) : 0;
  const niftyFilterData = await fetchSelectedFilter(intFilter);
  const pageUrl = headersList.get("x-url") || "";

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

  const metaDetail = StockRecosMeta(getApiType(), niftyFilterData, slug);
  const meta = {
    title: metaDetail.title,
    desc: metaDetail.desc,
    keywords: metaDetail.keywords,
    pathname: pageUrl,
    index: niftyFilterData.indexId == 0 ? false : true,
  };
  return fnGenerateMetaData(meta);
}

export default async function stocksrecos({
  params,
  searchParams,
}: {
  params: {
    slug: string[];
  };
  searchParams: any;
}) {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const ssoidCookie = cookieStore.get("ssoid");

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

  console.log("recosNavResult---", recosNavResult);

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
    ssoid: ssoidCookie,
  });

  console.log("recosDetailResult---", recosDetailResult);

  const navListData =
    getApiType() == "FHDetail"
      ? await getStockRecosDetail({
          getApiType: "recoByFH",
          slug,
          niftyFilterData: selectedFilter,
        })
      : recosDetailResult;

  if (getApiType() == "FHDetail") {
    const topSection = recosDetailResult?.recoData?.[0].topSection;
    const fundHouseStr = `${topSection?.seoName}-${topSection?.omId}`;

    if (fundHouseStr.indexOf("undefined") != -1) {
      redirect("/not-found");
    } else if (header_url.indexOf(fundHouseStr) == -1) {
      const newPath = header_url.replace(slug[1], fundHouseStr);
      redirect(newPath);
    }
  }

  return (
    <>
      <div className={styles.recosPageWrap}>
        <div className={styles.recosHeadWrap}>
          {StockRecosMeta(getApiType(), selectedFilter, slug).pageTitle}
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
