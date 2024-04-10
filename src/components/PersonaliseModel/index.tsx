"use client";
import styles from "./PersonaliseModel.module.scss";
import { useRef, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PersonaliseModel = ({
  setOpenPersonaliseModal,
  openPersonaliseModal,
  data,
  updateTabsListDataHandler,
  createNewViewHandler,
  editmode,
  loading = false,
}: any) => {
  const dataLis = data && data.length > 0 ? data : [];
  //console.log('data',userCustomeViewNo)
  const [listData, setListData] = useState(dataLis);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const handleOnDragEnd = (result: any) => {
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
  const handleClickOutside = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setOpenPersonaliseModal(false);
    }
  };

  const handleEscapeKey = (event: any) => {
    if (event.key === "Escape") {
      setOpenPersonaliseModal(false);
    }
  };
  const saveUserPersonalise = () => {
    updateTabsListDataHandler(listData);
  };
  const handleCheckboxChange = (e: any, itemData: any) => {
    const isChecked = e.target.checked;
    const viewId = itemData.viewId;

    const updatedListData = listData.map((item: any) => {
      if (item.viewId === viewId) {
        item.selectedFlag = isChecked ? 1 : 0;
      }
      return item;
    });
    setListData(updatedListData);
    console.log(updatedListData);
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
  const createNewHandler = () => {
    editmode({
      mode: false,
      viewId: "",
    });
    setOpenPersonaliseModal(false);
    createNewViewHandler(true);
  };
  useEffect(() => {
    if (openPersonaliseModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openPersonaliseModal]);
  return (
    <div className={`customeModule ${styles.wraper}`}>
      <div className={`moduleWrap ${styles.perWrap}`} ref={popupRef}>
        <div className={`moduleHeader ${styles.header}`}>
          Personalise Your View
          <span
            className={`${styles.closeIcon}`}
            onClick={() => setOpenPersonaliseModal(false)}
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
                                        <div className={styles.checkboxSlider}>
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
  );
};

export default PersonaliseModel;
