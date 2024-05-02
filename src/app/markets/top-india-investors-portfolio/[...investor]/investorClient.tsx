"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./style.module.scss";
import HeroBanner from "@/components/InvestorModule/HeroBanner";
import InvestorsTopTabs from "@/components/BigBullTabs/InvestorsTopTabs";
import FreshEntryCard from "@/components/BigBullSection/InvestorCatModules/FreshEntryCard";
import InvestorTopOverviewHolding from "@/components/BigBullTableCard/BiggBullTable/InvestorTopOverviewHolding";
import BreadCrumb from "@/components/BreadCrumb";

const InvestorClientPage = ({
  data,
  topHoldingData,
  otherViewData,
  pageUrl,
}: any) => {
  const sharkSeoName =
    data?.datainfo?.investorOverviewInfo?.investorIntro?.sharkSeoName;
  const sharkName = data?.datainfo?.investorOverviewInfo?.investorIntro?.name;
  const sharkID = data?.datainfo?.investorOverviewInfo?.investorIntro?.sharkID;

  const [freshEntry, setFreshEntry]: any = useState(
    otherViewData?.entryExitDataInfo?.entryExitData?.stockEntryExitData || [],
  );
  const [freshEntryTitle, setFreshEntryTitle] = useState(
    otherViewData?.entryExitDataInfo?.entryExitData?.title || "",
  );

  const [changeHoldingData, setChangeHoldingData] = useState(
    otherViewData?.stockIncreaseDecreaseDataInfo
      ?.stockIncreaseDecreaseListData || [],
  );
  const [changeHoldingDataTitle, setChangeHoldingDataTitle] = useState(
    otherViewData?.stockIncreaseDecreaseDataInfo?.title || "",
  );

  const [bestStockPicks, setBestStockPicks] = useState(
    otherViewData?.investorBestPicksDataInfo?.stockBestPickData || [],
  );
  const [bestStockPicksTitle, setBestStockPicksTitle] = useState(
    otherViewData?.investorBestPicksDataInfo?.title || "",
  );

  const [bulkBlockData, setBulkBlockData] = useState(
    otherViewData?.bulkblockDealsInfo?.stockHoldingList || [],
  );

  const tabsData = [
    {
      title: "Overview",
      id: "overview",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}`,
    },
    {
      title: "Fresh Entry & Exit",
      id: "fresh-entry-exit",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/fresh-entry-exit`,
    },
    {
      title: "Holdings",
      id: "holdings",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/holdings`,
    },
    {
      title: "Change in Holdings",
      id: "change-in-holdings",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/change-in-holdings`,
    },
    {
      title: "Bulk/Block Deals",
      id: "bulk-block-deals",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/bulk-block-deals`,
    },
  ];
  console.log("_____otherViewData", otherViewData);
  return (
    <>
      <HeroBanner data={data} />
      <InvestorsTopTabs data={tabsData} activeTab="" />

      {freshEntry && freshEntry.length > 0 && (
        <div className={`${styles.sectionWrap} ${styles.mainContentWraper}`}>
          <h3 className={styles.head3}>{freshEntryTitle}</h3>
          <FreshEntryCard cardData={freshEntry} />
        </div>
      )}

      {changeHoldingData && changeHoldingData.length > 0 && (
        <div className={`${styles.sectionWrap} ${styles.mainContentWraper}`}>
          <h3 className={styles.head3}>
            {changeHoldingDataTitle} from Last Quaters
          </h3>
          <FreshEntryCard cardData={changeHoldingData} />
        </div>
      )}

      {topHoldingData.arrayOfCompany &&
        topHoldingData.arrayOfCompany.length > 0 && (
          <div
            className={`${styles.overviewTopHoldingSec} ${styles.sectionWrap}`}
          >
            <h3 className={styles.head3}>Top Holdings of {sharkName}</h3>
            <InvestorTopOverviewHolding
              tableHead={topHoldingData.tableHead}
              tableData={topHoldingData.arrayOfCompany}
              sortData=""
              handleSort={() => console.log("click to sort function")}
              shouldShowLoader={false}
            />
            <div className={styles.viewHoldingLinkSec}>
              <Link
                href={`/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/holdings`}
              >
                <span>View all Top Holdings</span>
              </Link>
            </div>
          </div>
        )}

      {bestStockPicks && bestStockPicks.length > 0 && (
        <div className={`${styles.sectionWrap} ${styles.mainContentWraper}`}>
          <h3 className={styles.head3}>
            {bestStockPicksTitle} of {sharkName}{" "}
          </h3>
          <FreshEntryCard cardData={bestStockPicks} />
        </div>
      )}

      {bulkBlockData && bulkBlockData.length > 0 && (
        <div className={`${styles.sectionWrap} ${styles.mainContentWraper}`}>
          <h3 className={styles.head3}>
            Bulk/Block Deals made by {sharkName}{" "}
          </h3>
          <FreshEntryCard cardData={bulkBlockData} />
        </div>
      )}

      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Overview", redirectUrl: "" }]}
      />
    </>
  );
};

export default InvestorClientPage;
