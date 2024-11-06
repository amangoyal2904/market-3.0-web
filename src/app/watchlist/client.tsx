"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import LeftMenuTabs from "@/components/MarketTabs/MenuTabs";
import MarketFiltersTab from "@/components/MarketTabs/MarketFiltersTab";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import {
  removeMultipleStockInWatchList,
  removePersonalizeViewById,
} from "@/utils/utility";
import Blocker from "@/components/Blocker";
import ToasterPopup from "@/components/ToasterPopup";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import refeshConfig from "@/utils/refreshConfig.json";
import styles from "./Watchlist.module.scss";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import { trackingEvent } from "@/utils/ga";
import MarketStatus from "@/components/MarketStatus";
import useIntervalApiCall from "@/utils/useIntervalApiCall";
import toast from "react-hot-toast";
import PrimeBannerExperiment from "@/components/PrimeBannerExperiment";
const MessagePopupShow = dynamic(
  () => import("@/components/MessagePopupShow"),
  { ssr: false }
);

const WatchListClient = () => {
  const [tabData, setTabData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [activeViewId, setActiveViewId] = useState(null);
  const [resetSort, setResetSort] = useState("");
  const [updateDateTime, setUpdateDateTime] = useState({});
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [requestPayload, setRequestPayload] = useState({});
  const [showBlocker, setShowBlocker] = useState(false);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [showTableCheckBox, setShowTableCheckBox] = useState(false);
  const [unFollowStocksList, setUnFollowStocksList] = useState([]);
  const [toasterConfirmBoxShow, setToasterConfirmBoxShow] = useState(false);
  const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
    useState(false);
  const [toasterConfirmData, setToasterConfirmData] = useState({});
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [modalBodyText, setModalBodyText] = useState({
    title: "You have Successfully created your personalise view",
  });
  const { state, dispatch } = useStateContext();
  const { isPrime, isLogin, ssoid, ticketId } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const { watchlist } = state.watchlistStatus;
  const config = tableConfig["watchList"];
  const pageSummary = {};

  const onServerSideSort = useCallback(
    async (field: any) => {
      setProcessingLoader(true);
      setRequestPayload((prevPayload: any) => {
        const sortConfig = prevPayload.sort;
        const isFieldSorted = sortConfig.find(
          (config: any) => config.field === field
        );
        let newSortConfig;

        if (isFieldSorted) {
          newSortConfig = sortConfig.map((config: any) =>
            config.field === field
              ? { ...config, order: config.order === "ASC" ? "DESC" : "ASC" }
              : config
          );
        } else {
          newSortConfig = [{ field, order: "DESC" }];
        }

        return { ...prevPayload, sort: newSortConfig };
      });
    },
    [requestPayload]
  );

  const onTabViewUpdate = async (viewId: any) => {
    if (viewId && viewId != "") {
      setProcessingLoader(true);
      setAPISuccess(true);
      setActiveViewId(viewId);
      setResetSort(viewId);
      setRequestPayload({ ...requestPayload, sort: [], viewId: viewId });
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
    const { tabData, activeViewId } = await getCustomViewsTab({
      L3NavSubItem: "watchlist",
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
  const updateTableData = async () => {
    const bodyParams = requestPayload;

    try {
      const response = await getCustomViewTable({
        bodyParams,
        isprimeuser: true,
        apiType: "MARKETS_CUSTOM_TABLE",
        ssoid,
        ticketId,
      });

      if (response) {
        const {
          tableHeaderData,
          tableData = [],
          unixDateTime = new Date().getTime(),
        } = response;
        if (tableData.length) {
          setUpdateDateTime(unixDateTime);
          setTableData(tableData);
          setTableHeaderData(tableHeaderData);
        } else {
          // Handle case where tableData length is 0
          setUpdateDateTime(new Date().getTime());
          setTableData([]);
          setTableHeaderData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching watchlist table data:", error);
      // Handle error appropriately if needed
    } finally {
      setProcessingLoader(false);
    }
  };

  const fetchWatchListData = async () => {
    setProcessingLoader(true);
    const { tabData, activeViewId } = await getCustomViewsTab({
      L3NavSubItem: "watchlist",
      ssoid: ssoid,
    });

    const bodyParams = {
      type: "STOCK",
      viewId: activeViewId,
      deviceId: "web",
      sort: [],
    };
    const { tableHeaderData, tableData, pageSummary, unixDateTime, payload } =
      await getCustomViewTable({
        bodyParams,
        isprimeuser: true,
        apiType: "MARKETS_CUSTOM_TABLE",
        ssoid,
        ticketId,
      });

    try {
      setTabData(tabData);
      setActiveViewId(activeViewId);
      setTableData(tableData);
      setTableHeaderData(tableHeaderData);
      setUpdateDateTime(unixDateTime);
      setAPISuccess(true);
      setRequestPayload(payload);
    } catch (e) {
      setTabData([]);
      setActiveViewId(null);
      setTableData([]);
      setTableHeaderData([]);
      setUpdateDateTime(new Date().getTime());
      setAPISuccess(true);
      setRequestPayload({});
    } finally {
      setProcessingLoader(false);
    }
  };
  const toasterRemovePersonaliseViewCloseHandlerFun = async (
    value: boolean,
    data: any
  ) => {
    console.log(
      "toasterRemovePersonaliseViewCloseHandlerFun",
      value,
      "___data",
      data
    );
    setToasterPersonaliseViewRemove(false);
    if (value && data && data.id && data.id !== "") {
      const removeViewById = await removePersonalizeViewById(data?.id);
      console.log("removeViewById", removeViewById);
      onPersonalizeHandlerfun();
    }
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
  const toasterCloseHandlerFun = async (value: boolean) => {
    //console.log('getValue',value);
    const userConfirm = value || false;
    const removedStocks = [...unFollowStocksList];
    setToasterConfirmBoxShow(false);
    if (userConfirm) {
      const responseData = await removeMultipleStockInWatchList(removedStocks);
      const response = responseData[0];
      if (response.statusCode === 200) {
        const updatedWatchlist = watchlist.filter(
          (watchlistItem: any) =>
            !removedStocks.some(
              (removedStock: any) =>
                removedStock.stock.id === watchlistItem.companyId &&
                removedStock.stock.companyType === watchlistItem.companyType
            )
        );
        dispatch({
          type: "UPDATE_MSID",
          payload: {
            watchlist: updatedWatchlist,
          },
        });

        setShowTableCheckBox(false);
        setUnFollowStocksList([]);
        onTabViewUpdate(activeViewId);
      } else {
        toast((t) => (
          <span className="errorToast">
            <span>
              Oops! There is some error while removing the stocks from
              Watchlist. Please retry.
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <i className="eticon_cross"></i>
            </button>
          </span>
        ));
      }
    } else {
      setUnFollowStocksList([]);
      setShowTableCheckBox(false);
    }
  };
  const editRemoveStockBtnReset = () => {
    setUnFollowStocksList([]);
    setShowTableCheckBox(false);
  };
  const removeMultipleStockInWathclist = async () => {
    if (unFollowStocksList.length > 0) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: "remove",
      });
      setToasterConfirmBoxShow(true);
    } else {
      setShowTableCheckBox(false);
    }
  };

  const multipleStockCollect = (e: any, companyId: any, assetType: any) => {
    const checkInput = e.target.checked;
    const data = {
      action: checkInput ? 0 : 1, // If checked, action is 0 (add), else 1 (remove)
      stock: {
        id: companyId,
        companyType: assetType,
      },
    };
    if (checkInput) {
      setUnFollowStocksList((prevList): any => [...prevList, data]);
    } else {
      setUnFollowStocksList((prevList): any =>
        prevList.filter((item: any) => item.msid !== companyId)
      );
    }
  };

  const updateTableHandlerFun = () => {
    setProcessingLoader(true);
    onTabViewUpdate(activeViewId);
  };

  useEffect(() => {
    if (isLogin === true) {
      fetchWatchListData();
      setShowBlocker(false);
    } else if (isLogin === false) {
      setShowBlocker(true);
    }
  }, [isLogin]);

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [requestPayload]);

  useIntervalApiCall(
    () => {
      if (currentMarketStatus === "LIVE" && !!fallbackWebsocket)
        updateTableData();
    },
    refeshConfig.watchlist,
    [requestPayload, isPrime, currentMarketStatus, fallbackWebsocket]
  );

  return (
    <>
      {isLogin ? (
        <div className="dflex align-item-center">
          <h1 className={`${styles.heading} ${styles.withRBorder}`}>
            Watchlist
          </h1>
          <MarketStatus
            currentMarketStatus={currentMarketStatus}
            dateTime={updateDateTime}
            withSpace={true}
          />
        </div>
      ) : (
        <h1 className={styles.heading}>Watchlist</h1>
      )}

      <p className={styles.desc}>
        My Watchlist: Check you stocks last &amp; recent price on The ET
        Markets. Get all the latest information about your stocks, prev. close,
        stocks price change, stocks percentage change, low &amp; High stocks and
        more.
      </p>
      {!isPrime && (
        <PrimeBannerExperiment
          pageName="Mercury_Watchlist"
          pageId="watchlist"
        />
      )}
      <div className={styles.watclistContainer}>
        {showBlocker ? (
          <Blocker type="loginBlocker" />
        ) : (
          <>
            {!!isLogin && (
              <div className="tabsWrap">
                <LeftMenuTabs
                  data={tabData}
                  activeViewId={activeViewId}
                  tabsViewIdUpdate={onTabViewUpdate}
                  widgetName="Watchlist"
                />
                <MarketFiltersTab
                  data={tabData}
                  activeViewId={activeViewId}
                  tabsViewIdUpdate={onTabViewUpdate}
                  tabsUpdateHandler={onTabViewUpdate}
                  setShowTableCheckBox={setShowTableCheckBox}
                  showTableCheckBox={showTableCheckBox}
                  removeMultipleStockInWathclist={
                    removeMultipleStockInWathclist
                  }
                  tabConfig={tabConfig["watchList"]}
                  onPersonalizeHandler={onPersonalizeHandlerfun}
                  updateTableHandler={updateTableHandlerFun}
                  watchlistDataLength={tableData?.length}
                  removePersonaliseView={removePersonaliseViewFun}
                  editRemoveStockBtnReset={editRemoveStockBtnReset}
                />
              </div>
            )}
            <MarketTable
              data={tableData}
              highlightLtp={
                !!currentMarketStatus && currentMarketStatus != "CLOSED"
              }
              tableHeaders={tableHeaderData}
              tabsViewIdUpdate={resetSort}
              handleSortServerSide={onServerSideSort}
              apiSuccess={apiSuccess}
              showTableCheckBox={showTableCheckBox}
              multipleStockCollect={multipleStockCollect}
              pageSummary={pageSummary}
              tableConfig={config}
              updateTableHandler={updateTableHandlerFun}
              processingLoader={processingLoader}
              isprimeuser={isPrime}
              l1NavTracking="Markets"
              l2NavTracking="Watchlist"
              setUpdateDateTime={setUpdateDateTime}
              setFallbackWebsocket={setFallbackWebsocket}
              socketDataType="stock"
            />
          </>
        )}
      </div>
      {toasterConfirmBoxShow && (
        <ToasterPopup
          data={toasterConfirmData}
          toasterCloseHandler={toasterCloseHandlerFun}
        />
      )}
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

export default WatchListClient;
