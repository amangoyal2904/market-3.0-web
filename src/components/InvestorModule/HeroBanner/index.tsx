import styles from "./styles.module.scss";
import Link from "next/link";
import LeftSecModule from "./LeftSec";
import RightSecModule from "./RightSec";
import { useState } from "react";

const HeroBanner = ({ data }: any) => {
  const investorInfoData = data?.datainfo?.investorOverviewInfo?.investorIntro;
  const investorInfoStockGroupdata =
    data?.datainfo?.investorOverviewInfo?.stockGroupdata;

  const _title =
    data?.datainfo?.investorOverviewInfo?.holdingsOverviewData?.topHoldingsData
      ?.title || "";
  const _stocksArrayList =
    data?.datainfo?.investorOverviewInfo?.holdingsOverviewData?.topHoldingsData
      ?.topHoldingsList || [];

  const _title2 =
    data?.datainfo?.investorOverviewInfo?.holdingsOverviewData
      ?.sectorHoldingData?.title || "";
  const _stocksArrayList2 =
    data?.datainfo?.investorOverviewInfo?.holdingsOverviewData
      ?.sectorHoldingData?.sectordata || [];

  const [title, setTitle] = useState(_title);
  const [stocksArrayList, setStocksArrayList] = useState(_stocksArrayList);
  const [valueSuffix, setValueSuffix] = useState(" cr");
  const [activeTab, setActiveTab] = useState("stocks");
  const tabHandler = (tabVal: any) => {
    setActiveTab(tabVal);
    if (tabVal === "stocks") {
      setTitle(_title);
      setStocksArrayList(_stocksArrayList);
      setValueSuffix(" cr");
    } else {
      setTitle(_title2);
      setStocksArrayList(_stocksArrayList2);
      setValueSuffix(" %");
    }
  };

  return (
    <>
      <div className={styles.topSec}>
        <Link href={`/markets/top-india-investors-portfolio/individual`}>
          <span>back</span>
        </Link>
      </div>
      <div className={styles.heroWraper}>
        <div className={styles.left}>
          <LeftSecModule
            investorIntro={investorInfoData}
            investorStockData={investorInfoStockGroupdata}
          />
        </div>
        <div className={styles.right}>
          <RightSecModule
            title={title}
            stocksList={stocksArrayList}
            activeTab={activeTab}
            tabHandler={tabHandler}
            valueSuffix={valueSuffix}
          />
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
