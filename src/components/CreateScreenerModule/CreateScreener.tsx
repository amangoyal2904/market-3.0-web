import styles from "./styles.module.scss";

import { useState, useEffect, useRef } from "react";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import NameViewComponent from "./Createmodule";
import { trackingEvent } from "@/utils/ga";
import service from "@/network/service";

const CreateScreenerModule = ({
  closeModuleScreenerNew,
  editmode,
  runQueryhandler,
  cancelScreenerCreate,
  screenerLoading,
  setScreenerLoading,
  query = "",
}: any) => {
  const [viewData, setViewData]: any = useState([]);
  const [screenerName, setScreenerName]: any = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchNode, setSearchNode] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchListItems, setSearchListItems] = useState([]);
  const [selectedView, setSelectedView]: any = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [viewNameModule, setViewNameModule] = useState(false);
  const [sateUpdate, setSateUpdate] = useState(true);
  const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
  const tabsListRef = useRef<HTMLUListElement>(null);
  const [queryInput, setQueryInput] = useState(query);
  //console.log('editmode', editmode)
  const ViewDataAPICall = async () => {
    const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.AllScreenerCategory[
      APP_ENV
    ];
    const data = await service.get({ url: API_URL, params: {} });
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
    setScreenerLoading(false);
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
  const saveUserPersonalise = () => {
    if (!queryInput) {
      alert("Please select at least one query");
    } else {
      runQueryhandler(queryInput);
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "screener_query_run",
        event_label: "",
      });
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

  const viewCheckHandler = (addData: any) => {
    //const isChecked = e.target.checked;
    // if (isChecked) {
    //   let viewAllDataforSelected: any = [...selectedView];
    //   const userSelectViewData = {
    //     displayName: addData.displayName,
    //     sourceFieldName: addData.sourceFieldName,
    //   };
    //   viewAllDataforSelected.push(userSelectViewData);
    //   setSelectedView(viewAllDataforSelected);
    //   const queryData = `${queryInput} ${addData.sourceFieldName}`;
    //   setQueryInput(queryData)
    // } else {
    //   let viewAllDataforSelected: any = [...selectedView];
    //   let updatedViewData = viewAllDataforSelected.filter(
    //     (item: any) => item.sourceFieldName !== addData.sourceFieldName,
    //   );
    //   setSelectedView(updatedViewData);
    //   const originalString = queryInput;
    //   const substringToRemove = addData.sourceFieldName;
    //   const pattern = new RegExp("\\b" + substringToRemove + "\\b", "g");
    //   const modifiedString = originalString.replace(pattern, "");
    //   setQueryInput(modifiedString)
    // }
    const queryData = `${queryInput} ${addData.displayName}`;
    setQueryInput(queryData);
  };
  const queryInputHandler = (e: any) => {
    const value = e.target.value;
    const modifiedString = value;
    setQueryInput(modifiedString);
  };
  const removeUserPersonalise = () => {
    const userConfirm = confirm(
      "Are you sure you want to remove to this scrneer?",
    );
    if (userConfirm && editmode && editmode.mode && editmode.viewId !== "") {
      removeByViewID(editmode.viewId);
    }
  };
  const fetchByViewID = async (viewId: any) => {
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
  };
  const removeByViewID = async (viewId: any) => {
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
    //console.log('resdata', resData)
    if (resData && resData.responseCode === 200) {
      closeModuleScreenerNew(false);
      //alert(resData.response)
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
    console.log("__viewName_", viewName);
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
  const popUpClose = () => {
    closeModuleScreenerNew(false);
  };
  //console.log('whatis', selectedView)
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    setScreenerLoading(true);
    ViewDataAPICall();
    if (editmode && editmode.mode && editmode.viewId !== "") {
      fetchByViewID(editmode.viewId);
    }
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
  //console.log("vis", visibleTabs)
  return (
    <>
      <div
        className={`customModule ${styles.wraper} ${!editmode.mode ? styles.newCreate : ""}`}
      >
        {editmode.mode ? (
          <div className={styles.overlay} onClick={cancelScreenerCreate}></div>
        ) : (
          ""
        )}

        <div className={`moduleWrap ${styles.perWrap}`}>
          {screenerLoading ? (
            <div className="customLoader">
              <div className="loading">
                <div className="loader"></div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={`moduleBody ${styles.body}`}>
            <div className={styles.bodySec}>
              {editmode.mode ? (
                <div
                  className={styles.closeIcon}
                  onClick={cancelScreenerCreate}
                >
                  <i className="eticon_cross"></i>
                </div>
              ) : (
                ""
              )}
              <div className={styles.filterSec}>
                <div className={styles.leftSec}>
                  <h2>Query</h2>
                  <div className={styles.queryBox}>
                    <textarea
                      value={queryInput}
                      onChange={queryInputHandler}
                    ></textarea>
                  </div>
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
                                  {/* <input
                                    type="checkbox"
                                    value={item.categoryMasterID}
                                    id={`${item.categoryMasterID}-search`}
                                    checked={selectedView.some(
                                      (viewItem: any) =>
                                        viewItem.sourceFieldName ===
                                        item.sourceFieldName,
                                    )}
                                    onChange={(e) => viewCheckHandler(e, item)}
                                  /> */}

                                  <span
                                    className={styles.valTxt}
                                    id={`${item.categoryMasterID}-search`}
                                    onClick={() => viewCheckHandler(item)}
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
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        ""
                      )}
                    </div>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: "<" })}
                    >
                      {" "}
                      {`<`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: "=" })}
                    >
                      {" "}
                      {`=`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: ">" })}
                    >
                      {" "}
                      {`>`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: "(" })}
                    >
                      {" "}
                      {`(`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: "AND" })}
                    >
                      {" "}
                      {`AND`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: "OR" })}
                    >
                      {" "}
                      {`OR`}{" "}
                    </span>
                    <span
                      className={styles.symble}
                      onClick={() => viewCheckHandler({ displayName: ")" })}
                    >
                      {" "}
                      {`)`}{" "}
                    </span>
                  </div>
                  <div className={styles.resultSec}>
                    <ul className={styles.topLevelList} ref={tabsListRef}>
                      {visibleTabs.length > 0 ? (
                        visibleTabs.map((item: any, index: number) => {
                          if (item.categoryMappingID !== 2392) {
                            return (
                              <li
                                key={item.categoryMappingID}
                                className={
                                  index === activeTab ? styles.active : ""
                                }
                                onClick={() => handleTabClick(index)}
                              >
                                <div className={styles.catHead}>
                                  {item.displayName}
                                </div>
                              </li>
                            );
                          }
                        })
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
                                if (item.categoryMappingID !== 2392) {
                                  return (
                                    <li
                                      key={item.categoryMappingID}
                                      className={
                                        visibleTabs.length + index === activeTab
                                          ? styles.active
                                          : ""
                                      }
                                      onClick={() =>
                                        handleTabClick(
                                          visibleTabs.length + index,
                                        )
                                      }
                                    >
                                      <div className={styles.catHead}>
                                        {item.displayName}
                                      </div>
                                    </li>
                                  );
                                }
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
                                                {/* <input
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
                                              /> */}

                                                <span
                                                  className={styles.valTxt}
                                                  id={
                                                    childSubItem.categoryMasterID
                                                  }
                                                  onClick={() =>
                                                    viewCheckHandler(
                                                      childSubItem,
                                                    )
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
                                                </span>
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
                          <div>No inner data found</div>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            {editmode && editmode.mode && editmode.viewId !== "" ? (
              <span
                className={`${styles.updateBtn} ${styles.removeBtn}`}
                onClick={removeUserPersonalise}
              >
                DELETE VIEW
              </span>
            ) : null}
            <span
              className={`${styles.updateBtn} ${styles.cancelBtn}`}
              onClick={cancelScreenerCreate}
            >
              Cancel
            </span>
            <span className={styles.updateBtn} onClick={saveUserPersonalise}>
              {editmode && editmode.mode && editmode.viewId !== ""
                ? "Update Changes"
                : "Run this Query"}
            </span>
          </div>
          {viewNameModule ? (
            <NameViewComponent
              createViewNameHandler={viewNameHandlerFun}
              screenerName={screenerName}
              editMode={editmode.viewId}
              updateViewNameHandler={updateViewNameHandler}
              setScreenerName={setScreenerName}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CreateScreenerModule;
