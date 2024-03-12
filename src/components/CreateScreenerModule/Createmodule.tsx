import styles from "./styles.module.scss";

const ScreenerNameViewPopup = ({
  createViewNameHandler,
  screenerName,
  setScreenerName,
  editMode,
  updateViewNameHandler,
  closePopUp,
}: any) => {
  const createViewHandler = () => {
    if (screenerName && screenerName !== "") {
      createViewNameHandler(screenerName.trim());
    } else {
      alert("Plase fill your screener name");
    }
  };
  const updateViewHandler = () => {
    if (screenerName && screenerName !== "") {
      updateViewNameHandler(screenerName.trim());
    } else {
      alert("Plase fill your screener name");
    }
  };
  return (
    <>
      <div className={`customeModule ${styles.wraperSmall}`}>
        <div
          className={`${styles.overlaySmall}`}
          onClick={() => closePopUp(false)}
        ></div>
        <div className={`moduleWrap ${styles.perWrap}`}>
          <div className={styles.header}>
            Name your screener view
            <span
              className={`${styles.closeIcon}`}
              onClick={() => closePopUp(false)}
            ></span>
          </div>
          <div className={styles.body}>
            <div className={styles.createFormGoup}>
              <input
                type="text"
                value={screenerName}
                onChange={(e: any) => setScreenerName(e.target.value)}
                placeholder="Enter a name..."
              />
            </div>
          </div>
          <div className={styles.footer}>
            <span
              className={`${styles.updateBtn} ${styles.cancelBtn}`}
              onClick={() => closePopUp(false)}
            >
              Cancel
            </span>
            {editMode && editMode !== "" ? (
              <span
                className={`${styles.updateBtn}`}
                onClick={updateViewHandler}
              >
                Update view
              </span>
            ) : (
              <span
                className={`${styles.updateBtn}`}
                onClick={createViewHandler}
              >
                Create view
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenerNameViewPopup;
