"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import BigBullSection from "../../../components/BigBullSection";
import BigBullTabs from "../../../components/BigBullTabs";
//import tabsJson from "../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../DataJson/individualFilter.json";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { getBigbullTopTabData } from "@/utils/utility";
import BreadCrumb from "@/components/BreadCrumb";
import DfpAds from "@/components/Ad/DfpAds";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";

const individualFilter = indiFilter;
// .investorType
const BigBullClientPage = ({ data, payload, pageUrl }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [__data, setData] = useState(data);
  const [_payload, setPayload]: any = useState({ ...payload });
  const router = useRouter();
  const fitlerHandler = (value: any) => {
    const pushValue = value.toLowerCase();
    router.push(`/markets/top-india-investors-portfolio/${pushValue}`);
  };
  const tabCatName = _payload.investorType.toLowerCase();
  let investorType = _payload.investorType.toLowerCase();
  investorType = investorType.charAt(0).toUpperCase() + investorType.slice(1);
  const tabs = getBigbullTopTabData(tabCatName);
  return (
    <>
      <div className={`${styles.wraper} ${styles.mbfbrdc}`}>
        <div className={styles.topSec}>
          <h1 className={`heading ${styles.head}`}>
            <span className={styles.etprimeLogo}>ETPrime</span>
            <span className={styles.bigLogo}>Big</span>
            <span className={styles.bullTxt}>Bull Portfolio</span>
          </h1>
          <p className={styles.desc}>
            Get to know where the market gurus invest to grow your portfolio.
          </p>
        </div>
        <div className={`prel ${styles.container}`}>
          <BigBullTabs
            data={tabs}
            individualFilter={individualFilter}
            aciveFilter={_payload.investorType}
            fitlerHandler={fitlerHandler}
          />
          {__data?.pageData?.investorlist?.investorData &&
            __data?.pageData?.investorlist?.investorData.length > 0 && (
              <BigBullSection
                data={__data?.pageData?.investorlist?.investorData}
                cartLink={`/markets/top-india-investors-portfolio/${tabCatName}/all-investors`}
                title={`${investorType} Investors`}
                type="card1"
                cartTitle={`View All ${__data?.pageData?.investorlist?.pageSummaryInfo?.totalRecords} Investors`}
              />
            )}

          {__data?.pageData?.investorKeyChanges?.investorKeyChangesData &&
            __data?.pageData?.investorKeyChanges?.investorKeyChangesData
              .length > 0 && (
              <BigBullSection
                title="Changes in Holdings from Last Quarter "
                type="card2"
                data={
                  __data?.pageData?.investorKeyChanges?.investorKeyChangesData
                }
                cartLink={`/markets/top-india-investors-portfolio/${tabCatName}/qtr-changes`}
                cartTitle="View All Holdings Changes"
              />
            )}

          {__data?.pageData?.recentDealsInfo?.listRecentDeals &&
            __data?.pageData?.recentDealsInfo?.listRecentDeals.length > 0 && (
              <BigBullSection
                title="Recent Transactions "
                type="card2"
                data={__data?.pageData?.recentDealsInfo?.listRecentDeals}
                cartLink={`/markets/top-india-investors-portfolio/${tabCatName}/recent-transactions`}
                cartTitle="View All Recent Transactions"
              />
            )}

          {__data?.pageData?.bestPicksDataInfo?.bestPicksListInfo &&
            __data?.pageData?.bestPicksDataInfo?.bestPicksListInfo.length >
              0 && (
              <BigBullSection
                title="Best Stock Picks "
                type="card2"
                data={__data?.pageData?.bestPicksDataInfo?.bestPicksListInfo}
                cartLink={`/markets/top-india-investors-portfolio/${tabCatName}/best-picks`}
                cartTitle={`View All ${__data?.pageData?.bestPicksDataInfo?.pageSummaryInfo?.totalRecords} Best Stock Picks`}
              />
            )}

          {__data?.pageData?.mostHoldCompanyInfo?.mostHoldStockData &&
            __data?.pageData?.mostHoldCompanyInfo?.mostHoldStockData.length >
              0 && (
              <BigBullSection
                title="Most Held Stocks "
                type="card3"
                data={__data?.pageData?.mostHoldCompanyInfo?.mostHoldStockData}
                cartLink={`/markets/top-india-investors-portfolio/most-held`}
                cartTitle={`View All ${__data?.pageData?.mostHoldCompanyInfo?.pageSummaryInfo?.totalRecords} Most Helds Stocks`}
              />
            )}

          {loading && <Loader loaderType="container" />}
        </div>
      </div>
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Overview", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default BigBullClientPage;
