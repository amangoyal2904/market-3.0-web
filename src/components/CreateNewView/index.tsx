import styles from "./CreateNewView.module.scss";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import NameViewComponent from "./createmodule";
const CreateNewViewComponent = ({
  closePopCreateView,
  editmode,
  onPersonalizeHandler,
  removePersonaliseView,
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
  const [loading, setLoading] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const tabsListRef = useRef<HTMLUListElement>(null);
  //console.log('editmode', editmode)
  const ViewDataAPICall = async () => {
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.AllScreenerCategory[
      APP_ENV
    ];
    const data = await fetch(API_URL);
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
  };
  const hideElementsByClass = (className: any) => {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.classList.add("hide");
    });
  };
  const saveUserPersonalise = () => {
    if (!selectedView.length) {
      alert("Please select at least one view");
    } else if (screenerName === "") {
      setViewNameModule(true);
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      setScreenerName(`my${randomNumber}-view`);
      //closePopCreateView(false);
      hideElementsByClass("hideSecElement");
    } else {
      saveUserPersonaliseAPICall();
    }
  };
  const saveUserPersonaliseAPICall = async () => {
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
      name: screenerName,
      selectedFlag: 1,
      ssoId: ssoid,
      viewType: "USER",
    };
    if (editmode && editmode.mode && editmode.viewId !== "") {
      bodyPost.viewId = editmode.viewId;
    }
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ssoid: ssoid,
      },
      body: JSON.stringify(bodyPost),
    });
    const resData = await res.json();
    setLoading(false);
    if (resData && resData.responseCode === 200) {
      const viewId: any = resData.viewId || "";
      closePopCreateView(false);
      //alert(resData.response)
      onPersonalizeHandler(viewId, modeOfPersonaliseView);
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
    const data = await fetch(`${API_URL}${searchNode}`);
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
    const isChecked = e.target.checked;
    console.log("selectedView", selectedView);
    if (selectedView.length >= 20 && isChecked) {
      alert("You have only 20 selected not more ");
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
      closePopCreateView(false);
      removePersonaliseView(editmode.viewId);
    }
  };
  const fetchByViewID = async (viewId: any) => {
    setLoading(true);
    const ssoid = window.objUser?.ssoid;
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.screenerViewById[
      APP_ENV
    ];
    const data = await fetch(`${API_URL}${viewId}`, {
      cache: "no-store",
      headers: {
        ssoid: ssoid,
      },
    });
    const resData = await data.json();
    //console.log('resdata', resData)
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
    const data = await fetch(`${API_URL}${viewId}`, {
      cache: "no-store",
      headers: {
        ssoid: ssoid,
      },
    });
    const resData = await data.json();
    //console.log('resdata', resData)
    setLoading(false);
    if (resData && resData.responseCode === 200) {
      closePopCreateView(false);
      //alert(resData.response)
      onPersonalizeHandler();
    } else {
      alert("some error please check api or code");
    }
  };
  const removeItemList = (itemList: any, e: any) => {
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
      setViewNameModule(false);
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
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchRef]);
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
  //console.log('VisibleTabs', visibleTabs, "_HiddenTabs__", hiddenTabs)
  useEffect(() => {
    const handleClickOutsidePopup = (e: any) => {
      //console.log('___________')
      if (
        viewWraperRef.current &&
        !viewWraperRef.current.contains(e.target) &&
        e.target.classList[0] !== "refRemoveList"
      ) {
        //console.log('___________++++++++',viewWraperRef.current, !viewWraperRef.current.contains(e.target), "sateUpdate",sateUpdate)
        closePopCreateView(false);
      }
    };
    document.addEventListener("click", handleClickOutsidePopup);
    return () => {
      document.removeEventListener("click", handleClickOutsidePopup);
    };
  }, [viewWraperRef, closePopCreateView]);
  useEffect(() => {
    ViewDataAPICall();
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
      <div className={`customeModule ${styles.wraper}`}>
        <div className={`moduleWrap ${styles.perWrap}`} ref={viewWraperRef}>
          <div className={`hideSecElement ${styles.header}`}>
            <span>
              {editmode && editmode.mode && editmode.viewId !== ""
                ? "Edit"
                : "Create New View"}
            </span>
            <span
              className={`${styles.closeIcon}`}
              onClick={() => closePopCreateView(false)}
            ></span>
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
                            (subItem: any) => (
                              <li key={subItem.categoryFieldMasterID}>
                                <div className={styles.subHeadName}>
                                  {subItem.displayName}
                                </div>
                                {subItem.screenerCategoryFields &&
                                  subItem.screenerCategoryFields.length > 0 && (
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
                                                id={
                                                  childSubItem.categoryMasterID
                                                }
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
                                                htmlFor={
                                                  childSubItem.categoryMasterID
                                                }
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
              closeViewNamePopup={setViewNameModule}
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
    </>
  );
};

export default CreateNewViewComponent;
