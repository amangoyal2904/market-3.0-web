import styles from "./IndicesDetails.module.scss";
import LeftMenuTabs from "../MarketTabs/MenuTabs";
import MarketFiltersTab from "../MarketTabs/MarketFiltersTab";
import MarketTable from "../MarketTable";
import { useStateContext } from "@/store/StateContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCustomViewsTab } from "@/utils/customViewAndTables";
import ToasterPopup from "../ToasterPopup";
import MessagePopupShow from "../MessagePopupShow";
import { fetchViewTable, removePersonalizeViewById } from "@/utils/utility";
import refeshConfig from "@/utils/refreshConfig.json";
import SlickSlider from "../SlickSlider";
import { getCookie } from "@/utils";
import OtherIndicesCard from "./OtherIndicesCard";
import useIntervalApiCall from "@/utils/useIntervalApiCall";
import LiveBlogIndexNews from "./LiveBlogIndexNews";

const IndicesConstituents = React.memo(
  ({
    indexName,
    otherIndices,
    tabData,
    activeViewId,
    tableHeaderData,
    tableData,
    pageSummary,
    tableConfig,
    tabConfig,
    payload,
    indicesNews,
    liveblog,
    pagePath,
  }: any) => {
    const constituentsRef = useRef<HTMLDivElement>(null);

    const indicesResponsive = [
      {
        breakpoint: 2561,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1921,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1601,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1361,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ];

    const { state } = useStateContext();
    const { isPrime, ssoid } = state.login;
    const { currentMarketStatus } = state.marketStatus;
    const [fallbackWebsocket, setFallbackWebsocket] = useState(false);
    const [resetSort, setResetSort] = useState(activeViewId);
    const [_payload, setPayload] = useState(payload);
    const [_tabData, setTabData] = useState(tabData);
    const [_tableData, setTableData] = useState(tableData);
    const [_tableHeaderData, setTableHeaderData] = useState(tableHeaderData);
    const [_pageSummary, setPageSummary] = useState(pageSummary);
    const [_activeViewId, setActiveViewId] = useState(activeViewId);
    const [processingLoader, setProcessingLoader] = useState(false);
    const [toasterPersonaliseViewRemove, setToasterPersonaliseViewRemove] =
      useState(false);
    const [toasterConfirmData, setToasterConfirmData] = useState({});
    const [showModalMessage, setShowModalMessage] = useState(false);
    const [modalBodyText, setModalBodyText] = useState({
      title: "You have Successfully created your personalise view",
    });

    const onTabViewUpdate = async (viewId: any) => {
      setProcessingLoader(true);
      setActiveViewId(viewId);
      setResetSort(viewId);
      setPayload({ ..._payload, viewId: viewId, sort: [], pageno: 1 });
    };

    const onPersonalizeHandlerfun = async (
      newActiveId: any = "",
      mode = "",
    ) => {
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
        L3NavSubItem: "watchlist",
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
      setToasterPersonaliseViewRemove(true);
      const confirmData = {
        title: "Are you sure you want to remove your Personalise View?",
        id: viewId,
      };
      setToasterConfirmData(confirmData);
      console.log("removePersonaliseViewFun", viewId);
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

    const onPaginationChange = async (pageNumber: number) => {
      setProcessingLoader(true);
      setPayload({ ..._payload, pageno: pageNumber });
    };

    const sectorFitlerHandlerChange = async (
      sectorid: any,
      sectorname: any,
    ) => {
      setProcessingLoader(true);
      setResetSort(sectorid);
      setPayload({
        ..._payload,
        sectorId: !!sectorid ? parseInt(sectorid) : null,
        pageno: 1,
      });
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

    const updateTableData = async () => {
      const isPrimeUser = getCookie("isprimeuser") === "true";
      const ssoid = getCookie("ssoid");
      const ticketId = getCookie("TicketId");
      try {
        const responseData: any = await fetchViewTable({
          requestObj: _payload,
          apiType: "MARKETSTATS_INTRADAY",
          isprimeuser: isPrimeUser,
          ssoid: ssoid,
          ticketId: ticketId,
        });

        if (responseData) {
          const { dataList = [], pageSummary = {} } = responseData;

          const newTableData = dataList;
          const newTableHeaderData =
            newTableData.length > 0 && newTableData[0]?.data
              ? newTableData[0].data
              : [];

          setTableData(newTableData);
          setTableHeaderData(newTableHeaderData);
          setPageSummary(pageSummary);

          if (newTableData.length === 0) {
            setTableData([]);
            setTableHeaderData([]);
            setPageSummary({});
          }
        }
      } catch (error) {
        console.error("Error fetching constituents table data:", error);
        // Handle error appropriately if needed
      } finally {
        setProcessingLoader(false);
      }
    };

    useIntervalApiCall(
      () => {
        if (currentMarketStatus === "LIVE" && !!fallbackWebsocket)
          updateTableData();
      },
      refeshConfig.marketstats,
      [_payload, isPrime, currentMarketStatus, fallbackWebsocket],
      constituentsRef,
    );

    useEffect(() => {
      setProcessingLoader(true);
      updateTableData();
    }, [_payload, isPrime]);

    return (
      <>
        <h2 className={styles.heading}>{`${indexName} Constituents`}</h2>
        <div className={styles.wrapper} ref={constituentsRef}>
          <div className="tabsWrap">
            <LeftMenuTabs
              data={_tabData}
              activeViewId={_activeViewId}
              tabsViewIdUpdate={onTabViewUpdate}
              widgetName="Indices"
            />
            <MarketFiltersTab
              data={_tabData}
              tabConfig={tabConfig}
              onPersonalizeHandler={onPersonalizeHandlerfun}
              removePersonaliseView={removePersonaliseViewFun}
              sectorFitlerHandlerChange={sectorFitlerHandlerChange}
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
            l1NavTracking="Markets LIVE"
            l2NavTracking="Indices"
            l3NavTracking={`${indexName} Constituents Widget`}
            setFallbackWebsocket={setFallbackWebsocket}
            socketDataType="stock"
          />
        </div>
        {pagePath !== "/markets/indices/nifty-50" && (
          <LiveBlogIndexNews
            indexName={indexName}
            indicesNews={indicesNews}
            liveblog={liveblog}
          />
        )}
        {!!otherIndices.length && (
          <div className={styles.wrapper}>
            <h2 className={styles.heading}>Other Indices</h2>
            <div id={styles.otherIndices}>
              <SlickSlider
                slides={otherIndices?.map((slides: any, index: any) => ({
                  content: <OtherIndicesCard data={slides} index={index} />,
                }))}
                key={`otherIndices}`}
                sliderId={`slider-otherindices`}
                slidesToShow={5}
                slidesToScroll={1}
                rows={1}
                topSpaceClass="otherIndices"
                responsive={indicesResponsive}
              />
            </div>
          </div>
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
  },
);
IndicesConstituents.displayName = "IndicesConstituents";
export default IndicesConstituents;
