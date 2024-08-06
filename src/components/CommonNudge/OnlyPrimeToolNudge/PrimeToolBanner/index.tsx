import styles from "./styles.module.scss";
import Image from "next/image";
import { redirectToPlanPage } from "@/utils/ga";
import { useEffect } from "react";
const PrimeToolBanner = ({
  closeHandler,
  bannerType = "a",
  bannerText,
  btnTxt,
  subBannerText,
}: any) => {
  const checkUserType = (value: string) => {
    let lableText = "";
    if (value === "a") {
      lableText = "Top Nudge_1";
    } else if (value === "b") {
      lableText = "Top Nudge_2";
    }
    return lableText;
  };
  const objTracking = {
    category: "Subscription Flow ET",
    action: "Flow Started | SYFT",
    label: `${checkUserType(bannerType)}`,
    obj: {
      item_name: `${checkUserType(bannerType)}`,
      item_brand: "product_interventions",
      item_category: "subscription_nudges",
      item_category2: "",
      item_category3: "subscription_nudges",
      item_category4: btnTxt,
      item_id: "",
    },
    cdp: {
      event_nature: "click",
      event_category: "subscription",
      event_name: "paywall",
      cta_text: btnTxt,
    },
  };
  useEffect(() => {
    const newObjTracking = { ...objTracking };
    newObjTracking.action = "Blocker impression";
    redirectToPlanPage(newObjTracking, "view_item_list", false);
  }, []);
  return (
    <>
      <div
        className={`${styles.toolPageWraper} ${bannerType === "b" ? styles.optionTwo : ""}`}
      >
        <div className={styles.info_content}>
          <span className={styles.info_icon}>
            {bannerType === "b" ? (
              <Image
                src={`/img/unlockPower.png`}
                height={50}
                width={128}
                alt="prime image logo"
              />
            ) : (
              <Image
                src={`/img/primeimg2.png`}
                height={50}
                width={91}
                alt="prime image"
              />
            )}
          </span>
          <div className={styles.tac}>
            {bannerType === "b" ? (
              <span className={styles.subBannerTxt}>{subBannerText}</span>
            ) : (
              ""
            )}
            <p className={styles.info_text}>{bannerText}</p>
          </div>
          <span
            className={styles.info_cta}
            onClick={() => redirectToPlanPage(objTracking)}
          >
            {btnTxt}
          </span>
          <span
            className={styles.info_cross}
            onClick={() => closeHandler()}
          ></span>
        </div>
      </div>
    </>
  );
};

export default PrimeToolBanner;
