import styles from "./styles.module.scss";

const NameViewComponent = ({
  createViewNameHandler,
  screenerName,
  setScreenerName,
  editMode,
  updateViewNameHandler,
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
        <div className={`moduleWrap ${styles.perWrap}`}>
          <div className={styles.header}>Name your screener view</div>
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
            {editMode && editMode !== "" ? (
              <span
                className={`refRemoveList ${styles.updateBtn}`}
                onClick={updateViewHandler}
              >
                Update view
              </span>
            ) : (
              <span
                className={`refRemoveList ${styles.updateBtn}`}
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

export default NameViewComponent;
