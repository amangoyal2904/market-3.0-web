"use client";
import styles from "./styles.module.scss";
import { FC, useEffect } from "react";
import { useStateContext } from "@/store/StateContext";
import { usePathname } from "next/navigation";
import adFreePages from "@/components/Ad/AdInfo/adFree.json";

declare global {
  interface Window {}
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
  const router = usePathname();
  const adfreeTemplate =
    adFreePages &&
    adFreePages.some(function (v) {
      return router.indexOf(v) > -1;
    });
  const { state } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const { adInfo } = props;
  //const router = useRouter();

  //    let objAd:{
  //     id:string;
  //     adslot:string;
  //     adsize:string;
  //    }

  //    useEffect(
  //     () => {
  //         objAd ={
  //             id:adInfo.id,
  //             adslot:adInfo.slot,
  //             adsize:adInfo.size

  //             };

  //     if(window.arrAdsDivs){
  //         window.arrAdsDivs?.push(adInfo.id);
  //         window.arrDfpAds?.push(objAd);
  //     }else{
  //         window.arrAdsDivs = [adInfo.id]
  //         window.arrDfpAds = [objAd];
  //     }

  //     },
  //     [adInfo]
  //   );

  return (
    !isPrime &&
    !adfreeTemplate && (
      <>
        <div className={`${styles.midAdContainer} hideAd`}>
          <div id={adInfo.id} className="dfpAd"></div>
        </div>
      </>
    )
  );
};

export default DfpAds;
