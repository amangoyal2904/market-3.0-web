import styles from "./CreateNewView.module.scss";
import { useState } from "react";
import ToasterPopup from "../ToasterPopup/OnlyInfo";

const NameViewComponent = ({
  createViewNameHandler,
  screenerName,
  setScreenerName,
  editMode,
  updateViewNameHandler,
  closeViewNamePopup,
}: any) => {
  const [showToaster, setShowToaster] = useState(false);
  console.log("showToaster", showToaster);
  const [toasterData, setToasterData] = useState({
    title: "",
    errorModule: "",
  });
  const closeToaster = () => {
    setShowToaster(false);
  };
  const viewActionBtnHandler = () => {
    const viewScreenerName: any = screenerName.trim();
    if (editMode && editMode !== "") {
      updateViewNameHandler(viewScreenerName);
    } else if (viewScreenerName === "") {
      setShowToaster(true);
      setToasterData({
        title: "Please fill screener name",
        errorModule: "error",
      });
      //alert("Please fill screener name");
    } else {
      createViewNameHandler(viewScreenerName);
    }
  };
  const closeNameViewModule = () => {
    const viewScreenerName: any = screenerName.trim();
    if (viewScreenerName === "") {
      closeViewNamePopup(false);
    } else {
      createViewNameHandler(viewScreenerName);
    }
  };
  // const createViewHandler = () => {
  //   if (screenerName && screenerName !== "") {
  //     createViewNameHandler(screenerName.trim());
  //   } else {
  //     alert("Plase fill your screener name");
  //   }
  // };
  // const updateViewHandler = () => {
  //   if (screenerName && screenerName !== "") {
  //     updateViewNameHandler(screenerName.trim());
  //   } else {
  //     alert("Plase fill your screener name");
  //   }
  // };
  return (
    <>
      <div className={`customeModule ${styles.wraperSmall}`}>
        <div
          className={`refRemoveList ${styles.overlaySmall}`}
          onClick={closeNameViewModule}
        ></div>
        <div className={`moduleWrap ${styles.perWrap}`}>
          <div className={styles.header}>
            Name your custom view
            <span
              className={`refRemoveList ${styles.closeIcon}`}
              onClick={closeNameViewModule}
            ></span>
          </div>
          <div className={styles.body}>
            <div className={styles.createFormGoup}>
              <input
                type="text"
                value={screenerName}
                onChange={(e: any) => setScreenerName(e.target.value)}
                placeholder="Enter a name..."
                maxLength={50}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <span
              className={`refRemoveList ${styles.updateBtn}`}
              onClick={viewActionBtnHandler}
            >
              {editMode && editMode !== "" ? "Update view" : "Create view"}
            </span>
          </div>
        </div>
      </div>
      {showToaster ? (
        <ToasterPopup data={toasterData} toasterCloseHandler={closeToaster} />
      ) : (
        ""
      )}
    </>
  );
};

export default NameViewComponent;
