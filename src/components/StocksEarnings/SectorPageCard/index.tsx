import styles from "./styles.module.scss";
import { useState, useEffect, useCallback, useRef } from "react";
import SectorCard from "../SectorCard";
import { commonPostAPIHandler } from "../../../utils/screeners";
import PaginationEarning from "../../BigBullTableCard/PaginationEarning";
import Loader from "@/components/Loader";
import Link from "next/link";

const leftSideTabData = [
  {
    title: "Top Performing",
    id: 0,
    link: "/markets/stocks/earnings/sector-aggregate/top-performing",
  },
  {
    title: "Under Performing",
    id: 1,
    link: "/markets/stocks/earnings/sector-aggregate/under-performing",
  },
];

const SectorPageCard = ({ data, tpName = "", sortingValue = "" }: any) => {
  const _tabData = data?.sectorData;
  const _allPayload = data?.payload;
  const [_loading, setLoading] = useState(false);
  // State initialization
  const [activeTab, setActiveTab] = useState(
    tpName === "under-performing" ? 1 : 0,
  );
  const [tabContentData, setTabContentData] = useState<any[]>(
    _tabData?.topSector?.sectorAggregateData || [],
  );
  const [_pageTopSector, setPageTopSector] = useState(
    _tabData?.topSector?.pageSummary || {},
  );
  const [_pageUnderSector, setPageUnderSector] = useState(
    _tabData?.underSector?.pageSummary || {},
  );
  const [_payloadTopSector, setPayloadTopSector] = useState({
    ..._allPayload?.topSector,
    pageNo: 1,
  });
  const [_payloadUnderSector, setPayloadUnderSector] = useState({
    ..._allPayload?.underSector,
    pageNo: 1,
  });

  // Handle tab change
  // const tabChangeHandler = (value: number) => {
  //   setActiveTab(value);
  //   if (value === 0) {
  //     const newPayload = { ..._payloadTopSector, pageNo: 1 };
  //     setPayloadTopSector(newPayload);
  //   } else {
  //     const newPayload = { ..._payloadUnderSector, pageNo: 1 };
  //     setPayloadUnderSector(newPayload);
  //   }
  // };

  // pagination hander
  const handlePageChange = (value: any) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    console.log("my page", value);
    if (activeTab === 0) {
      const newPayload = { ..._payloadTopSector, pageNo: value };
      setPayloadTopSector(newPayload);
    } else if (activeTab === 1) {
      const newPayload = { ..._payloadUnderSector, pageNo: value };
      setPayloadUnderSector(newPayload);
    }
  };

  const loadMoreData = async () => {
    setLoading(true);
    const bodyPayload =
      activeTab === 0
        ? _payloadTopSector
        : activeTab === 1
          ? _payloadUnderSector
          : null;
    const _topSector = await commonPostAPIHandler(
      `SECTOR_AGGREGATE`,
      bodyPayload,
    );

    if (_topSector && _topSector?.sectorAggregateData) {
      console.log("_topSector", _topSector);
      activeTab === 0
        ? setPageTopSector(_topSector?.pageSummary)
        : activeTab === 1
          ? setPageUnderSector(_topSector?.pageSummary)
          : "";

      setTabContentData(_topSector?.sectorAggregateData);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadMoreData();
  }, [_payloadTopSector, _payloadUnderSector]);
  useEffect(() => {
    //console.log(_payloadTopSector, sortingValue)
    if (
      sortingValue !== "" &&
      _payloadTopSector?.sort &&
      _payloadTopSector?.sort[0]?.field !== sortingValue &&
      tpName === "top-performing"
    ) {
      const newPayLoad = { ..._payloadTopSector, pageNo: 1 };
      newPayLoad.sort = [{ field: sortingValue, order: "DESC" }];
      setPayloadTopSector(newPayLoad);
    }

    if (
      sortingValue !== "" &&
      _payloadUnderSector?.sort &&
      _payloadUnderSector?.sort[0]?.field !== sortingValue &&
      tpName === "under-performing"
    ) {
      const newPayLoad = { ..._payloadUnderSector, pageNo: 1 };
      newPayLoad.sort = [{ field: sortingValue, order: "DESC" }];
      setPayloadUnderSector(newPayLoad);
    }
  }, [sortingValue]);
  return (
    <div className={styles.cardSec}>
      <div className={styles.left}>
        <ul className={styles.leftNavList}>
          {leftSideTabData.map((item, index) => (
            <li
              className={index === activeTab ? styles.active : ""}
              key={item.id}
            >
              <Link href={`${item.link}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.right}>
        {!_loading ? (
          <>
            <div className={styles.cardSecWrap}>
              {tabContentData.map((item, index) => (
                <SectorCard key={index} item={item} className="sectionCard" />
              ))}
            </div>
            {activeTab === 0 && _pageTopSector.totalpages > 1 ? (
              <PaginationEarning
                pageSummary={_pageTopSector}
                onPageChange={handlePageChange}
                paginationLastNode={`Top Performing`}
              />
            ) : activeTab === 1 && _pageUnderSector.totalpages > 1 ? (
              <PaginationEarning
                pageSummary={_pageUnderSector}
                onPageChange={handlePageChange}
                paginationLastNode={`Under Performing`}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          <Loader loaderType="container" />
        )}
      </div>
    </div>
  );
};

export default SectorPageCard;
