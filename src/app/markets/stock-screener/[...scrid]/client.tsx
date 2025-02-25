"use client";
import dynamic from "next/dynamic";
import MarketTable from "@/components/MarketTable";
import styles from "./stockScreener.module.scss";
import { useCallback, useEffect, useState } from "react";
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
import { getCookie, initSSOWidget } from "@/utils";
import { createNewScreener } from "@/utils/screeners";
import { getScreenerTabViewData } from "@/utils/customViewAndTables";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import service from "@/network/service";
import { useStateContext } from "@/store/StateContext";
import MarketStatus from "@/components/MarketStatus";
import { trackingEvent } from "@/utils/ga";
import useIntervalApiCall from "@/utils/useIntervalApiCall";
import PrimeBannerExperiment from "@/components/PrimeBannerExperiment";
const MessagePopupShow = dynamic(
  () => import("@/components/MessagePopupShow"),
  { ssr: false },
);
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
const ScreenerNameViewPopup = dynamic(
  () => import("@/components/CreateScreenerModule/Createmodule"),
  { ssr: false },
);
const StockScreeners = ({
  l3Nav = [],
  metaData = {},
  tabData = [],
  activeViewId = null,
  unixDateTime = new Date(),
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  tableConfig = {},
  tabConfig = {},
  scrid,
  screenerDetail,
  payload = {},
  ssoidAtServerEnd = "",
  l3UserNav = {},
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [_tabData, setTabData] = useState(tabData);
  const [_l3Nav, setL3Nav] = useState(l3Nav);
  const [_l3UserNav, setL3UserNav] = useState(l3UserNav);
  const [_metaData, setMetaData] = useState(metaData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [resetSort, setResetSort] = useState("");
  const [_payload, setPayload] = useState(payload);
  const [_query, setQuery] = useState(screenerDetail.displayQuery);
  const [_screenerDetail, setScreenerDetail] = useState(screenerDetail);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [toasterConfirmData, setToasterConfirmData] = useState({});
  const [toastRemoveScreener, setToastRemoveScreener] = useState(false);
  const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
    useState(false);
  const [createScreenerNamePopup, setCeateScreenerNamePopup] = useState(false);
  const [createModuleScreener, setCreateModuleScreener] = useState(false);
  const [toasterInvalideQuery, setToasterInvalideQuery] = useState(false);
  const [screenerEditMode, setScreenerEditMode] = useState({
    userMode: _screenerDetail.screenerType,
    mode: false,
    viewId: "",
    screenerStage: "",
  });
  const [editQueryScreener, setEditQueryScreener] = useState(false);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [modalBodyText, setModalBodyText] = useState({
    title: "You have Successfully created your personalise view",
  });
  const { state } = useStateContext();
  const { isLogin, isPrime, ssoid } = state.login;
  const { currentMarketStatus } = state.marketStatus;
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
    setResetSort(viewId);
    setPayload({ ..._payload, viewId: viewId, sort: [], pageno: 1 });
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
    setResetSort(value);
    const url = `${pathname}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, label, value);
    router.push(newUrl, { scroll: false });
  };

  const TabsAndTableDataChangeHandler = () => {
    updateTabData();
  };

  const removePersonaliseViewFun = (viewId: any) => {
    setToasterPersonaliseViewRemove(true);
    const confirmData = {
      title: "Are you sure you want to remove your Personalise View?",
      id: viewId,
    };
    setToasterConfirmData(confirmData);
  };
  const toasterRemovePersonaliseViewCloseHandlerFun = async (
    value: boolean,
    data: any,
  ) => {
    setToasterPersonaliseViewRemove(false);
    if (value && data && data.id && data.id !== "") {
      const removeViewById = await removePersonalizeViewById(data?.id);
      onPersonalizeHandlerfun();
    }
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
  const industryFilerValueHandler = (value: any) => {
    console.log("getIndustryValuye", value);
    if (value && value.length > 0) {
      setPayload({
        ..._payload,
        queryCondition: `${_query} AND Industry In(${value.join(",")})`,
      });
    } else {
      setPayload({
        ..._payload,
        queryCondition: `${_query}`,
      });
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
          newSortConfig = [...sortConfig, { field, order: "DESC" }];
        }

        return { ...prevPayload, sort: newSortConfig };
      });
    },
    [_payload],
  );
  const runQueryHandlerFun = async (query: any) => {
    //setProcessingLoader(true);
    //setPayload({ ..._payload, queryCondition:query.trim(), pageno: 1 });
    setScreenerLoading(true);
    const API_URL = (APIS_CONFIG as any)?.["screenerGetViewById"][APP_ENV];
    const bodyparams = {
      queryCondition: query.trim(),
      filterValue: [],
      pageno: 1,
      pagesize: 25,
      screenerId: scrid,
    };
    setQuery(query.trim());

    const data = await service.post({
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyparams),
      params: {},
    });

    const responseData = await data.json();
    if (responseData && responseData.statusCode === 200) {
      setScreenerLoading(false);
      setCreateModuleScreener(false);

      // ====== edit mode

      setMetaData({
        ..._metaData,
        title: "Unsaved Screener",
        saveMode: "true",
      });
      setScreenerEditMode({
        ...screenerEditMode,
        screenerStage: "edit",
      });

      // ===== edit mode
      setPayload({ ..._payload, queryCondition: query.trim() });
    } else {
      //alert("Error : Incorrect Query");
      setToasterConfirmData({
        title: "Error : Incorrect Query",
      });
      setToasterInvalideQuery(true);
      setTimeout(() => {
        toasterInvalidQueryCloseFun();
      }, 3000);
    }
    setScreenerLoading(false);
  };
  const toasterInvalidQueryCloseFun = () => {
    setToasterInvalideQuery(false);
    setToasterConfirmData({});
  };
  const runQueryHandlerFunPopUp = async (query: any) => {
    setScreenerLoading(true);
    const API_URL = (APIS_CONFIG as any)?.["screenerGetViewById"][APP_ENV];
    const bodyparams = {
      queryCondition: query.trim(),
      filterValue: [],
      pageno: 1,
      pagesize: 25,
      screenerId: scrid,
    };
    setQuery(query.trim());

    const data = await service.post({
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyparams),
      params: {},
    });

    const responseData = await data.json();
    if (responseData && responseData.statusCode === 200) {
      setScreenerLoading(false);
      setCreateModuleScreener(false);

      // ====== edit mode
      if (
        screenerEditMode.mode &&
        screenerEditMode.userMode === "USER" &&
        screenerEditMode.screenerStage === "popup"
      ) {
        setEditQueryScreener(false);
        document.body.style.overflow = "";
      } else if (
        screenerEditMode.userMode === "ET" &&
        screenerEditMode.screenerStage === "popup"
      ) {
        setEditQueryScreener(false);
        document.body.style.overflow = "";
        setMetaData({
          ..._metaData,
          title: "Unsaved Screener",
          saveMode: "true",
        });
      } else {
        // setMetaData({
        //   ..._metaData,
        //   title: "Unsaved Screener",
        //   saveMode: "true",
        // });
        // setScreenerEditMode({
        //   ...screenerEditMode,
        //   screenerStage: "edit",
        // });
      }
      // ===== edit mode
      setPayload({ ..._payload, queryCondition: query.trim() });
    } else {
      //alert("Error : Incorrect Query");
      setToasterConfirmData({
        title: "Error : Incorrect Query",
      });
      setToasterInvalideQuery(true);
      setTimeout(() => {
        toasterInvalidQueryCloseFun();
      }, 3000);
    }
    setScreenerLoading(false);
  };
  const createNewScreenerFun = () => {
    if (isLogin) {
      setCreateModuleScreener(true);
      setScreenerEditMode({
        ...screenerEditMode,
        mode: false,
        screenerStage: "new",
      });
    } else {
      initSSOWidget();
    }
  };
  const cancelScreenerCreateFun = () => {
    if (screenerEditMode.mode) {
      setEditQueryScreener(false);
      document.body.style.overflow = "";
    } else {
      setCreateModuleScreener(false);
    }
    setScreenerEditMode({
      ...screenerEditMode,
      mode: false,
      screenerStage: "",
    });
  };
  const closeModuleScreerHandler = () => {
    setCreateModuleScreener(false);
  };
  const saveScreenerhandler = async () => {
    if (isLogin) {
      setCeateScreenerNamePopup(true);
      document.body.style.overflow = "hidden";
    } else {
      initSSOWidget();
    }
  };
  const screenerNameUpdateHandler = (value: any) => {
    setMetaData({ ..._metaData, title: value });
  };
  const createViewNameHandlerHandler = async (value: any) => {
    setCeateScreenerNamePopup(false);
    document.body.style.overflow = "";
    setProcessingLoader(true);
    const userInfo: any =
      window.objUser && window.objUser.ssoid && window.objUser.ssoid !== ""
        ? window.objUser
        : {};
    const screenerPayload = {
      ssoEmailID: userInfo?.info?.loginId || "",
      ssoid: userInfo?.ssoid || "",
      name: value || "",
      displayQuery: _screenerDetail?.displayQuery || "",
      isActive: "1",
      screenerType: "USER",
      screenerId: "",
    };
    if (
      (screenerEditMode.screenerStage === "" ||
        screenerEditMode.screenerStage === "popup") &&
      _screenerDetail.screenerType === "USER"
    ) {
      screenerPayload.screenerId = scrid;
    }
    const resData = await createNewScreener(screenerPayload);
    setProcessingLoader(false);
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "screener_save_successfully",
      // event_label: window.location.href,
    });
    if (
      resData &&
      resData.screenerId &&
      parseInt(resData.screenerId) !== parseInt(scrid)
    ) {
      router.push(
        `/markets/stock-screener/${resData.seoName || "test-seo-name"}/screens/scrid-${resData.screenerId}`,
        { scroll: false },
      );
      // console.log('refresh---',resData.screenerId === parseInt(scrid))
    } else if (parseInt(resData?.screenerId) === parseInt(scrid)) {
      //window.location.reload();
      // console.log('refresh')
      // router.refresh();
      router.push(
        `/markets/stock-screener/${resData.seoName || "test-seo-name"}/screens/scrid-${resData.screenerId}`,
        { scroll: false },
      );
    }
  };

  const updateTabData = async () => {
    const { tabData, activeViewId } = await getScreenerTabViewData({
      type: "screenerGetViewById",
      ssoid,
    });
    setTabData(tabData);
    setActiveViewId(activeViewId);
  };

  const updateTableData = async () => {
    const isPrimeUser = getCookie("isprimeuser") === "true";
    const ssoid = getCookie("ssoid");
    const ticketId = getCookie("TicketId");
    try {
      const responseData: any = await fetchViewTable({
        requestObj: _payload,
        apiType: "screenerGetViewById",
        isprimeuser: isPrimeUser,
        ssoid: ssoid,
        ticketId: ticketId,
      });

      if (responseData && Array.isArray(responseData.dataList)) {
        const {
          dataList,
          pageSummary = {},
          screenerDetail = {},
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
        setScreenerDetail(screenerDetail);

        if (newTableData.length === 0) {
          setUpdateDateTime(new Date().getTime());
          setTableData([]);
          setTableHeaderData([]);
          setPageSummary({});
          setScreenerDetail({});
        }
      }
    } catch (error) {
      console.error("Error fetching screener data:", error);
      // Handle error appropriately if needed
    } finally {
      setProcessingLoader(false);
    }
  };

  const editRemoveStockBtnReset = () => {
    // ===
  };
  const removeScreenerhandler = () => {
    console.log("Remove Icon");
    setToastRemoveScreener(true);
    const confirmData = {
      title: "Are you sure you want to remove your Screener?",
      id: scrid,
    };
    setToasterConfirmData(confirmData);
  };
  const toasterRemoveSceenerCloseHandlerFun = async (
    value: boolean,
    data: any,
  ) => {
    console.log(
      "toasterRemovePersonaliseViewCloseHandlerFun",
      value,
      "___data",
      data,
    );
    setToastRemoveScreener(false);
    if (value && data && data.id && data.id !== "") {
      const removeViewById = await removeScreener();
      console.log("removeViewById", removeViewById);
    }
  };
  const removeScreener = async () => {
    setProcessingLoader(true);
    const userSsoId = window?.objUser?.ssoid || getCookie("ssoid");
    setScreenerLoading(true);
    const API_URL = `${(APIS_CONFIG as any)?.["RemoveScreenerBySSOID"][APP_ENV]}?screenerid=${scrid}&ssoId=${userSsoId}`;

    const data = await service.get({
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
        ssoid: userSsoId,
      },
      params: {},
    });

    const responseData = await data.json();
    if (responseData && responseData.responseCode) {
      const firstScreenerData: any = l3Nav[0]?.listScreenerMaster[0];
      const linkHref = `/markets/stock-screener/${firstScreenerData.seoName ? firstScreenerData.seoName : "test-seo-page"}/screens/scrid-${firstScreenerData.screenerId}`;
      router.push(linkHref);
    }
    setProcessingLoader(false);
  };
  const H1HeadingSection = () => {
    if (screenerEditMode.screenerStage === "new") {
      return <h1 className={styles.heading}>New Screener</h1>;
    } else if (screenerEditMode.screenerStage === "edit") {
      return (
        <h1 className={styles.heading}>
          Unsaved Screener{" "}
          <span onClick={saveScreenerhandler} className={styles.saveMode}>
            <i className="eticon_save" /> Save{" "}
          </span>
        </h1>
      );
    } else if (screenerEditMode.userMode === "USER" && !screenerEditMode.mode) {
      return (
        <h1 className={styles.heading}>
          {_metaData.title}{" "}
          {isLogin && (
            <>
              <span onClick={saveScreenerhandler} className={styles.saveMode}>
                <i className="eticon_save" /> Update{" "}
              </span>
              <span
                onClick={removeScreenerhandler}
                className={styles.removeMode}
              >
                Remove{" "}
              </span>
            </>
          )}
        </h1>
      );
    } else if (
      screenerEditMode.userMode === "USER" &&
      screenerEditMode.screenerStage === "popup"
    ) {
      return (
        <h1 className={styles.heading}>
          {_metaData.title}{" "}
          <span onClick={saveScreenerhandler} className={styles.saveMode}>
            <i className="eticon_save" /> Update{" "}
          </span>
          <span onClick={removeScreenerhandler} className={styles.removeMode}>
            Remove{" "}
          </span>
        </h1>
      );
    } else if (
      screenerEditMode.userMode === "ET" &&
      screenerEditMode.screenerStage === "popup"
    ) {
      return (
        <h1 className={styles.heading}>
          Unsaved Screener{" "}
          <span onClick={saveScreenerhandler} className={styles.saveMode}>
            <i className="eticon_save" /> Save{" "}
          </span>
        </h1>
      );
    } else {
      return (
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
      );
    }
  };
  const l3UesrNavAPICall = async () => {
    const userSSOID = getCookie("ssoid") || "";
    const apiParams = `?ssoId=${userSSOID}&screenercount=100`;
    const apiUrl = `${(APIS_CONFIG as any)?.["GetScreenerBySSOID"][APP_ENV]}${apiParams}`;
    const response = await service.get({
      url: apiUrl,
      params: {},
      cache: "no-store",
    });
    const resJson = await response?.json();

    let l3UserNav: any[] = [];
    if (
      resJson &&
      resJson?.datainfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo
        ?.listScreenerCollectionMasterDataInfo
    ) {
      const listDataInfo = [
        ...resJson.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo,
      ];
      const collectionId = 0;
      const filteredArrays = listDataInfo.filter(
        (item: any) => item.collectionId === collectionId,
      );
      l3UserNav = filteredArrays[0];
    }
    //console.log("userEffect call adatal3UserNav___ ", l3UserNav);
    setL3UserNav(l3UserNav);
    setProcessingLoader(false);
  };

  const getCollectionNameByScreenerId = (screenerId: any) => {
    const collection = l3Nav.find((collection: any) =>
      collection.listScreenerMaster.some(
        (screener: any) => screener.screenerId == screenerId,
      ),
    );
    return collection ? collection.collectionName : null;
  };
  useEffect(() => {
    onSearchParamChange();
  }, [searchParams]);

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE" && !!fallbackWebsocket)
        updateTableData();
    },
    refeshConfig.stocksScreener,
    [_payload, currentMarketStatus, fallbackWebsocket],
  );

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [_payload]);

  useEffect(() => {
    if (!!ssoid && ssoidAtServerEnd != ssoid) {
      updateTabData();
    }
  }, [ssoid]);

  useEffect(() => {
    const userSSOID = getCookie("ssoid");
    if (userSSOID) {
      l3UesrNavAPICall();
    }
  }, [ssoid]);
  //console.log("+l3Nav.screenerType === ",l3Nav[0].listScreenerMaster[0] )
  return (
    <>
      {H1HeadingSection()}

      {screenerEditMode.screenerStage === "new" ||
      screenerEditMode.screenerStage === "edit" ||
      screenerEditMode.screenerStage === "popup" ? (
        ""
      ) : (
        <p className={styles.desc}>{_metaData.desc}</p>
      )}

      {!isPrime && (
        <PrimeBannerExperiment
          pageName="Mercury_Screener"
          pageId={`screener_${screenerDetail?.seoName}`}
        />
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
              <StocksScreenerNav
                leftNavResult={_l3Nav}
                activeId={scrid}
                l3UserNav={_l3UserNav}
              />
            </aside>
            <div className={styles.rhs}>
              <div className="tabsWrap">
                <LeftMenuTabs
                  data={_tabData}
                  activeViewId={_activeViewId}
                  tabsViewIdUpdate={onTabViewUpdate}
                  page="stockScreener"
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
                  getIndustryFilterValue={industryFilerValueHandler}
                  editRemoveStockBtnReset={editRemoveStockBtnReset}
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
                fixedCol={1}
                isprimeuser={getCookie("isprimeuser") == "true" ? true : false}
                l1NavTracking="Screeners"
                l2NavTracking={getCollectionNameByScreenerId(scrid)}
                l3NavTracking={screenerDetail.name}
                setUpdateDateTime={setUpdateDateTime}
                setFallbackWebsocket={setFallbackWebsocket}
                socketDataType="stock"
              />
              <div className="">
                <QueryComponets
                  data={_screenerDetail}
                  showModal={setEditQueryScreener}
                  setScreenerEditMode={setScreenerEditMode}
                  screenerEditMode={screenerEditMode}
                />
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
      {toastRemoveScreener && (
        <ToasterPopup
          data={toasterConfirmData}
          toasterCloseHandler={toasterRemoveSceenerCloseHandlerFun}
        />
      )}
      {createScreenerNamePopup && (
        <ScreenerNameViewPopup
          closePopUp={setCeateScreenerNamePopup}
          screenerName={_metaData.title}
          // setScreenerName={screenerNameUpdateHandler}
          createViewNameHandler={createViewNameHandlerHandler}
          screenerEditMode={screenerEditMode}
        />
      )}
      {showModalMessage && (
        <MessagePopupShow
          message={modalBodyText}
          mode="success"
          closePopup={setShowModalMessage}
        />
      )}
      {editQueryScreener && (
        <CreateScreenerModule
          closeModuleScreenerNew={closeModuleScreerHandler}
          runQueryhandler={runQueryHandlerFunPopUp}
          editmode={screenerEditMode}
          cancelScreenerCreate={cancelScreenerCreateFun}
          screenerLoading={screenerLoading}
          setScreenerLoading={setScreenerLoading}
          query={_query}
        />
      )}
      {toasterInvalideQuery && (
        <ToasterPopup
          data={toasterConfirmData}
          messageNCloseBtn="yes"
          errorModule={true}
          toasterCloseHandler={toasterInvalidQueryCloseFun}
        />
      )}
    </>
  );
};

export default StockScreeners;
