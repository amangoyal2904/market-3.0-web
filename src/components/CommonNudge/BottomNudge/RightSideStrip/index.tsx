import { useEffect } from "react";
import Image from "next/image";

import { freeTrialElegibilty, activateFreeTrial } from "@/utils/freeTrail";
import { redirectToPlanPage } from "@/utils/ga";

import ETLogo from "../../../../../public/img/et-markets-logo.svg";
import styles from "./styles.module.scss";

const RightSideStrip = ({
  nudgeType,
  closeHandler,
  bannerText,
  buttonText,
  buttonSubText,
}: any) => {
  const validAccessPass = freeTrialElegibilty();
  const checkUserType = (value: string) => {
    let lableText = "";
    if (value === "type1") {
      lableText = "Bottom Nudge_2_A";
    } else if (value === "type2") {
      lableText = "Bottom Nudge_2_B";
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

  const planRedirection = () => {
    validAccessPass ? activateFreeTrial() : redirectToPlanPage(objTracking);
  };

  useEffect(() => {
    const newObjTracking = { ...objTracking };
    newObjTracking.action = "Blocker impression";
    redirectToPlanPage(newObjTracking, "view_item_list", false);
  }, []);

  return (
    <>
      <div className={`${styles.mainWraper} ${styles[nudgeType]}`}>
        <div className={styles.mainSecStrip}>
          <span className={styles.closeSec} onClick={closeHandler}></span>
          <div className={styles.left}>
            <div className={styles.smallBg}></div>
          </div>
          <div className={styles.right}>
            <Image
              src={ETLogo}
              width={96}
              height={17}
              quality={100}
              alt="ET Markets"
              title="ET Markets"
            />
            <p className={styles.ptext}>{bannerText}</p>
            <div className={styles.btnSec}>
              {buttonSubText && buttonSubText !== "" ? (
                <span className={styles.btnStrip}>{buttonSubText}</span>
              ) : (
                ""
              )}
              <span className={styles.btnEtPrime} onClick={planRedirection}>
                {validAccessPass ? "Start Free Trial" : buttonText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideStrip;
