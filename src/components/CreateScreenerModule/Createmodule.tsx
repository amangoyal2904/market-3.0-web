import styles from "./styles.module.scss";
import { useState } from "react";
import { trackingEvent } from "@/utils/ga";
const ScreenerNameViewPopup = ({
  createViewNameHandler,
  screenerName,
  editMode,
  updateViewNameHandler,
  closePopUp,
  screenerEditMode,
}: any) => {
  const [name, setName] = useState(screenerName);
  const createViewHandler = () => {
    if (name && name.trim() !== "") {
      createViewNameHandler(name.trim());
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "screener_save_click",
        event_label: window.location.href,
      });
    } else {
      alert("Plase fill your screener name");
    }
  };
  const updateViewHandler = () => {
    if (name && name !== "") {
      updateViewNameHandler(name.trim());
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
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="Enter a name..."
                maxLength={70}
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
            <span className={`${styles.updateBtn}`} onClick={createViewHandler}>
              {screenerEditMode.userMode === "USER" &&
              (screenerEditMode.screenerStage === "popup" ||
                screenerEditMode.screenerStage === "")
                ? "Update view"
                : "Create view"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenerNameViewPopup;
