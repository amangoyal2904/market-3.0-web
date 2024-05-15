"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import styles from "./MarketTabs.module.scss";

const PersonaliseModel = dynamic(
  () => import("@/components/PersonaliseModel"),
  { ssr: false },
);
import CreateNewViewComponent from "@/components/CreateNewView";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV, initSSOWidget } from "@/utils";
import AddStockComponent from "@/components/StockAdd";
import { useStateContext } from "@/store/StateContext";
import StockFilterNifty from "@/components/StockFilterNifty";
import DayFitler from "@/components/DayFilter";
import { fetchFilters } from "@/utils/utility";
import SectorFilter from "../DayFilter/SectorFilter";
import { trackingEvent } from "@/utils/ga";

const IndustryFilter = dynamic(() => import("@/components/IndustryFilter"), {
  loading: () => (
    <div className="customLoader">
      <div className="loading">
        <div className="loader"></div>
      </div>
    </div>
  ),
});

const MarketFiltersTab = React.memo(
  ({
    data,
    setShowTableCheckBox,
    showTableCheckBox,
    removeMultipleStockInWathclist,
    niftyFilterData = {},
    filterDataChange,
    dayFitlerHanlderChange,
    sectorFitlerHandlerChange,
    tabConfig,
    updateTableHandler,
    onPersonalizeHandler,
    dayFilterData,
    setDayFilterData,
    watchlistDataLength = 0,
    removePersonaliseView,
    createNewScreener,
    getIndustryFilterValue,
    intradayDurationOptions,
    editRemoveStockBtnReset,
  }: any) => {
    const {
      showAddStock,
      showEditStock,
      showIndexFilter,
      showSectorFilter,
      showPersonalize,
      showExport,
      showCreateScreener,
      showIndustryFilter,
    } = tabConfig;
    const personaliseDataListItem =
      data && data.length > 0
        ? data.filter((item: any, index: number) => index !== 0)
        : [];
    const [openPersonaliseModal, setOpenPersonaliseModal] = useState(false);
    const [addStockShow, setAddStockShow] = useState(false);
    const [openPersonaliseCreateModal, setOpenPersonaliseCreateModal] =
      useState(false);
    const [editMode, setEditMode] = useState({ mode: false, viewId: "" });
    const [showFilter, setShowFilter] = useState(false);
    const [dayFilterShow, setDayFilterShow] = useState(false);
    const [sectorFilterShow, setSectorFilterShow] = useState(false);
    const [sectorFilterData, setSectorFilterData] = useState({
      sectorname: "All Sectors",
      sectorid: 0,
    });
    const [loading, setLoading] = useState(false);
    const [filterMenuData, setFilterMenuData]: any = useState("");

    const [industryFilterShow, setIndustryFilterShow] = useState(false);
    const [checkedIndustryFilterItems, setCheckedIndustryFilterItems]: any[] =
      useState([]);
    const { state } = useStateContext();
    const { isLogin } = state.login;
    const userCustomeViewNo =
      data && data.length > 0
        ? data.filter((item: any) => item.viewType === "USER").length + 1
        : 0;
    const userPersonaliseHandle = () => {
      typeof editRemoveStockBtnReset != "undefined" &&
        editRemoveStockBtnReset();
      if (isLogin) {
        document.body.style.overflow = "hidden";
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "page_cta_click",
          event_label: "personalize",
        });
        setOpenPersonaliseModal(true);
      } else {
        initSSOWidget();
      }
    };
    const industrySelectedFilterHanlder = (event: any) => {
      const { id, checked } = event.target;
      if (checked) {
        const getValue = [...checkedIndustryFilterItems, parseFloat(id)];
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "industry_filter_applied",
          event_label: getValue,
        });
        setCheckedIndustryFilterItems(getValue);
        getIndustryFilterValue(getValue);
      } else {
        const getValue = checkedIndustryFilterItems.filter(
          (item: any) => item !== parseFloat(id),
        );
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "industry_filter_applied",
          event_label: getValue,
        });
        setCheckedIndustryFilterItems(getValue);
        getIndustryFilterValue(getValue);
      }
    };
    const updateTabsListDataHandler = async (updateData: any) => {
      const updatedOrder: any[] = [];
      updateData.map((item: any) => {
        return updatedOrder.push({
          selectedFlag: item.selectedFlag,
          viewId: item.viewId,
        });
      });
      const ssoid = window.objUser?.ssoid;
      const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.updateTabs[
        APP_ENV
      ];
      const bodyPost = {
        ssoId: ssoid,
        views: updatedOrder,
      };
      setLoading(true);
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ssoid: ssoid,
        },
        body: JSON.stringify(bodyPost),
      });
      setLoading(false);
      const resData = await res.json();
      console.log("resdata", resData);
      if (resData && resData.responseCode === 200) {
        setOpenPersonaliseModal(false);
        document.body.style.overflow = "";
        //alert(resData.response);
        onPersonalizeHandler();
      } else {
        alert("some error please check api or code");
      }
    };
    const industryCloseModule = () => {
      console.log("helo");
      setIndustryFilterShow(false);
    };
    const addStockHandler = () => {
      editRemoveStockBtnReset();
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: "add stock",
      });
      setAddStockShow(true);
    };
    const editStockHandler = () => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: "edit",
      });
      setShowTableCheckBox(true);
    };
    const dayFilterHandler = () => {
      setDayFilterShow(true);
    };

    const sectorFilterHandler = () => {
      setSectorFilterShow(true);
    };

    const sectorFilterChangeHandler = (
      sectorid: number,
      sectorname: string,
    ) => {
      const filterDataSet = { sectorid, sectorname };
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "sector_filter_applied",
        event_label: sectorname,
      });
      setSectorFilterData(filterDataSet);
      sectorFitlerHandlerChange(sectorid, sectorname);
      setSectorFilterShow(false);
    };

    const filterChangeHandler = (value: any, label: any) => {
      const filterDataSet = { value, label };
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "duration_filter_applied",
        event_label: label,
      });
      setDayFilterData(filterDataSet);
      dayFitlerHanlderChange(value, label);
      setDayFilterShow(false);
    };
    // ====  Here only Filter tabs code start here
    const showFilterMenu = (value: boolean) => {
      setShowFilter(value);
      if (value) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    };
    const handleChangeData = (id: any, name: string, selectedTab: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "index_filter_applied",
        event_label: name,
      });
      setShowFilter(false);
      filterDataChange(id, name, selectedTab);
      document.body.style.overflow = "";
    };
    const filterApiCall = async () => {
      const data = await fetchFilters({ all: true, marketcap: true });
      setFilterMenuData(data);
    };
    useEffect(() => {
      if (showIndexFilter) {
        filterApiCall();
      }
    }, []);
    // ====  Here only Filter tabs code end  here
    //console.log('watchlistDataLength',watchlistDataLength)
    return (
      <>
        <div className={styles.rightSide}>
          {showCreateScreener ? (
            <span
              className={`${styles.filterScreener}`}
              onClick={() => createNewScreener(true)}
            >
              + Create Screeners
            </span>
          ) : (
            ""
          )}
          {showIndustryFilter ? (
            <span className={`${styles.roundBtn} ${styles.industryFiler}`}>
              <span
                className={styles.filterInner}
                onClick={() => setIndustryFilterShow(true)}
              >
                Industry<i className="eticon_caret_down"></i>
              </span>
              {industryFilterShow ? (
                <IndustryFilter
                  industrySelectedFilter={industrySelectedFilterHanlder}
                  defaultCheck={checkedIndustryFilterItems}
                  onclose={industryCloseModule}
                />
              ) : (
                ""
              )}
            </span>
          ) : (
            ""
          )}
          {showSectorFilter ? (
            <div className="prel">
              <span
                className={`${styles.roundBtn} ${styles.fitlerDay}`}
                onClick={() => sectorFilterHandler()}
              >
                {sectorFilterData.sectorname}
                <i className="eticon_caret_down"></i>
              </span>
              {sectorFilterShow ? (
                <SectorFilter
                  setSectorFilterShow={setSectorFilterShow}
                  sectorFilterData={sectorFilterData}
                  sectorFilterHandler={sectorFilterChangeHandler}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {showIndexFilter ? (
            <span
              className={`${styles.roundBtn} ${styles.filterNseBse}`}
              onClick={() => showFilterMenu(true)}
            >
              <i className={`eticon_filter ${styles.mr}`}></i>
              {niftyFilterData?.name}
            </span>
          ) : (
            ""
          )}
          {!!intradayDurationOptions && intradayDurationOptions.length ? (
            <div className="prel">
              <span
                className={`${styles.roundBtn} ${styles.fitlerDay}`}
                onClick={() => dayFilterHandler()}
              >
                {dayFilterData.label}
                <i className="eticon_caret_down"></i>
              </span>
              {dayFilterShow ? (
                <DayFitler
                  setDayFilterShow={setDayFilterShow}
                  selectedDay={dayFilterData}
                  filterHandler={filterChangeHandler}
                  intradayDurationOptions={intradayDurationOptions}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {showAddStock ? (
            <span
              className={`${styles.btnStock} ${styles.stockBtn}`}
              onClick={addStockHandler}
            >
              <i className={`${styles.icons} eticon_add`}></i>Add Stocks
            </span>
          ) : (
            ""
          )}
          {showEditStock && watchlistDataLength > 0 ? (
            <>
              {showTableCheckBox ? (
                <span
                  className={styles.btnStock}
                  onClick={removeMultipleStockInWathclist}
                >
                  Remove
                </span>
              ) : (
                <span className={styles.btnStock} onClick={editStockHandler}>
                  <i className={`${styles.icons} eticon_edit`}></i>Edit
                </span>
              )}
            </>
          ) : (
            ""
          )}
          {showPersonalize ? (
            <span
              className={styles.roundBtn}
              onClick={() => userPersonaliseHandle()}
            >
              Personalise
            </span>
          ) : null}
          {showExport ? (
            <span className={styles.roundBtn}>
              Export<i className={`eticon_caret_down ${styles.ml}`}></i>
            </span>
          ) : null}
        </div>
        {openPersonaliseModal ? (
          <PersonaliseModel
            editmode={setEditMode}
            openPersonaliseModal={openPersonaliseModal}
            data={personaliseDataListItem}
            setOpenPersonaliseModal={setOpenPersonaliseModal}
            updateTabsListDataHandler={updateTabsListDataHandler}
            createNewViewHandler={setOpenPersonaliseCreateModal}
            loading={loading}
            setloading={setLoading}
          />
        ) : (
          ""
        )}
        {openPersonaliseCreateModal ? (
          <CreateNewViewComponent
            closePopCreateView={setOpenPersonaliseCreateModal}
            onPersonalizeHandler={onPersonalizeHandler}
            editmode={editMode}
            removePersonaliseView={removePersonaliseView}
            userCustomeViewNo={userCustomeViewNo}
          />
        ) : (
          ""
        )}
        {addStockShow ? (
          <AddStockComponent
            moduelClose={setAddStockShow}
            updateTableHandler={updateTableHandler}
          />
        ) : null}
        {showFilter && (
          <StockFilterNifty
            data={filterMenuData}
            onclick={showFilterMenu}
            showFilter={showFilter}
            valuechange={handleChangeData}
            selectTab={niftyFilterData.exchange}
            childMenuTabActive={niftyFilterData.indexId}
          />
        )}
      </>
    );
  },
);
MarketFiltersTab.displayName = "MarketFiltersTab";
export default MarketFiltersTab;
