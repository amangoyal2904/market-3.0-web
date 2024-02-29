"use client";
import { useState, useEffect } from "react";

import styles from "./MarketTabs.module.scss";

import PersonaliseModel from "../PersonaliseModel/index";
import CreateNewViewComponent from "../CreateNewView/index";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import AddStockComponent from "../StockAdd/index";
import { useStateContext } from "../../store/StateContext";
import StockFilterNifty from "../StockFilterNifty/index";
import DayFitler from "../DayFilter/index";
import CreateScreenerModule from "../CreateScreenerModule/CreateScreener";

const MarketFiltersTab = ({
  data,
  setShowTableCheckBox,
  showTableCheckBox,
  removeMultipleStockInWathclist,
  niftyFilterData = {},
  filterDataChange,
  dayFitlerHanlderChange,
  tabConfig,
  runQueryhandler,
  updateTableHander,
  onPersonalizeHandler,
  dayFilterData,
  setDayFilterData,
}: any) => {
  const {
    showAddStock,
    showEditStock,
    showIndexFilter,
    showDuration,
    showPersonalize,
    showExport,
    showCreateScreener,
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
  const [loading, setLoading] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [createModuleScreener, setCreateModuleScreener] = useState(false);
  const [screenerEditMode, setScreenerEditMode] = useState({
    mode: false,
    viewId: "",
  });
  const { state } = useStateContext();
  const { isLogin } = state.login;
  const closeModuleScreerHandler = () => {
    setCreateModuleScreener(false);
  };
  const userPersonaliseHandle = () => {
    if (isLogin) {
      setOpenPersonaliseModal(true);
    } else {
      alert("Please login to first");
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
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.updateTabs[APP_ENV];
    // const apiUrl = 'https://qcbselivefeeds.indiatimes.com/screener/saveOrderViewWatch';
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
      //alert(resData.response);
      onPersonalizeHandler();
    } else {
      alert("some error please check api or code");
    }
  };

  const addStockHandler = () => {
    setAddStockShow(true);
  };
  const dayFilterHandler = () => {
    console.log("you write here you filer rule");
    setDayFilterShow(true);
  };
  const filterChangeHandler = (value: any, label: any) => {
    const filterDataSet = { value, label };
    setDayFilterData(filterDataSet);
    dayFitlerHanlderChange(value, label);
    setDayFilterShow(false);
  };
  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChagneData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    sessionStorage.setItem("sr_filtervalue", id);
    sessionStorage.setItem("sr_filtername", name);
    sessionStorage.setItem("sr_filtertab", selectedTab);
    //setFilterMenuTxtShow({ name: name, id: id, selectedTab: selectedTab });
    filterDataChange(id, name, selectedTab);
  };
  const filterApiCall = () => {
    try {
      fetch(
        "https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson",
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log("error filer data is not fetch");
          }
        })
        .then((data) => {
          setFilterMenuData(data);
        })
        .catch((err) => {
          console.log("get error", err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (showIndexFilter) {
      filterApiCall();
    }
  }, []);
  // ====  Here only Filter tabs code end  here
  return (
    <>
      <div className={styles.rightSide}>
        {showCreateScreener ? (
          <span
            className={`${styles.filterScreener}`}
            onClick={() => setCreateModuleScreener(true)}
          >
            + Create Screeners
          </span>
        ) : (
          ""
        )}
        {showIndexFilter ? (
          <span
            className={`${styles.roundBtn} ${styles.filterNseBse}`}
            onClick={() => showFilterMenu(true)}
          >
            <i className={`eticon_filter ${styles.mr}`}></i>{" "}
            {niftyFilterData?.name}
          </span>
        ) : (
          ""
        )}
        {showDuration ? (
          <div
            className={`${styles.roundBtn} ${styles.fitlerDay}`}
            onClick={() => dayFilterHandler()}
          >
            {dayFilterData.label} <i className="eticon_caret_down"></i>
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

        {showEditStock ? (
          <>
            {showTableCheckBox ? (
              <span
                className={styles.btnStock}
                onClick={removeMultipleStockInWathclist}
              >
                Remove
              </span>
            ) : (
              <span
                className={styles.btnStock}
                onClick={() => setShowTableCheckBox(true)}
              >
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
            Export <i className={`eticon_caret_down ${styles.ml}`}></i>
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
        />
      ) : (
        ""
      )}
      {addStockShow ? (
        <AddStockComponent
          moduelClose={setAddStockShow}
          updateTableHander={updateTableHander}
        />
      ) : null}
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChagneData}
          selectTab={niftyFilterData.selectedTab}
          childMenuTabActive={niftyFilterData.id}
        />
      )}
      {dayFilterShow ? (
        <DayFitler
          setDayFilterShow={setDayFilterShow}
          selectedDay={dayFilterData}
          filterHandler={filterChangeHandler}
        />
      ) : (
        ""
      )}
      {createModuleScreener ? (
        <CreateScreenerModule
          closeModuleScreenerNew={closeModuleScreerHandler}
          runQueryhandler={runQueryhandler}
          editmode={screenerEditMode}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default MarketFiltersTab;
