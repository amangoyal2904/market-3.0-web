import styles from "./styles.module.scss";
import MarketFiltersTab from "@/components/MarketTabs/MarketFiltersTab";
import LeftMenuTabs from "@/components/MarketTabs/MenuTabs";
import MarketTable from "@/components/MarketTable";
import { useStateContext } from "@/store/StateContext";
import tabConfig from "@/utils/tabConfig.json";
import tableConfig from "@/utils/tableConfig.json";
import { getCookie, initSSOWidget } from "@/utils";
import { fetchViewTable } from "@/utils/utility";
import { getScreenerTabViewData } from "@/utils/customViewAndTables";

import { useState, useCallback, useEffect } from "react";

const StockEarningsTables = ({
  title,
  tableData = [],
  activeViewId,
  tabData = [],
  tableHeaderData = [],
  pageSummary = {},
  payload = {},
  unixDateTime = new Date(),
}: any) => {
  const _tabConfig = tabConfig["earningSectorTable"];
  const _tableConfig = tableConfig["stocksEarningMainTable"];
  const [_activeViewId, setActiveViewId] = useState(activeViewId);
  const [_tabData, setTabData] = useState(tabData);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
  const [_pageSummary, setPageSummary] = useState(pageSummary);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
  const [resetSort, setResetSort] = useState("");
  const [_payload, setPayload] = useState(payload);
  const [updateDateTime, setUpdateDateTime] = useState(unixDateTime);
  const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
    useState(false);
  const [toasterConfirmData, setToasterConfirmData] = useState({});
  const [modalBodyText, setModalBodyText] = useState({
    title: "You have Successfully created your personalise view",
  });
  const [showModalMessage, setShowModalMessage] = useState(false);
  const { state } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const { currentMarketStatus } = state.marketStatus;

  const stockCount = `(${pageSummary?.totalRecords} Stocks)`;

  const onTabViewUpdate = async (viewId: any) => {
    console.log("___tab view update ", viewId);
    setProcessingLoader(true);
    setActiveViewId(viewId);
    setResetSort(viewId);
    setPayload({ ..._payload, viewId: viewId, sort: [], pageno: 1 });
  };
  const TabsAndTableDataChangeHandler = () => {
    console.log("TabsAndTableDataChangeHandler call here ");
    updateTabData();
  };
  const updateTabData = async () => {
    const { tabData, activeViewId } = await getScreenerTabViewData({
      type: "screenerGetViewById",
      ssoid,
    });
    setTabData(tabData);
    setActiveViewId(activeViewId);
  };
  const onPersonalizeHandlerfun = async (newActiveId: any = "", mode = "") => {
    console.log("__onPersonalizeHandlerfun", newActiveId, mode);
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
  const removePersonaliseViewFun = (viewId: any) => {
    console.log("removePersonaliseViewFun___", viewId);
    setToasterPersonaliseViewRemove(true);
    const confirmData = {
      title: "Are you sure you want to remove your Personalise View?",
      id: viewId,
    };
    setToasterConfirmData(confirmData);
  };
  const updateTableData = async () => {
    const isPrimeUser = getCookie("isprimeuser") === "true";
    const ssoid = getCookie("ssoid");

    try {
      const responseData: any = await fetchViewTable({
        requestObj: _payload,
        apiType: "MARKETSTATS_INTRADAY",
        isprimeuser: isPrimeUser,
        ssoid,
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

        if (newTableData.length === 0) {
          setUpdateDateTime(new Date().getTime());
          setTableData([]);
          setTableHeaderData([]);
          setPageSummary({});
        }
      }
    } catch (error) {
      console.error("Error fetching sector table data:", error);
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
          newSortConfig = [...sortConfig, { field, order: "DESC" }];
        }

        return { ...prevPayload, sort: newSortConfig, pageno: 1 };
      });
    },
    [_payload],
  );
  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [_payload]);
  //console.log({_tableData,_tableHeaderData})
  return (
    <>
      <div className={styles.constWRap}>
        <div className={styles.topSec}>
          <div className={styles.topHead}>
            {title} Constituents <span>{stockCount}</span>
          </div>
          <div className={styles.topSection}>
            <LeftMenuTabs
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
              page="earningSector"
            />
            <MarketFiltersTab
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
              tabsUpdateHandler={TabsAndTableDataChangeHandler}
              tabConfig={_tabConfig}
              onPersonalizeHandler={onPersonalizeHandlerfun}
              removePersonaliseView={removePersonaliseViewFun}
            />
          </div>
          <div className={styles.sectorTableData}>
            <MarketTable
              data={_tableData}
              highlightLtp={
                !!currentMarketStatus && currentMarketStatus != "CLOSED"
              }
              tableHeaders={_tableHeaderData}
              tabsViewIdUpdate={resetSort}
              pageSummary={_pageSummary}
              tableConfig={_tableConfig}
              handleSortServerSide={onServerSideSort}
              handlePageChange={onPaginationChange}
              processingLoader={processingLoader}
              isprimeuser={getCookie("isprimeuser") == "true" ? true : false}
              l1NavTracking="earningSector"
              l2NavTracking={""}
              l3NavTracking={"sectorSingle"}
              setUpdateDateTime={setUpdateDateTime}
              setFallbackWebsocket={setFallbackWebsocket}
              socketDataType="stock"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StockEarningsTables;
