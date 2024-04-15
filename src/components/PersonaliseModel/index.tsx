"use client";
import styles from "./PersonaliseModel.module.scss";
import { useRef, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ToasterPopup from "../ToasterPopup/ConfirmBox";
import { getCustomViewsTab } from "@/utils/customViewAndTables";
import { useStateContext } from "@/store/StateContext";

const PersonaliseModel = ({
  setOpenPersonaliseModal,
  openPersonaliseModal,
  data,
  updateTabsListDataHandler,
  createNewViewHandler,
  editmode,
  loading = false,
  setloading,
}: any) => {
  const { state } = useStateContext();
  const { isLogin, ssoid, isPrime } = state.login;
  const __dataList = data && data.length > 0 ? data : [];
  const dataLis = data && data.length > 0 ? data : [];
  //console.log('data_____dataLis',__dataList)
  const [listData, setListData]: any = useState([]);
  const [userTouchField, setUserTouchField] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  //console.log('showToaster',showToaster)
  const [toasterData, setToasterData] = useState({
    title: "",
    errorModule: "",
    yes: "",
    no: "",
    action: "closemodal",
  });
  const closeToaster = () => {
    setShowToaster(false);
  };
  const popupRef = useRef<HTMLDivElement | null>(null);
  const handleOnDragEnd = (result: any) => {
    setUserTouchField(true);
    if (!result.destination) return; // Dropped outside the list

    const updatedListData = [...listData];
    const [movedItem] = updatedListData.splice(result.source.index, 1);
    updatedListData.splice(result.destination.index, 0, movedItem);

    // Update order IDs
    updatedListData.forEach((item, index) => {
      item.order = index + 1;
    });
    //console.log(updatedListData);
    setListData(updatedListData);
  };
  const closePersonaliseModal = () => {
    if (userTouchField) {
      setShowToaster(true);
      setToasterData({
        title: "Do you want to save the changes made?",
        errorModule: "error",
        yes: "Yes ",
        no: "Continue without saving",
        action: "closemodal",
      });
    } else {
      setOpenPersonaliseModal(false);
    }
  };

  const saveUserPersonalise = () => {
    updateTabsListDataHandler(listData);
  };
  const handleCheckboxChange = (e: any, itemData: any) => {
    setUserTouchField(true);
    const isChecked = e.target.checked;
    const viewId = itemData.viewId;

    const updatedListData = listData.map((item: any) => {
      if (item.viewId === viewId) {
        item.selectedFlag = isChecked ? 1 : 0;
      }
      return item;
    });
    setListData(updatedListData);
  };
  const editModeHandler = (viewId: any) => {
    console.log("click to edit mode");
    editmode({
      mode: true,
      viewId: viewId,
    });
    setOpenPersonaliseModal(false);
    createNewViewHandler(true);
  };
  //console.log('__outer_____ListData_',listData)
  const toasterActionFun = (action = "") => {
    if (action === "closemodal") {
      setOpenPersonaliseModal(false);
      //console.log('___clar blank ____ListData_',listData)
    } else if (action === "createnew") {
      editmode({
        mode: false,
        viewId: "",
      });
      setOpenPersonaliseModal(false);
      createNewViewHandler(true);
    }
  };
  const createNewHandler = () => {
    if (userTouchField) {
      setShowToaster(true);
      setToasterData({
        title: "Do you want to save the changes made?",
        errorModule: "error",
        yes: "Yes ",
        no: "Continue without saving",
        action: "createnew",
      });
    } else {
      editmode({
        mode: false,
        viewId: "",
      });
      setOpenPersonaliseModal(false);
      createNewViewHandler(true);
    }
  };
  const callCustomeViewData = async () => {
    setloading(true);
    const { tabData } = await getCustomViewsTab({
      L3NavSubItem: "watchlist",
      ssoid: ssoid,
    });
    const personaliseDataListItem =
      tabData && tabData.length > 0
        ? tabData.filter((item: any, index: number) => index !== 0)
        : [];
    setloading(false);
    setListData([...personaliseDataListItem]);
  };
  useEffect(() => {
    callCustomeViewData();
    return () => {
      setListData([]);
    };
  }, []);
  return (
    <>
      <div className={`customeModule ${styles.wraper}`}>
        <div
          className={styles.divOverlya}
          onClick={closePersonaliseModal}
        ></div>
        <div className={`moduleWrap ${styles.perWrap}`} ref={popupRef}>
          <div className={`moduleHeader ${styles.header}`}>
            Personalise Your View
            <span
              className={`${styles.closeIcon}`}
              onClick={closePersonaliseModal}
            ></span>
          </div>
          <div className={`moduleBody ${styles.body}`}>
            <div className={styles.topHeader}>
              <span className={styles.leftTxt}>Default Views</span>
              <span className={styles.createBtn} onClick={createNewHandler}>
                Create New View
              </span>
            </div>
            <div className={styles.bodySec}>
              {listData.length > 0 ? (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable
                    droppableId="list"
                    type="group"
                    key={listData.length}
                  >
                    {(provided: any = {}, snapshot: any = {}) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="list customScroll"
                      >
                        {listData.map((list: any, index: any) => {
                          return (
                            <Draggable
                              key={`${list.viewId}-${index}`}
                              draggableId={`${list.viewId}-${index}`}
                              index={index}
                            >
                              {(provided: any) => {
                                return (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className={styles.dragListItem}>
                                      <span
                                        className={`${styles.moveSec} eticon_move`}
                                      ></span>
                                      <span className={styles.itemTxt}>
                                        {list.name}
                                      </span>
                                      {list.viewType &&
                                      list.viewType === "USER" ? (
                                        <div className={styles.editMode}>
                                          <span
                                            onClick={() =>
                                              editModeHandler(list.viewId)
                                            }
                                            className={`eticon_edit ${styles.editBtn}`}
                                          ></span>
                                        </div>
                                      ) : (
                                        <div className={styles.checkBoxWrap}>
                                          <div
                                            className={styles.checkboxSlider}
                                          >
                                            <label
                                              className={styles.checkboxLabel}
                                            >
                                              <input
                                                type="checkbox"
                                                onChange={(e: any) =>
                                                  handleCheckboxChange(e, list)
                                                }
                                                checked={list.selectedFlag}
                                              />
                                              <span
                                                className={styles.slider}
                                              ></span>
                                            </label>
                                          </div>
                                        </div>
                                      )}
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
          </div>
          <div className={styles.footer}>
            <span className={styles.updateBtn} onClick={saveUserPersonalise}>
              Save Changes
            </span>
          </div>
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
        <ToasterPopup
          data={toasterData}
          toasterCloseHandler={closeToaster}
          toasterActionFun={toasterActionFun}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default PersonaliseModel;
