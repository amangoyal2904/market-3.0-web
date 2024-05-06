"use client";
import styles from "./styles.module.scss";
import { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { useStateContext } from "@/store/StateContext";

declare global {
  interface Window {
    arrDfpAds: {}[];
    arrAdsDivs: string[];
  }
}
interface AdInfoProps {
  adInfo: {
    key?: string;
    slot: string;
    size: string;
    id: string;
  };
}

const DfpAds: FC<AdInfoProps> = function (props) {
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const { adInfo } = props;
  //const router = useRouter();

  let objAd: {
    id: string;
    adslot: string;
    adsize: string;
  };

  useEffect(() => {
    objAd = {
      id: adInfo.id,
      adslot: adInfo.slot,
      adsize: adInfo.size,
    };

    if (window.arrAdsDivs) {
      window.arrAdsDivs?.push(adInfo.id);
      window.arrDfpAds?.push(objAd);
    } else {
      window.arrAdsDivs = [adInfo.id];
      window.arrDfpAds = [objAd];
    }
  }, [adInfo]);

  return (
    !isPrime && (
      <>
        <div className={styles.midAdContainer}>
          <div id={adInfo.id} className="dfpAd"></div>
        </div>
      </>
    )
  );
};

export default DfpAds;
