import styles from "./CreateNewView.module.scss";

const NameViewComponent = ({
  createViewNameHandler,
  screenerName,
  setScreenerName,
  editMode,
  updateViewNameHandler,
  closeViewNamePopup,
}: any) => {
  const viewActionBtnHandler = () => {
    const viewScreenerName: any = screenerName.trim();
    if (editMode && editMode !== "") {
      updateViewNameHandler(viewScreenerName);
    } else if (viewScreenerName === "") {
      alert("Please fill screener name");
    } else {
      createViewNameHandler(viewScreenerName);
    }
  };
  const closeNameViewModule = () => {
    closeViewNamePopup(false);
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
          onClick={viewActionBtnHandler}
        ></div>
        <div className={`moduleWrap ${styles.perWrap}`}>
          <div className={styles.header}>
            Name your custom view
            <span
              className={`refRemoveList ${styles.closeIcon}`}
              onClick={viewActionBtnHandler}
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
    </>
  );
};

export default NameViewComponent;
