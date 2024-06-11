import styles from "./styles.module.scss";
import Image from "next/image";

import { initSSOWidget } from "@/utils";
import { useStateContext } from "@/store/StateContext";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import { useEffect, useState } from "react";
import { redirectToPlanPage } from "@/utils/ga";

const NonPrimeBlockerModule = ({ oncloseModule, companyName }: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime } = state.login;
  const [ctaTxt, setCtaTxt] = useState("");
  const [text, setText] = useState("");
  const signHandler = () => {
    oncloseModule();
    initSSOWidget();
  };
  const getDataFromMetalist = async () => {
    const apiUrl = (APIS_CONFIG as any)?.["DOMAIN"][APP_ENV];
    const _feedparameters =
      "/reactfeed_metainfo.cms?msid=104293917&feedtype=json&type=nonprimedata";
    const res = await fetch(`${apiUrl}${_feedparameters}`);
    const resData = await res.json();
    if (resData && resData.data && resData.data.ctaText) {
      setCtaTxt(resData.data.ctaText);
    }
    if (resData && resData.data && resData.data.text) {
      setText(resData.data.text);
    }

    //console.log(resData.data, "____resData")
  };
  const objTracking = {
    category: "Subscription Flow ET",
    action: "SYFT | Flow Started",
    label: `BigBull_${companyName}`,
    obj: {
      item_name: "bigbull_investors",
      item_id: companyName,
      item_brand: "market_tools",
      item_category: "bigbull",
      item_category2: "bigbull_investors",
      item_category3: "paywall_blocker_cta",
      item_category4: "Subscribe to ETPrime",
    },
  };
  const planPageRedirect = () => {
    redirectToPlanPage(objTracking);
  };
  useEffect(() => {
    getDataFromMetalist();
  }, []);
  return (
    <>
      <div className={styles.nonPrimeSec}>
        <div className={styles.overlay} onClick={oncloseModule}></div>
        <div className={styles.nonPrimeWrap}>
          <div className={styles.header}>
            <span className={styles.closeIcon} onClick={oncloseModule}></span>
          </div>
          <div className={styles.contentSec}>
            <div className={styles.left}>
              <img
                src="/marketsweb/img/nonprimebg.png"
                alt="Prime logo"
                title="Prime logo"
                width={400}
                height={300}
              />
            </div>
            <div className={styles.right}>
              <div className={styles.topSec}>
                <div className={styles.head}>
                  {/* <span className={styles.etprimeLogo}>ETPrime</span>
                  <span className={styles.bigLogo}>Big</span>
                  <span className={styles.bullTxt}>Bull Portfolio</span> */}
                </div>
                <p className={styles.subHead}>
                  Get to know where the big bulls are investing & identify the
                  right opportunity.
                </p>
              </div>
              <div className={styles.middle}>
                {/* <div className={styles.joinTxt}>
                  {text} <span></span>
                </div> */}
                <div className={styles.btnSec}>
                  <span onClick={planPageRedirect} className={styles.subBtn}>
                    {ctaTxt}
                  </span>
                  <span onClick={planPageRedirect} className={styles.boxTxt}>
                    {text}
                  </span>
                </div>
                <div className={styles.loginSec}>
                  {!isLogin && (
                    <p>
                      Already a member?{" "}
                      <span className={styles.signTxt} onClick={signHandler}>
                        Sign in Now
                      </span>{" "}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.etPrimeBenef}>benefits you get</div>
                <ul className={styles.btnList}>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.stockRplus}`}
                      ></span>
                      <p>Stock Reports Plus</p>
                    </div>
                  </li>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.marketMood}`}
                      ></span>
                      <p>
                        Market
                        <br /> Mood
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.stockAnalyzer}`}
                      ></span>
                      <p>Stock Analyzer</p>
                    </div>
                  </li>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.inverstmentIdeas}`}
                      ></span>
                      <p>Investment Ideas</p>
                    </div>
                  </li>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.epaper}`}
                      ></span>
                      <p>Epaper</p>
                    </div>
                  </li>
                  <li>
                    <div className={styles.wrap}>
                      <span
                        className={`${styles.listIcon} ${styles.etprimeExclusives}`}
                      ></span>
                      <p>ETPrime Exclusives</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NonPrimeBlockerModule;
