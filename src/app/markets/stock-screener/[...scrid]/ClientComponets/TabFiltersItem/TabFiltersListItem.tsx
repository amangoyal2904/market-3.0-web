import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { useStateContext } from "../../../../../../store/StateContext";
import PersonaliseModel from "../../../../../../components/PersonaliseModel/index";
import CreateNewViewComponent from "../../../../../../components/CreateNewView/index";
import StockFilterNifty from "../../../../../../components/StockFilterNifty/index";
import APIS_CONFIG from "../../../../../../network/api_config.json";
import { APP_ENV } from "../../../../../../utils/index";
import CreateScreenerModule from "../CreateScreenerModule/CreateScreener";

const TabFiltersItemList = ({
  data = {},
  personalize = false,
  editStock = false,
  addStock = false,
  exportIcon = false,
  createScreener = false,
  niftyFitler = false,
  niftyFilterData = {},
  dayFilter = false,
  dayFilterValueset = {},
  setShowTableCheckBox,
  showTableCheckBox,
  removeMultipleStockInWathclist,
  tabsUpdateHandler,
  filterDataChange,
}: any) => {
  const personaliseDataListItem =
    data && data.length > 0
      ? data.filter((item: any) => item.viewId !== 239)
      : [];
  const [niftyFilterMenu, showNiftyFilterMenu] = useState(false);
  const [openPersonaliseModal, setOpenPersonaliseModal] = useState(false);
  const [openPersonaliseCreateModal, setOpenPersonaliseCreateModal] =
    useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [createModuleScreener, setCreateModuleScreener] = useState(false);
  const [editMode, setEditMode] = useState({ mode: false, viewId: "" });
  const [screenerEditMode, setScreenerEditMode] = useState({
    mode: false,
    viewId: "",
  });
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const { state } = useStateContext();
  const { isLogin } = state.login;
  const dayFilterHandler = () => {
    console.log("click dayFilterHandler fun");
  };
  const addStockHandler = () => {
    console.log("click addStockHandler fun");
  };
  const userPersonaliseHandle = () => {
    if (isLogin) {
      setOpenPersonaliseModal(true);
    } else {
      alert("Please login to first");
    }
  };
  const closeModuleScreerHandler = () => {
    setCreateModuleScreener(false);
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
  const showFilterMenu = (value: boolean) => {
    console.log("eys click", value);
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
  const tabsUpdateHandlerScreener = (viewId: any) => {
    console.log("tabsUpdateHandler fnctoin call", viewId);
    alert(viewId);
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
    if (niftyFitler) {
      filterApiCall();
    }
  }, []);
  return (
    <>
      <div className={styles.rightSide}>
        {dayFilter ? (
          <div
            className={`${styles.roundBtn} ${styles.fitlerDay}`}
            onClick={() => dayFilterHandler()}
          >
            {dayFilterValueset?.label || "testValue"}
          </div>
        ) : (
          ""
        )}

        {addStock ? (
          <span
            className={`${styles.btnStock} ${styles.stockBtn}`}
            onClick={addStockHandler}
          >
            + Add Stocks
          </span>
        ) : (
          ""
        )}

        {editStock ? (
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
        {createScreener ? (
          <span
            className={`${styles.filterScreener}`}
            onClick={() => setCreateModuleScreener(true)}
          >
            + Create Screeners
          </span>
        ) : (
          ""
        )}
        {niftyFitler ? (
          <span
            className={`${styles.roundBtn} ${styles.filterNseBse}`}
            onClick={() => setShowFilter(true)}
          >
            {niftyFilterData?.name || "NiftyFilterName"}
          </span>
        ) : (
          ""
        )}

        {personalize ? (
          <span
            className={`${styles.roundBtn} ${styles.editBtnPencil}`}
            onClick={() => userPersonaliseHandle()}
          >
            Personalise
          </span>
        ) : (
          ""
        )}

        {exportIcon ? (
          <span className={`${styles.roundBtn} ${styles.exportIcon}`}>
            Export
          </span>
        ) : (
          ""
        )}
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

      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChagneData}
          selectTab={niftyFilterData.slectedTab}
          childMenuTabActive={niftyFilterData.id}
        />
      )}

      {createModuleScreener ? (
        <CreateScreenerModule
          closeModuleScreenerNew={closeModuleScreerHandler}
          tabsUpdateHandler={tabsUpdateHandlerScreener}
          editmode={screenerEditMode}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default TabFiltersItemList;
