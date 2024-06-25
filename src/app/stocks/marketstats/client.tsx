"use client";
import dynamic from "next/dynamic";
import MarketStatsNav from "@/components/MarketStatsNav";
import MarketTable from "@/components/MarketTable";
import LeftMenuTabs from "@/components/MarketTabs/MenuTabs";
import MarketFiltersTab from "@/components/MarketTabs/MarketFiltersTab";
import styles from "./Marketstats.module.scss";
import { useCallback, useEffect, useState } from "react";
import { areObjectsNotEqual, getCookie } from "@/utils";
import {
  fetchSelectedFilter,
  removePersonalizeViewById,
} from "@/utils/utility";
import ToasterPopup from "@/components/ToasterPopup";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useStateContext } from "@/store/StateContext";
import { fetchViewTable, updateOrAddParamToPath } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import { getCustomViewsTab } from "@/utils/customViewAndTables";
import TechincalOperands from "@/components/TechincalOperands";

import MarketStatus from "@/components/MarketStatus";
import useIntervalApiCall from "@/utils/useIntervalApiCall";
const MessagePopupShow = dynamic(
  () => import("@/components/MessagePopupShow"),
  { ssr: false },
);

const MarketStats = ({
  l3Nav = [],
  metaData = {},
  tabData = [],
  activeViewId = null,
  unixDateTime = new Date(),
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  selectedFilter = {},
  isTechnical = false,
  technicalCategory,
  tableConfig = {},
  tabConfig = {},
  payload = {},
  l3NavMenuItem = null,
  l3NavSubItem = null,
  actualUrl = null,
  shortUrlMapping = [],
  intradayDurationOptions = [],
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state } = useStateContext();
  const { isPrime, ssoid } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [resetSort, setResetSort] = useState("");
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);
  const [_payload, setPayload] = useState(payload);
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_technicalCategory, setTechnicalCategory] =
    useState(technicalCategory);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
    useState(false);
  const [toasterConfirmData, setToasterConfirmData] = useState({});
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [modalBodyText, setModalBodyText] = useState({
    title: "You have Successfully created your personalise view",
  });

  const getSelectedDuration = () => {
    if (intradayDurationOptions.length) {
      let label =
        l3NavSubItem == "hourly-gainers" || l3NavSubItem == "hourly-losers"
          ? intradayDurationOptions[intradayDurationOptions.length - 1]?.label
          : intradayDurationOptions[0]?.label;
      let value = payload?.duration || payload?.timespan;
      const isExist = intradayDurationOptions.find(
        (option: any) => option.value === value,
      );
      if (!!isExist) {
        label = isExist?.label;
      } else {
        value =
          l3NavSubItem == "hourly-gainers" || l3NavSubItem == "hourly-losers"
            ? intradayDurationOptions[intradayDurationOptions.length - 1]?.value
            : intradayDurationOptions[0]?.value;
      }
      return { value, label };
    }
    return { value: "", label: "" };
  };
  const [dayFilterData, setDayFilterData] = useState(getSelectedDuration);

  const updateTableData = async () => {
    const isPrimeUser = getCookie("isprimeuser") === "true";
    const ssoid = getCookie("ssoid");
    const fetchType = isTechnical
      ? "MARKETSTATS_TECHNICALS"
      : "MARKETSTATS_INTRADAY";

    try {
      const responseData: any = await fetchViewTable(
        _payload,
        fetchType,
        isPrimeUser,
        ssoid,
      );

      if (responseData) {
        const {
          dataList = [],
          pageSummary = {},
          unixDateTime = new Date().getTime(),
        } = responseData;

        const newTableData = dataList;
        const newTableHeaderData =
          newTableData.length > 0 && newTableData[0]?.data
            ? newTableData[0].data
            : [];

        setUpdateDateTime(unixDateTime);
        setTableData(newTableData);
        setTableHeaderData(newTableHeaderData);
        setPageSummary(pageSummary);

        if (tableData.length === 0) {
          setUpdateDateTime(new Date().getTime());
          setTableData([]);
          setTableHeaderData([]);
          setPageSummary({});
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      // Handle error appropriately if needed
    } finally {
      setProcessingLoader(false);
    }
  };

  const onPaginationChange = async (pageNumber: number) => {
    setProcessingLoader(true);
    setPayload({ ..._payload, pageno: pageNumber });
  };

  const onServerSideSort = useCallback(
    async (field: any) => {
      setProcessingLoader(true);
      setPayload((prevPayload: any) => {
        const sortConfig = prevPayload.sort;
        const isFieldSorted = sortConfig.find(
          (config: any) => config.field === field,
        );
        let newSortConfig;

        if (isFieldSorted) {
          newSortConfig = sortConfig.map((config: any) =>
            config.field === field
              ? { ...config, order: config.order === "ASC" ? "DESC" : "ASC" }
              : config,
          );
        } else {
          newSortConfig = [{ field, order: "DESC" }];
        }

        return { ...prevPayload, sort: newSortConfig };
      });
    },
    [_payload],
  );

  const onTabViewUpdate = async (viewId: any) => {
    setProcessingLoader(true);
    setActiveViewId(viewId);
    setResetSort(viewId);
    setPayload({ ..._payload, viewId: viewId, sort: [], pageno: 1 });
  };

  const filterDataChangeHander = async (id: any) => {
    setProcessingLoader(true);
    const url = actualUrl;
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    // updateL3NAV(id, _payload.duration);
    const isExist: any = shortUrlMapping?.find(
      (item: any) => item.longURL == newUrl,
    );
    const updatedUrl = isExist ? isExist.shortUrl : newUrl;
    router.push(updatedUrl, { scroll: false });
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    setProcessingLoader(true);
    if (l3NavSubItem == "gainers" || l3NavSubItem == "losers") {
      const url = actualUrl;
      const newDuration = value.toUpperCase();
      const newUrl = updateOrAddParamToPath(url, "duration", newDuration);
      // updateL3NAV(_payload.filterValue[0], newDuration);
      const isExist: any = shortUrlMapping?.find(
        (item: any) => item.longURL == newUrl,
      );
      const updatedUrl = isExist ? isExist.shortUrl : newUrl;
      router.push(updatedUrl, { scroll: false });
    } else if (l3NavSubItem == "volume-shockers") {
      const url = actualUrl;
      const newTimespan = value.toUpperCase();
      const newUrl = updateOrAddParamToPath(url, "timespan", newTimespan);
      const isExist: any = shortUrlMapping?.find(
        (item: any) => item.longURL == newUrl,
      );
      const updatedUrl = isExist ? isExist.shortUrl : newUrl;
      router.push(updatedUrl, { scroll: false });
    } else if (
      l3NavSubItem == "hourly-gainers" ||
      l3NavSubItem == "hourly-losers"
    ) {
      setPayload({
        ..._payload,
        timespan: !!value ? value.toUpperCase() : null,
        pageno: 1,
      });
    }
  };

  const tabsChangeHandler = async (tabIdActive: any) => {
    setProcessingLoader(true);
    const { tabData } = await getCustomViewsTab({
      L3NavSubItem: !isTechnical ? l3NavSubItem : null,
      firstOperand: isTechnical
        ? technicalCategory?.selectedFilter?.firstOperand
        : null,
      operationType: isTechnical
        ? technicalCategory?.selectedFilter?.operationType
        : null,
      secondOperand: isTechnical
        ? technicalCategory?.selectedFilter?.secondOperand
        : null,
      ssoid: ssoid,
    });
    setResetSort(tabIdActive);
    setTabData(tabData);
    setActiveViewId(tabIdActive);
  };

  const onPersonalizeHandlerfun = async (newActiveId: any = "", mode = "") => {
    if (mode === "update") {
      setModalBodyText({
        ...modalBodyText,
        title: "You have successfully updated your personalize view",
      });
      setShowModalMessage(true);
    } else if (mode === "new") {
      setModalBodyText({
        ...modalBodyText,
        title: "You have successfully created your personalize view",
      });
      setShowModalMessage(true);
    }

    const { tabData, activeViewId } = await getCustomViewsTab({
      L3NavSubItem: !isTechnical ? l3NavSubItem : null,
      firstOperand: isTechnical
        ? technicalCategory?.selectedFilter?.firstOperand
        : null,
      operationType: isTechnical
        ? technicalCategory?.selectedFilter?.operationType
        : null,
      secondOperand: isTechnical
        ? technicalCategory?.selectedFilter?.secondOperand
        : null,
      ssoid: ssoid,
    });

    setTabData(tabData);
    if (newActiveId !== "") {
      onTabViewUpdate(newActiveId);
      setActiveViewId(newActiveId);
    } else {
      onTabViewUpdate(activeViewId);
    }
  };

  const onTechnicalOperandsUpdate = async ({
    firstOperand,
    secondOperand,
    operationType,
  }: any) => {
    setProcessingLoader(true);
    let url = !!actualUrl ? actualUrl : `${pathname}?${searchParams}`;
    (url = updateOrAddParamToPath(url, "firstoperand", firstOperand)),
      (url = updateOrAddParamToPath(url, "secondoperand", secondOperand)),
      (url = updateOrAddParamToPath(url, "operationtype", operationType));
    const isExist: any = shortUrlMapping?.find(
      (item: any) => item.longURL == url,
    );
    const newUrl = isExist ? isExist.shortUrl : url;
    // const technicalCategory = await getTechincalOperands(
    //   l3NavMenuItem,
    //   firstOperand,
    //   operationType,
    //   secondOperand
    // );
    // const descTxt = `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;
    // setMetaData({ ..._metaData, desc: descTxt });
    // setPayload({
    //   ..._payload,
    //   firstOperand: firstOperand,
    //   operationType: operationType,
    //   secondOperand: secondOperand,
    //   pageno: 1,
    // });
    router.push(newUrl, { scroll: false });
  };
  const removePersonaliseViewFun = (viewId: any) => {
    setToasterPersonaliseViewRemove(true);
    const confirmData = {
      title: "Are you sure you want to remove your Personalise View?",
      id: viewId,
    };
    setToasterConfirmData(confirmData);
    console.log("removePersonaliseViewFun", viewId);
  };
  const toasterRemovePersonaliseViewCloseHandlerFun = async (
    value: boolean,
    data: any,
  ) => {
    console.log(
      "toasterRemovePersonaliseViewCloseHandlerFun",
      value,
      "___data",
      data,
    );
    setToasterPersonaliseViewRemove(false);
    if (value && data && data.id && data.id !== "") {
      const removeViewById = await removePersonalizeViewById(data?.id);
      console.log("removeViewById", removeViewById);
      onPersonalizeHandlerfun();
    }
  };

  const getNavName = () => {
    const navData = l3Nav?.nav || [];
    for (const navItem of navData) {
      if (navItem.sub_nav) {
        let navName;
        if (isTechnical) {
          navName = navItem.sub_nav.find(
            (nav: any) =>
              nav.firstoperand ===
                technicalCategory?.selectedFilter?.firstOperand &&
              nav.operationtype ===
                technicalCategory?.selectedFilter?.operationType &&
              nav.secondoperand ===
                technicalCategory?.selectedFilter?.secondOperand,
          );
        } else {
          navName = navItem.sub_nav.find(
            (nav: any) => nav.type === l3NavSubItem,
          );
        }
        if (navName) {
          return navName?.label || null;
        }
      }
    }
    return null; // Return null if no matching item is found
  };

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [_payload, isPrime]);

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE") updateTableData();
    },
    refeshConfig.marketstats,
    [_payload, isPrime, currentMarketStatus],
  );

  useEffect(() => {
    setProcessingLoader(true);
    if (areObjectsNotEqual(_payload, payload)) {
      if (isTechnical) {
        setTechnicalCategory(technicalCategory);
        if (payload.viewId != _payload.viewId) {
          tabsChangeHandler(payload.viewId);
          setPayload({ ...payload, sort: [] });
        } else {
          setPayload({
            ...payload,
            viewId: _payload.viewId,
            sort: _payload.sort,
          });
        }
      } else {
        setDayFilterData(getSelectedDuration);
        if (payload.apiType != _payload.apiType) {
          tabsChangeHandler(payload.viewId);
          setPayload({ ...payload, sort: [] });
        } else {
          setPayload({
            ...payload,
            viewId: _payload.viewId,
            sort:
              _payload.duration != payload.duration ||
              _payload.timespan != payload.timespan
                ? []
                : _payload.sort,
          });
        }
      }
      setMetaData(metaData);
    } else {
      setProcessingLoader(false);
    }
  }, [searchParams]);

  return (
    <>
      <div className="dflex align-item-center">
        <h1 className={`${styles.heading} ${styles.withRBorder}`}>
          {_metaData.title}
        </h1>
        <MarketStatus
          currentMarketStatus={currentMarketStatus}
          dateTime={updateDateTime}
          withSpace={true}
        />
      </div>
      <p className={styles.desc}>{_metaData.desc}</p>
      <div className={styles.marketstatsContainer}>
        <aside className={styles.lhs}>
          <MarketStatsNav
            leftNavResult={_l3Nav?.nav}
            type={l3NavMenuItem}
            subType={!isTechnical ? l3NavSubItem : null}
            firstOperand={
              isTechnical
                ? technicalCategory?.selectedFilter?.firstOperand
                : null
            }
            operationType={
              isTechnical
                ? technicalCategory?.selectedFilter?.operationType
                : null
            }
            secondOperand={
              isTechnical
                ? technicalCategory?.selectedFilter?.secondOperand
                : null
            }
            shortUrlMapping={shortUrlMapping}
          />
        </aside>
        <div className={styles.rhs}>
          {isTechnical && _technicalCategory.firstOperands && (
            <TechincalOperands
              technicalCategory={_technicalCategory}
              handleTechnicalOperands={onTechnicalOperandsUpdate}
            />
          )}
          <div className="tabsWrap">
            <LeftMenuTabs
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
            />
            <MarketFiltersTab
              data={_tabData}
              filterDataChange={filterDataChangeHander}
              niftyFilterData={niftyFilterData}
              dayFitlerHanlderChange={dayFitlerHanlderChange}
              tabConfig={tabConfig}
              dayFilterData={dayFilterData}
              setDayFilterData={setDayFilterData}
              onPersonalizeHandler={onPersonalizeHandlerfun}
              removePersonaliseView={removePersonaliseViewFun}
              intradayDurationOptions={intradayDurationOptions}
              subType={!isTechnical ? l3NavSubItem : null}
              nseBseToggle={isTechnical ? false : true}
              shortUrlMapping={shortUrlMapping}
            />
          </div>
          <MarketTable
            data={_tableData}
            highlightLtp={
              !!currentMarketStatus && currentMarketStatus != "CLOSED"
            }
            tableHeaders={_tableHeaderData}
            tabsViewIdUpdate={resetSort}
            pageSummary={_pageSummary}
            tableConfig={tableConfig}
            handleSortServerSide={onServerSideSort}
            handlePageChange={onPaginationChange}
            processingLoader={processingLoader}
            isprimeuser={isPrime}
            l1NavTracking={!isTechnical ? "Stocks" : "Technical Signals"}
            l2NavTracking={
              !isTechnical ? "Intraday" : _technicalCategory?.category
            }
            l3NavTracking={getNavName()}
          />
        </div>
      </div>
      {toasterPersonaliseViewRemove && (
        <ToasterPopup
          data={toasterConfirmData}
          toasterCloseHandler={toasterRemovePersonaliseViewCloseHandlerFun}
        />
      )}
      {showModalMessage && (
        <MessagePopupShow
          message={modalBodyText}
          mode="success"
          closePopup={setShowModalMessage}
        />
      )}
    </>
  );
};

export default MarketStats;
