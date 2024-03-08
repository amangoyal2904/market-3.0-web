"use client";
import dynamic from "next/dynamic";
import MarketTable from "@/components/MarketTable";
import styles from "./stockScreener.module.scss";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import useScreenerTab from "./useScreenerTab";
import QueryComponets from "./queryComponents";
import LeftMenuTabs from "@/components/MarketTabs/MenuTabs";
import MarketFiltersTab from "@/components/MarketTabs/MarketFiltersTab";
import refeshConfig from "@/utils/refreshConfig.json";
import ToasterPopup from "@/components/ToasterPopup";
import StocksScreenerNav from "@/components/ScreenersAsideNav";
import { removePersonalizeViewById } from "@/utils/utility";
import { fetchViewTable } from "@/utils/utility";
import { getCookie } from "@/utils";
import { createNewScreener } from "@/utils/screeners";
import { getScreenerTabViewData } from "@/utils/customViewAndTables";
const CreateScreenerModule = dynamic(
  () => import("@/components/CreateScreenerModule/CreateScreener"),
  {
    loading: () => (
      <div className="customLoader">
        <div className="loading">
          <div className="loader"></div>
        </div>
      </div>
    ),
  },
);
const StockScreeners = ({
  l3Nav = [],
  metaData = {},
  tabData = [],
  activeViewId = null,
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  tableConfig = {},
  tabConfig = {},
  scrid,
  screenerDetail,
  payload = {},
  ssoid = null,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [_payload, setPayload] = useState(payload);
  const [_screenerDetail, setScreenerDetail] = useState(screenerDetail);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [toasterConfirmData, setToasterConfirmData] = useState({});
  const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
    useState(false);
  const [createModuleScreener, setCreateModuleScreener] = useState(false);
  const [screenerEditMode, setScreenerEditMode] = useState({
    mode: false,
    viewId: "",
  });
  const [screenerLoading, setScreenerLoading] = useState(false);

  const onSearchParamChange = async () => {
    setL3Nav(l3Nav);
    setMetaData(metaData);
    setActiveViewId(activeViewId);
    setTableData(tableData);
    setTableHeaderData(tableHeaderData);
    setPageSummary(pageSummary);
  };

  const onTabViewUpdate = async (viewId: any) => {
    setProcessingLoader(true);
    setActiveViewId(viewId);
    setPayload({ ..._payload, viewId: viewId, pageno: 1 });
  };

  const updateOrAddParamToPath = (pathname: any, param: any, value: any) => {
    const url = new URL(window.location.origin + pathname);
    const searchParams = url.searchParams;

    if (value === 0) {
      searchParams.delete(param);
    } else if (searchParams.has(param)) {
      searchParams.set(param, value);
    } else {
      searchParams.append(param, value);
    }

    return url.pathname + "?" + searchParams.toString();
  };

  const dayFitlerHanlderChange = async (value: any, label: any) => {
    const url = `${pathname}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, label, value);
    router.push(newUrl, { scroll: false });
  };

  const TabsAndTableDataChangeHandler = async (tabIdActive: any) => {
    const { tabData, activeViewId } = await useScreenerTab();
    setTabData(tabData);
    setActiveViewId(activeViewId);
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
  const onPersonalizeHandlerfun = async (newActiveId: any = "") => {
    setProcessingLoader(true);
    const { tabData, activeViewId } = await getScreenerTabViewData({
      type: "screenerGetViewById",
      ssoid,
    });

    setTabData(tabData);
    if (newActiveId !== "") {
      onTabViewUpdate(newActiveId);
      setActiveViewId(newActiveId);
    } else {
      onTabViewUpdate(activeViewId);
    }
  };
  const onPaginationChange = async (pageNumber: number) => {
    setProcessingLoader(true);
    setPayload({ ..._payload, pageno: pageNumber });
  };
  const onServerSideSort = async (field: any) => {
    setProcessingLoader(true);
    let sortConfig = _payload.sort;
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
      newSortConfig = [...sortConfig, { field, order: "DESC" }];
    }
    setPayload({ ..._payload, sort: newSortConfig });
  };
  const runQueryHandlerFun = async (query: any) => {
    setScreenerLoading(true);
    // const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getScreenerByScreenerId[APP_ENV]}`;
    const API_URL = `https://screener.indiatimes.com/screener/getScreenerByScreenerId`;
    const bodyparams = {
      queryCondition: query.trim(),
      filterValue: [],
      pageno: 1,
      pagesize: 25,
      screenerId: scrid,
    };

    const data = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyparams),
    });
    //return data.json()
    const responseData = await data.json();
    if (responseData && responseData.statusCode === 200) {
      const _pageSummary = !!responseData.pageSummary
        ? responseData.pageSummary
        : {};
      const _tableData = responseData?.dataList ? responseData.dataList : [];

      const _tableHeaderData =
        _tableData && _tableData.length && _tableData[0] && _tableData[0]?.data
          ? _tableData[0]?.data
          : [];
      const _screenerDetails = !!responseData.screenerDetail
        ? responseData.screenerDetail
        : {};
      setTableData(_tableData);
      setTableHeaderData(_tableHeaderData);
      setPageSummary(_pageSummary);
      setScreenerDetail(_screenerDetails);
      setScreenerLoading(false);
      setCreateModuleScreener(false);
      setMetaData({
        ..._metaData,
        title: "Unsaved Screener",
        saveMode: "true",
      });
    } else {
      alert("Error : Incorrect Query");
    }
    setScreenerLoading(false);
  };
  const createNewScreenerFun = () => {
    setCreateModuleScreener(true);
  };
  const cancelScreenerCreateFun = () => {
    setCreateModuleScreener(false);
  };
  const closeModuleScreerHandler = () => {
    setCreateModuleScreener(false);
  };
  const saveScreenerhandler = async () => {
    // here api call
    // SaveScreenerAPI
    const userInfo: any =
      window.objUser && window.objUser.ssoid && window.objUser.ssoid !== ""
        ? window.objUser
        : {};
    const screenerPayload = {
      ssoEmailID: userInfo?.info?.loginId || "",
      ssoid: userInfo?.ssoid || "",
      name: _metaData?.title || "",
      displayQuery: _screenerDetail?.displayQuery || "",
      isActive: "1",
      screenerType: "USER",
      screenerId: "",
    };
    //const resData = await createNewScreener(screenerPayload);
    console.log("_resDatascreenerPayload__", screenerPayload);
  };
  const updateTableData = async () => {
    const responseData: any = await fetchViewTable(
      { ..._payload },
      "screenerGetViewById",
      getCookie("isprimeuser") ? true : false,
      getCookie("ssoid"),
    );
    const _pageSummary = !!responseData.pageSummary
      ? responseData.pageSummary
      : {};
    const _tableData = responseData?.dataList ? responseData.dataList : [];

    const _tableHeaderData =
      _tableData && _tableData.length && _tableData[0] && _tableData[0]?.data
        ? _tableData[0]?.data
        : [];
    setTableData(_tableData);
    setTableHeaderData(_tableHeaderData);
    setPageSummary(_pageSummary);
    setProcessingLoader(false);
  };
  useEffect(() => {
    onSearchParamChange();
  }, [searchParams]);
  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
    const intervalId = setInterval(() => {
      updateTableData();
    }, parseInt(refeshConfig.stocksScreener));
    return () => clearInterval(intervalId);
  }, [_payload]);

  return (
    <>
      <h1 className={styles.heading}>
        {!createModuleScreener ? _metaData.title : "New Screener"}
        {_metaData && _metaData.saveMode ? (
          <span onClick={saveScreenerhandler} className={styles.saveMode}>
            {" "}
            <i
              className="eticon_save
          "
            />
            Save
          </span>
        ) : (
          ""
        )}
      </h1>
      {!createModuleScreener ? (
        <p className={styles.desc}>{_metaData.desc}</p>
      ) : (
        ""
      )}

      <div className={styles.container}>
        {createModuleScreener ? (
          <CreateScreenerModule
            closeModuleScreenerNew={closeModuleScreerHandler}
            runQueryhandler={runQueryHandlerFun}
            editmode={screenerEditMode}
            cancelScreenerCreate={cancelScreenerCreateFun}
            screenerLoading={screenerLoading}
            setScreenerLoading={setScreenerLoading}
          />
        ) : (
          <>
            <aside className={styles.lhs}>
              <StocksScreenerNav leftNavResult={_l3Nav} activeId={scrid} />
            </aside>
            <div className={styles.rhs}>
              <div className="tabsWrap">
                <LeftMenuTabs
                  data={_tabData}
                  activeViewId={_activeViewId}
                  tabsViewIdUpdate={onTabViewUpdate}
                />
                <MarketFiltersTab
                  data={_tabData}
                  activeViewId={_activeViewId}
                  tabsViewIdUpdate={onTabViewUpdate}
                  dayFitlerHanlderChange={dayFitlerHanlderChange}
                  tabsUpdateHandler={TabsAndTableDataChangeHandler}
                  tabConfig={tabConfig}
                  // dayFilterData={dayFilterData}
                  // setDayFilterData={setDayFilterData}
                  onPersonalizeHandler={onPersonalizeHandlerfun}
                  removePersonaliseView={removePersonaliseViewFun}
                  createNewScreener={createNewScreenerFun}
                />
              </div>
              <MarketTable
                data={_tableData}
                tableHeaders={_tableHeaderData}
                pageSummary={_pageSummary}
                tableConfig={tableConfig}
                handleSortServerSide={onServerSideSort}
                handlePageChange={onPaginationChange}
                processingLoader={processingLoader}
              />
              <div className="">
                <QueryComponets data={_screenerDetail} />
              </div>
            </div>
          </>
        )}
      </div>
      {toasterPersonaliseViewRemove && (
        <ToasterPopup
          data={toasterConfirmData}
          toasterCloseHandler={toasterRemovePersonaliseViewCloseHandlerFun}
        />
      )}
    </>
  );
};

export default StockScreeners;
