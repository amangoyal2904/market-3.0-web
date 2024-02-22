"use client";
import { useState, useRef, useEffect } from "react";

import styles from "./MarketTabs.module.scss";

import PersonaliseModel from "../PersonaliseModel/index";
import CreateNewViewComponent from "../CreateNewView/index";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import AddStockComponent from "../../components/StockAdd/index";
import { useStateContext } from "../../store/StateContext";
import StockFilterNifty from "../StockFilterNifty/index";
import DayFitler from "../DayFilter/index";

const MarketTabs = ({
  data,
  activeViewId,
  tabsViewIdUpdate,
  tabsUpdateHandler,
  setShowTableCheckBox,
  showTableCheckBox,
  removeMultipleStockInWathclist,
  niftyFilterData = {},
  filterDataChange,
  dayFitlerHanlderChange,
  tabConfig,
}: any) => {
  const {
    showAddStock,
    showEditStock,
    showIndexFilter,
    showDuration,
    showPersonalize,
    showExport,
  } = tabConfig;
  const personaliseDataListItem =
    data && data.length > 0
      ? data.filter((item: any) => item.viewId !== 239)
      : [];
  const tabDataFilter =
    data && data.length > 0
      ? data.filter((item: any) => item.selectedFlag)
      : [];
  const [openPersonaliseModal, setOpenPersonaliseModal] = useState(false);
  const [addStockShow, setAddStockShow] = useState(false);
  const [openPersonaliseCreateModal, setOpenPersonaliseCreateModal] =
    useState(false);
  const [editMode, setEditMode] = useState({ mode: false, viewId: "" });
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [dayFilterShow, setDayFilterShow] = useState(false);
  const [dayFilterValueset, setDayFilterValueset] = useState({
    value: "1d",
    label: "1 Day",
  });
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const { state } = useStateContext();
  const { isLogin } = state.login;

  const tabClick = (viewId: any) => {
    tabsViewIdUpdate(viewId);
  };
  const userPersonaliseHandle = () => {
    if (isLogin) {
      setOpenPersonaliseModal(true);
    } else {
      alert("Please login to first");
    }
  };
  const updateTabsListDataHandler = async (updateData: any) => {
    //console.log('update data', updateData);
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
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ssoid: ssoid,
      },
      body: JSON.stringify(bodyPost),
    });
    const resData = await res.json();
    console.log("resdata", resData);
    if (resData && resData.responseCode === 200) {
      setOpenPersonaliseModal(false);
      //alert(resData.response);
      tabsUpdateHandler();
    } else {
      alert("some error please check api or code");
    }
  };
  const tabDataFitlerBaseOnWidth = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth;
    if (tabsListWidth != null) {
      let currentWidth = 0;
      const filterData =
        data.length > 0 ? data.filter((item: any) => item.selectedFlag) : [];
      const newVisibleTabs: any[] = [];
      const newHiddenTabs: any[] = [];
      for (const tab of filterData) {
        const tabWidth = tab.name.length * 10; // Adjust the width calculation as per your requirement
        if (currentWidth + tabWidth < tabsListWidth) {
          newVisibleTabs.push(tab);
          currentWidth += tabWidth;
        } else {
          newHiddenTabs.push(tab);
        }
      }
      setVisibleTabs(newVisibleTabs);
      setHiddenTabs(newHiddenTabs);
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
    setDayFilterValueset(filterDataSet);
    dayFitlerHanlderChange(value, label);
    setDayFilterShow(false);
    // const url = `${pathname}?${searchParams}`
    // const newDuration = value.toLowerCase();
    // const newUrl = url.replace(/duration=[^&]*/, "duration=" + newDuration);

    // router.push(newUrl,{scroll: false})
  };
  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    sessionStorage.setItem("sr_filtervalue", id);
    sessionStorage.setItem("sr_filtername", name);
    sessionStorage.setItem("sr_filtertab", slectedTab);
    //setFilterMenuTxtShow({ name: name, id: id, slectedTab: slectedTab });
    filterDataChange(id, name, slectedTab);
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
  useEffect(() => {
    const handleResize = () => {
      const tabsListWidth = tabsListRef.current?.offsetWidth;
      if (tabsListWidth != null) {
        const actualTabListWith = tabsListWidth - 400;
        const visibleTabsWidth = visibleTabs.reduce((totalWidth, tab) => {
          return totalWidth + tab.offsetWidth;
        }, 0);
        const hiddenTabsWidth = hiddenTabs.reduce((totalWidth, tab) => {
          return totalWidth + tab.offsetWidth;
        }, 0);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [visibleTabs, hiddenTabs]);
  useEffect(() => {
    tabDataFitlerBaseOnWidth();
  }, [data]);
  //console.log('visibleTabs',visibleTabs)
  //console.log('hiddenTabs',hiddenTabs)
  return (
    <>
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList} ref={tabsListRef}>
          {visibleTabs.map((item: any, index: number) => {
            return (
              <li
                key={item.id}
                onClick={() => tabClick(item.viewId)}
                className={activeViewId === item.viewId ? styles.active : ""}
              >
                {item.name}
              </li>
            );
          })}
          {hiddenTabs && hiddenTabs.length > 0 ? (
            <li className={styles.moreTabsListData}>
              <div className={styles.moreTabWrap}>
                <div className={styles.moreSec}>
                  More{" "}
                  <span
                    className={`eticon_caret_down ${styles.moreCaretDown}`}
                  ></span>
                </div>
                <ul className={styles.moreListItem}>
                  {hiddenTabs.map((item: any, index: number) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => tabClick(item.viewId)}
                        className={
                          activeViewId === item.viewId ? styles.active : ""
                        }
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ) : null}
        </ul>
        <div className={styles.rightSide}>
          {showIndexFilter ? (
            <span
              className={`${styles.roundBtn} ${styles.filterNseBse}`}
              onClick={() => showFilterMenu(true)}
            >
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
              {dayFilterValueset.label}
            </div>
          ) : (
            ""
          )}
          {showAddStock ? (
            <span
              className={`${styles.btnStock} ${styles.stockBtn}`}
              onClick={addStockHandler}
            >
              + Add Stocks
            </span>
          ) : (
            ""
          )}

          {showEditStock ? (
            <>
              {showTableCheckBox ? (
                <span
                  className={`${styles.btnStock} ${styles.stockModifyBtn}`}
                  onClick={removeMultipleStockInWathclist}
                >
                  Remove
                </span>
              ) : (
                <span
                  className={`${styles.btnStock} ${styles.stockModifyBtn}`}
                  onClick={() => setShowTableCheckBox(true)}
                >
                  Edit
                </span>
              )}
            </>
          ) : (
            ""
          )}
          {showPersonalize ? (
            <span
              className={`${styles.roundBtn} ${styles.editBtnPencil}`}
              onClick={() => userPersonaliseHandle()}
            >
              Personalise
            </span>
          ) : null}
          {showExport ? (
            <span className={`${styles.roundBtn} ${styles.exportIcon}`}>
              Export
            </span>
          ) : null}
        </div>
      </div>
      {openPersonaliseModal ? (
        <PersonaliseModel
          editmode={setEditMode}
          openPersonaliseModal={openPersonaliseModal}
          data={personaliseDataListItem}
          setOpenPersonaliseModal={setOpenPersonaliseModal}
          updateTabsListDataHandler={updateTabsListDataHandler}
          createNewViewHandler={setOpenPersonaliseCreateModal}
        />
      ) : (
        ""
      )}
      {openPersonaliseCreateModal ? (
        <CreateNewViewComponent
          closePopCreateView={setOpenPersonaliseCreateModal}
          tabsUpdateHandler={tabsUpdateHandler}
          editmode={editMode}
        />
      ) : (
        ""
      )}
      {addStockShow ? (
        <AddStockComponent moduelClose={setAddStockShow} />
      ) : null}
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChagneData}
          selectTab={niftyFilterData.slectedTab}
          childMenuTabAcive={niftyFilterData.id}
        />
      )}
      {dayFilterShow ? (
        <DayFitler
          setDayFilterShow={setDayFilterShow}
          selectedDay={dayFilterValueset}
          filterHandler={filterChangeHandler}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default MarketTabs;
