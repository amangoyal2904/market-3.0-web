"use client";
import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../components/BigBullTableCard";
import BigBullTabs from "../../../components/BigBullTabs";
import tabsJson from "../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../DataJson/individualFilter.json";
import { fetchGetCommonAPI } from "../../../utils/bigbull";
import { commonPostAPIHandler } from "../../../utils/screeners";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/components/BreadCrumb";
import DfpAds from "@/components/Ad/DfpAds";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";

const individualFilter = indiFilter;
import { getBigbullTopTabData } from "@/utils/utility";

const BigBullAllInvertorsClientPage = ({
  tableData,
  tableHead,
  pagination,
  payload,
  pageUrl,
  tableThSortFilterID,
}: any) => {
  const __spanTxt = "";
  const router = useRouter();
  //console.log("___data", tableThSortFilterID, tableThSortFilterID);
  const [aciveFilter, setActiveFilter] = useState(payload.investorType);
  const [invstrQuery, setInvstrQuery] = useState("");
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const [sortData, setSortData] = useState({
    field: tableThSortFilterID,
    order: payload.orderBy,
  });
  const [_sortData, _setSortData] = useState({
    field: tableThSortFilterID,
    order: payload.orderBy,
  });
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const [_payload, setPayload] = useState(payload);
  const tabCatName = _payload.investorType.toLowerCase();
  let investorType = _payload.investorType.toLowerCase();
  investorType = investorType.charAt(0).toUpperCase() + investorType.slice(1);
  const __title = `${investorType} Investors`;
  const tabs = getBigbullTopTabData(tabCatName);
  const fitlerHandler = (value: any) => {
    const pushValue = value.toLowerCase();
    router.push(
      `/markets/top-india-investors-portfolio/${pushValue}/all-investors`,
    );
  };
  const invstrQueryHandler = (value: any) => {
    setInvstrQuery(value);
  };

  const tableAPICall = async () => {
    setTableLoadingShow(true);
    try {
      const _data = await commonPostAPIHandler(
        `BigBullGetInvestorList`,
        _payload,
      );
      const __tableData: any[] =
        _data?.datainfo?.investorlist?.investorData || [];
      const __pagination = _data?.datainfo?.investorlist?.pageSummaryInfo || {};
      setTableData(__tableData);
      setPagination(__pagination);
      setTableLoadingShow(false);
    } catch (error) {
      setTableLoadingShow(false);
    }

    //console.log({_data})
  };
  const sortHandler = (key: any, orderBy: string) => {
    let sortOrder = "DESC";
    if (sortData.field === key) {
      sortOrder = sortData.order === "ASC" ? "DESC" : "ASC";
      setSortData({
        ...sortData,
        order: sortOrder,
      });
    } else {
      setSortData({ field: key, order: sortOrder });
    }

    handleSortServerSide(sortOrder, orderBy);
  };
  const handleSortServerSide = async (field: any, _orderBy: string) => {
    setPayload({ ..._payload, sortBy: _orderBy, orderBy: field, pageNo: 1 });
  };
  //console.log(_payload)
  const searchAPIcallForInstr = async () => {
    // === filter calll for search api call
    const getData = await fetchGetCommonAPI({
      type: `BigBullGetSearchData`,
      searchParam: `?searchtext=${invstrQuery}&limit=10&investortype=${aciveFilter}`,
      ssoid: "",
    });
    //console.log("____data", getData);
  };
  const handlePageChangeHandler = (value: any) => {
    setPayload({ ..._payload, pageNo: value });
  };

  useEffect(() => {
    if (invstrQuery) {
      //searchAPIcallForInstr();
      setPayload({ ..._payload, searchText: invstrQuery, pageNo: 1 });
    } else {
    }
  }, [invstrQuery]);
  useEffect(() => {
    //console.log('___payload change ', _payload);
    tableAPICall();
  }, [_payload]);
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
        <BigBullTabs
          data={tabs}
          individualFilter={individualFilter}
          aciveFilter={aciveFilter}
          fitlerHandler={fitlerHandler}
        />
        <BigBullTableCard
          tableData={_tableData}
          tableHead={_tableHead}
          pagination={_pagination}
          searchInvestor={true}
          invstrQuery={invstrQuery}
          invstrQueryHandler={invstrQueryHandler}
          sortData={sortData}
          handleSort={sortHandler}
          handlePageChange={handlePageChangeHandler}
          shouldShowLoader={tableLoadingShow}
          title={__title}
          spanTxt={__spanTxt}
          paginationLastNode="Investors"
        />
      </div>
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "All Investors", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default BigBullAllInvertorsClientPage;
