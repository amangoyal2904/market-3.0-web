import styles from "./styles.module.scss";
import { redirectToPlanPage } from "@/utils/ga";
import { useEffect } from "react";

const BottomStrip = ({
  nudgeType,
  closeHandler,
  bannerText,
  bannerSubtext,
  buttonText,
  buttonSubText,
  bannerTopSubText,
}: any) => {
  const checkUserType = (value: string) => {
    let lableText = "";
    if (value === "type1") {
      lableText = "Bottom Nudge_1_A";
    } else if (value === "type2") {
      lableText = "Bottom Nudge_1_B";
    } else if (value === "type3") {
      lableText = "Bottom Nudge_1_C";
    }
    return lableText;
  };
  const objTracking = {
    category: "Subscription Flow ET",
    action: "Flow Started | SYFT",
    label: `${checkUserType(nudgeType)}`,
    obj: {
      item_name: `${checkUserType(nudgeType)}`,
      item_brand: "product_interventions",
      item_category: "subscription_nudges",
      item_category2: "",
      item_category3: "subscription_nudges",
      item_category4: buttonText,
      item_id: "",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: buttonText,
    },
  };
  useEffect(() => {
    const newObjTracking = { ...objTracking };
    newObjTracking.action = "Blocker impression";
    redirectToPlanPage(newObjTracking, "view_item_list", false);
  }, []);
  return (
    <>
      <div className={`${styles.btmNudgeSec} ${styles[nudgeType]}`}>
        <div className={styles.nudgeWraper}>
          <span
            className={styles.closeSec}
            onClick={() => closeHandler()}
          ></span>
          <div className={styles.leftSec}>
            <img
              src="https://img.etimg.com/thumb/msid-114256969,width-124,height-21,quality-100/et-markets-logo.jpg"
              width={124}
              height={21}
              alt="ET Markets"
              title="ET Markets"
            />
          </div>
          <div className={styles.centerSec}>
            {nudgeType === "type1" ? (
              <p className={styles.ptxt}>{bannerSubtext}</p>
            ) : (
              ""
            )}
            {nudgeType === "type3" ? (
              <span className={styles.unlockTxt}>{bannerTopSubText}</span>
            ) : (
              ""
            )}
            <h5 className={styles.head5Txt}>{bannerText}</h5>
          </div>
          <div className={styles.rightSec}>
            <div className={styles.btnSec}>
              <span onClick={() => redirectToPlanPage(objTracking)}>
                {nudgeType === "type1" ? (
                  <span className={styles.subBtn}>{buttonText}</span>
                ) : nudgeType === "type2" ? (
                  <span className={styles.subTwoBtn}>
                    {buttonText} <span>{buttonSubText}</span>
                  </span>
                ) : (
                  <span className={styles.subBtn}>{buttonText}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomStrip;
