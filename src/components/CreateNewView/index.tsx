import styles from "./CreateNewView.module.scss";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import NameViewComponent from "./createmodule";
import ToasterPopup from "../ToasterPopup/OnlyInfo";
import ToasterPopupConfirm from "../ToasterPopup/ConfirmBox";
import { trackingEvent } from "@/utils/ga";
import service from "@/network/service";

const CreateNewViewComponent = ({
  closePopCreateView,
  editmode,
  onPersonalizeHandler,
  removePersonaliseView,
  userCustomeViewNo,
}: any) => {
  const [viewData, setViewData]: any = useState([]);
  const [screenerName, setScreenerName]: any = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchNode, setSearchNode] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchListItems, setSearchListItems] = useState([]);
  const [selectedView, setSelectedView]: any = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const viewWraperRef = useRef<HTMLDivElement>(null);
  const [viewNameModule, setViewNameModule] = useState(false);
  const [sateUpdate, setSateUpdate] = useState(true);
  const [userTouchField, setUserTouchField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [showToaster, setShowToaster] = useState(false);
  const [showToasterConfirm, setShowToasterConfirm] = useState(false);

  //console.log("showToaster", showToaster);
  const [toasterData, setToasterData] = useState({
    title: "",
    errorModule: "",
  });
  const [toasterDataConfirmBox, setToasterDataConfirmBox] = useState({
    title: "",
    errorModule: "",
    yes: "",
    no: "",
    action: "",
  });
  const closeToaster = () => {
    setShowToaster(false);
  };
  const closeToasterConfirm = () => {
    setShowToasterConfirm(false);
  };
  const CreateViewNameModalClose = () => {
    if (userTouchField) {
      setShowToasterConfirm(true);
      setToasterDataConfirmBox({
        title: "Do you want to save the changes made?",
        errorModule: "error",
        yes: "Yes ",
        no: "Continue without saving",
        action: "closemodal",
      });
    } else {
      closePopCreateView(false);
      setViewNameModule(false);
      closePersonaliseCreateViewModal();
    }
  };
  const ViewDataAPICall = async () => {
    setLoading(true);
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.AllScreenerCategory[
      APP_ENV
    ];
    const data = await service.get({
      url: API_URL,
      params: {},
    });
    const resData = await data.json();
    const viewDataSet =
      resData &&
      resData.datainfo &&
      resData.datainfo.screenerCategoryLevelZero &&
      resData.datainfo.screenerCategoryLevelZero.screenerCategoryLevelOne
        ? resData.datainfo.screenerCategoryLevelZero.screenerCategoryLevelOne
        : [];
    const tabDataFilterDo: any[] = [];
    viewDataSet.map((item: any) => {
      return tabDataFilterDo.push({
        categoryMappingID: item.categoryMappingID,
        displayName: item.displayName,
      });
    });
    tabDataFitlerBaseOnWidth(tabDataFilterDo);
    setViewData(viewDataSet);
    setLoading(false);
  };
  const hideElementsByClass = (className: any) => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.classList.add("hide");
    });
  };
  const saveUserPersonalise = () => {
    if (!selectedView.length) {
      setShowToaster(true);
      setToasterData({
        title: "Please select at least one view",
        errorModule: "error",
      });
      //alert("Please select at least one view");
    } else if (
      editmode &&
      editmode.mode &&
      editmode.viewId &&
      screenerName === ""
    ) {
      //alert("Please enter screener name ---");
      setShowToaster(true);
      setToasterData({
        title: "Please enter screener name",
        errorModule: "error",
      });
    } else if (screenerName === "") {
      setViewNameModule(true);
      // const randomNumber = Math.floor(Math.random() * 100) + 1;
      // setScreenerName(`Custom View ${userCustomeViewNo}`);
      //closePersonaliseCreateViewModal();
      hideElementsByClass("hideSecElement");
    } else {
      saveUserPersonaliseAPICall();
    }
  };
  const saveUserPersonaliseAPICall = async () => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "personalise_saved",
      event_label: window.location.href,
    });
    const modeOfPersonaliseView = editmode?.viewId !== "" ? "update" : "new";
    const ssoid = window.objUser?.ssoid;
    const updatedOrder: any[] = [];
    selectedView.map((item: any) => {
      return updatedOrder.push(item.sourceFieldName);
    });
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.saveViewName[
      APP_ENV
    ];
    const bodyPost: any = {
      fields: updatedOrder,
      name: screenerName.trim(),
      selectedFlag: 1,
      ssoId: ssoid,
      viewType: "USER",
    };
    if (editmode && editmode.mode && editmode.viewId !== "") {
      bodyPost.viewId = editmode.viewId;
    }
    setLoading(true);

    const res = await service.post({
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
        ssoid: ssoid,
      },
      body: JSON.stringify(bodyPost),
      params: {},
    });

    const resData = await res.json();
    setLoading(false);
    if (
      resData &&
      resData.responseCode === 200 &&
      resData.response === "Data Saved"
    ) {
      const viewId: any = resData.viewId || "";
      closePopCreateView(false);
      //alert(resData.response)
      onPersonalizeHandler(viewId, modeOfPersonaliseView);
    } else if (resData && resData.responseCode === 200) {
      //alert(resData.response);
      setShowToaster(true);
      setToasterData({
        title: resData.response,
        errorModule: "error",
      });
    } else {
      alert("some error please check api or code");
    }
  };
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  const handleInputChange = (e: any) => {
    setSearchNode(e.target.value);
    if (e.target.value === "") {
      setSearchListItems([]);
    }
  };
  const FetchDataSearchView = async () => {
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.getScreenerMapping[
      APP_ENV
    ];
    const data = await service.get({
      url: `${API_URL}${searchNode}`,
      params: {},
    });
    const res = await data.json();
    const searchlistItemData =
      res &&
      res.datainfo &&
      res.datainfo.screenerDBCategoryFieldsList &&
      res.datainfo.screenerDBCategoryFieldsList.length > 0
        ? res.datainfo.screenerDBCategoryFieldsList
        : [];
    setSearchListItems(searchlistItemData);
  };
  const highlightMatch = (text: string) => {
    const regex = new RegExp(`(${debouncedSearchTerm})`, "gi");
    return text.replace(regex, (match, group) => `<strong>${group}</strong>`);
  };
  const handleClickOutside = (e: any) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearchListItems([]);
      setSearchNode("");
    }
  };

  const viewCheckHandler = (e: any, addData: any) => {
    setUserTouchField(true);
    const isChecked = e.target.checked;
    console.log("selectedView", selectedView);
    if (selectedView.length >= 20 && isChecked) {
      setShowToaster(true);
      setToasterData({
        title:
          "You have selected only 20 fields. You cannot select more than this limit",
        errorModule: "error",
      });
      //alert("You have only 20 selected not more ");
      return;
    }
    if (isChecked) {
      let viewAllDataforSelected: any = [...selectedView];
      const userSelectViewData = {
        displayName: addData.displayName,
        sourceFieldName: addData.sourceFieldName,
      };
      viewAllDataforSelected.push(userSelectViewData);
      setSelectedView(viewAllDataforSelected);
    } else {
      let viewAllDataforSelected: any = [...selectedView];
      let updatedViewData = viewAllDataforSelected.filter(
        (item: any) => item.sourceFieldName !== addData.sourceFieldName,
      );
      setSelectedView(updatedViewData);
    }
  };
  const handleOnDragEnd = (result: any) => {
    //console.log('result',result)
    setUserTouchField(true);
    if (!result.destination) return; // Dropped outside the list

    const updatedListData = [...selectedView];
    const [movedItem] = updatedListData.splice(result.source.index, 1);
    updatedListData.splice(result.destination.index, 0, movedItem);

    // Update order IDs
    updatedListData.forEach((item, index) => {
      item.order = index + 1;
    });
    //console.log(updatedListData);
    setSelectedView(updatedListData);
  };
  const removeUserPersonalise = () => {
    if (editmode && editmode.mode && editmode.viewId !== "") {
      //removeByViewID(editmode.viewId);
      closePersonaliseCreateViewModal();
      removePersonaliseView(editmode.viewId);
    }
  };
  const fetchByViewID = async (viewId: any) => {
    setLoading(true);
    const ssoid = window.objUser?.ssoid;
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.screenerViewById[
      APP_ENV
    ];
    const data = await service.get({
      url: `${API_URL}${viewId}`,
      params: {},
      cache: "no-store",
      headers: {
        ssoid: ssoid,
      },
    });
    const resData = await data.json();
    if (
      resData &&
      resData[0] &&
      resData[0].filedNames &&
      resData[0].filedNames.length > 0
    ) {
      const createViewData: any[] = [];
      resData[0].filedNames.map((item: any) => {
        const userSelectViewData = {
          displayName: item.name,
          sourceFieldName: item.fieldId,
        };
        return createViewData.push(userSelectViewData);
      });
      setScreenerName(resData[0].name);
      setSelectedView(createViewData);
    }
    setLoading(false);
  };
  const removeByViewID = async (viewId: any) => {
    setLoading(true);
    const ssoid = window.objUser?.ssoid;
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW
      .screenerRemoveviewbyid[APP_ENV];
    const data = await service.get({
      url: `${API_URL}${viewId}`,
      params: {},
      cache: "no-store",
      headers: {
        ssoid: ssoid,
      },
    });
    const resData = await data.json();
    setLoading(false);
    if (resData && resData.responseCode === 200) {
      closePersonaliseCreateViewModal();
      onPersonalizeHandler();
    } else {
      alert("some error please check api or code");
    }
  };
  const closePersonaliseCreateViewModal = () => {
    if (userTouchField) {
      setShowToasterConfirm(true);
      setToasterDataConfirmBox({
        title: "Do you want to save the changes made?",
        errorModule: "error",
        yes: "Yes ",
        no: "Continue without saving",
        action: "closemodal",
      });
    } else {
      closePopCreateView(false);
    }
  };
  const removeItemList = (itemList: any, e: any) => {
    setUserTouchField(true);
    //e.stopPropagation()
    // e.preventDefault();
    const fieldName = itemList.sourceFieldName;
    let viewAllDataforSelected: any[] = [...selectedView];
    let __updatedViewData = viewAllDataforSelected.filter(
      (view: any) => view.sourceFieldName !== fieldName,
    );
    //console.log('itemList',itemList, selectedView, __updatedViewData, 'sateUpdate',sateUpdate)
    setSelectedView(__updatedViewData);
  };
  const viewNameHandlerFun = (viewName: string) => {
    if (viewName !== "") {
      // setViewNameModule(false);
      saveUserPersonalise();
    }
  };
  const updateViewNameHandler = () => {
    setViewNameModule(false);
  };
  const editViewNameHandler = () => {
    setViewNameModule(true);
  };
  //console.log('whatis', selectedView)

  const handleResizeTabslist = () => {
    const tabsListWidth = tabsListRef.current?.offsetWidth;
    if (tabsListWidth != null) {
      const actualTabListWith = tabsListWidth - 200;
      const visibleTabsWidth = visibleTabs.reduce((totalWidth, tab) => {
        return totalWidth + tab.offsetWidth;
      }, 0);
      const hiddenTabsWidth = hiddenTabs.reduce((totalWidth, tab) => {
        return totalWidth + tab.offsetWidth;
      }, 0);
    }
  };
  const tabDataFitlerBaseOnWidth = (data: any) => {
    //console.log("___data", data);
    const tabsListWidth = tabsListRef.current?.offsetWidth;
    if (tabsListWidth != null) {
      let currentWidth = 0;
      const filterData = data || [];
      const newVisibleTabs: any[] = [];
      const newHiddenTabs: any[] = [];
      for (const tab of filterData) {
        //console.log("tab", tab);
        const tabWidth = tab.displayName.length * 10; // Adjust the width calculation as per your requirement
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
  const toasterActionFun = (action = "") => {
    if (action === "closemodal") {
      setShowToasterConfirm(false);
      closePopCreateView(false);
      document.body.style.overflow = "";
      //console.log('___clar blank ____ListData_',listData)
    } else if (action === "createnew") {
      setShowToasterConfirm(false);
      setViewNameModule(true);
    }
  };
  //console.log('VisibleTabs', visibleTabs, "_HiddenTabs__", hiddenTabs)
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchRef]);
  useEffect(() => {
    const handleClickOutsidePopup = (e: any) => {
      //console.log('___________')
      if (
        viewWraperRef.current &&
        !viewWraperRef.current.contains(e.target) &&
        e.target.classList[0] !== "refRemoveList"
      ) {
        //console.log('___________++++++++',viewWraperRef.current, !viewWraperRef.current.contains(e.target), "sateUpdate",sateUpdate)
        // closePersonaliseCreateViewModal();
      }
    };
    document.addEventListener("click", handleClickOutsidePopup);
    return () => {
      document.removeEventListener("click", handleClickOutsidePopup);
    };
  }, [viewWraperRef, closePopCreateView]);
  useEffect(() => {
    ViewDataAPICall();
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "personalise_new_view",
      event_label: ``,
    });
    if (editmode && editmode.mode && editmode.viewId !== "") {
      fetchByViewID(editmode.viewId);
    }
    //window.addEventListener("resize", handleResizeTabslist);
    return () => {
      //window.removeEventListener("resize", handleResizeTabslist);
    };
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchNode);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchNode]);
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      FetchDataSearchView();
    }
  }, [debouncedSearchTerm]);
  return (
    <>
      <div className={`customModule ${styles.wraper}`}>
        <div
          className={styles.divOverlya}
          onClick={closePersonaliseCreateViewModal}
        ></div>
        <div className={`moduleWrap ${styles.perWrap}`} ref={viewWraperRef}>
          <div className={`hideSecElement ${styles.header}`}>
            <span>
              {editmode && editmode.mode && editmode.viewId !== ""
                ? "Edit"
                : "Create New View"}
            </span>
            <span
              className={`${styles.closeIcon}`}
              onClick={closePersonaliseCreateViewModal}
            >
              <i className="eticon_cross"></i>
            </span>
            {editmode && editmode.mode && editmode.viewId != "" ? (
              <span className={styles.editViewName}>
                {screenerName}{" "}
                <span
                  onClick={editViewNameHandler}
                  className={`eticon_edit ${styles.editIconView}`}
                ></span>
              </span>
            ) : (
              ""
            )}
            {/* <div className={styles.formGroup}>
                            <input type="text" placeholder="Please enter screener name" value={screenerName} onChange={(e:any)=>setScreenerName(e.target.value)} />
                        </div> */}
          </div>
          <div className={`hideSecElement moduleBody ${styles.body}`}>
            <div className={styles.bodySec}>
              <div className={styles.filterSec}>
                <div className={styles.leftSec}>
                  <h2>Selected Metrics</h2>
                  {selectedView.length > 0 ? (
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable
                        droppableId="list"
                        type="group"
                        key={selectedView.length}
                      >
                        {(provided: any = {}, snapshot: any = {}) => (
                          <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={styles.viewList}
                          >
                            {selectedView.map((list: any, index: any) => {
                              return (
                                <Draggable
                                  key={`${list.categoryMasterID}-${index}`}
                                  draggableId={`${list.categoryMasterID}-${index}`}
                                  index={index}
                                >
                                  {(provided: any) => {
                                    return (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <div className={styles.listItem}>
                                          <span
                                            className={`${styles.moveSec} eticon_move`}
                                          ></span>
                                          <span className={styles.itemTxt}>
                                            {list.displayName}
                                          </span>
                                          <span
                                            className={`refRemoveList ${styles.itemRemoveTag} eticon_cross`}
                                            onClick={(e) =>
                                              removeItemList(list, e)
                                            }
                                          ></span>
                                        </div>
                                      </li>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.rightSec}>
                  <div className={styles.topSearchSec}>
                    <div className={styles.formGorup} ref={searchRef}>
                      <span
                        className={`eticon_search ${styles.searchBtn}`}
                      ></span>
                      <input
                        type="text"
                        placeholder="Search for a metrics..."
                        className={styles.serchInput}
                        value={searchNode}
                        onChange={handleInputChange}
                        maxLength={100}
                      />
                      {searchListItems.length > 0 ? (
                        <ul className={`customScroll ${styles.searchItemList}`}>
                          {searchListItems.map((item: any) => {
                            return (
                              <li
                                key={`${item.categoryFieldMasterID}-${item.sourceFieldName}`}
                              >
                                <div className={styles.formGroup}>
                                  <input
                                    type="checkbox"
                                    value={item.categoryMasterID}
                                    id={`${item.categoryMasterID}-search`}
                                    checked={selectedView.some(
                                      (viewItem: any) =>
                                        viewItem.sourceFieldName ===
                                        item.sourceFieldName,
                                    )}
                                    onChange={(e) => viewCheckHandler(e, item)}
                                  />

                                  <label
                                    htmlFor={`${item.categoryMasterID}-search`}
                                  >
                                    <span
                                      className={styles.checkBoxStyle}
                                    ></span>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatch(
                                          item.displayName,
                                        ),
                                      }}
                                    ></span>
                                  </label>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className={styles.resultSec}>
                    <ul className={styles.topLevelList} ref={tabsListRef}>
                      {visibleTabs.length > 0 ? (
                        visibleTabs.map((item: any, index: number) => (
                          <li
                            key={item.categoryMappingID}
                            className={index === activeTab ? styles.active : ""}
                            onClick={() => handleTabClick(index)}
                          >
                            <div className={styles.catHead}>
                              {item.displayName}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>No data found</li>
                      )}
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
                                    key={item.categoryMappingID}
                                    className={
                                      visibleTabs.length + index === activeTab
                                        ? styles.active
                                        : ""
                                    }
                                    onClick={() =>
                                      handleTabClick(visibleTabs.length + index)
                                    }
                                  >
                                    <div className={styles.catHead}>
                                      {item.displayName}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                      ) : null}
                    </ul>

                    {viewData.length > 0 && (
                      <ul
                        className={`${styles.innerListContainer} ${
                          activeTab < viewData.length &&
                          viewData[activeTab].screenerCategoryLevelTwo &&
                          viewData[activeTab].screenerCategoryLevelTwo.length >
                            0
                            ? styles.active
                            : ""
                        }`}
                      >
                        {activeTab < viewData.length &&
                        viewData[activeTab].screenerCategoryLevelTwo &&
                        viewData[activeTab].screenerCategoryLevelTwo.length >
                          0 ? (
                          viewData[activeTab].screenerCategoryLevelTwo.map(
                            (subItem: any) =>
                              subItem.screenerCategoryFields &&
                              subItem.screenerCategoryFields.length > 0 && (
                                <li key={subItem.categoryFieldMasterID}>
                                  <div className={styles.subHeadName}>
                                    {subItem.displayName}
                                  </div>
                                  {subItem.screenerCategoryFields &&
                                    subItem.screenerCategoryFields.length >
                                      0 && (
                                      <ul
                                        className={`customScroll ${styles.innerList}`}
                                      >
                                        {subItem.screenerCategoryFields.map(
                                          (childSubItem: any) => (
                                            <li
                                              key={
                                                childSubItem.categoryFieldMasterID
                                              }
                                            >
                                              <div className={styles.forGroup}>
                                                <input
                                                  type="checkbox"
                                                  id={`${childSubItem.categoryMasterID}-cpv`}
                                                  value={
                                                    childSubItem.categoryMasterID
                                                  }
                                                  className={styles.checkBoxSec}
                                                  onChange={(e) =>
                                                    viewCheckHandler(
                                                      e,
                                                      childSubItem,
                                                    )
                                                  }
                                                  checked={selectedView.some(
                                                    (item: any) =>
                                                      item.sourceFieldName ===
                                                      childSubItem.sourceFieldName,
                                                  )}
                                                />

                                                <label
                                                  htmlFor={`${childSubItem.categoryMasterID}-cpv`}
                                                >
                                                  <span
                                                    className={
                                                      styles.checkBoxStyle
                                                    }
                                                  ></span>
                                                  <span>
                                                    {childSubItem.displayName}
                                                  </span>
                                                </label>
                                              </div>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    )}
                                </li>
                              ),
                          )
                        ) : (
                          <li>No inner data found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`hideSecElement ${styles.footer}`}>
            {editmode && editmode.mode && editmode.viewId !== "" ? (
              <span
                className={`${styles.updateBtn} ${styles.removeBtn}`}
                onClick={removeUserPersonalise}
              >
                DELETE VIEW
              </span>
            ) : null}
            <span className={styles.updateBtn} onClick={saveUserPersonalise}>
              {editmode && editmode.mode && editmode.viewId !== ""
                ? "Update Changes"
                : "Save Changes"}
            </span>
          </div>
          {viewNameModule ? (
            <NameViewComponent
              createViewNameHandler={viewNameHandlerFun}
              screenerName={screenerName}
              editMode={editmode.viewId}
              updateViewNameHandler={updateViewNameHandler}
              setScreenerName={setScreenerName}
              closeViewNamePopup={CreateViewNameModalClose}
            />
          ) : null}
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {showToaster ? (
        <ToasterPopup data={toasterData} toasterCloseHandler={closeToaster} />
      ) : (
        ""
      )}

      {showToasterConfirm ? (
        <ToasterPopupConfirm
          data={toasterDataConfirmBox}
          toasterCloseHandler={closeToasterConfirm}
          toasterActionFun={toasterActionFun}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default CreateNewViewComponent;
