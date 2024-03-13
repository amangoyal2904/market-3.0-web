"use client";

import StockReco from "../StockReco";
import styles from "./styles.module.scss";
import Blocker from "../Blocker";
import { useStateContext } from "../../store/StateContext";

const Listing = (props: any) => {
  const { recosDetailResult, activeApi, urlFilterHandle } = props;
  const { state, dispatch } = useStateContext();
  const { isLogin } = state.login;

  return (
    <>
      {typeof recosDetailResult?.recoData?.[0].data != "undefined" ? (
        <div className={styles.listingWrap}>
          {recosDetailResult?.recoData?.[0].data.map(
            (recoDataValue: any, index: any) => {
              return (
                <StockReco
                  data={recoDataValue}
                  key={index}
                  activeTab={activeApi}
                  pageName="stockRecosPage"
                  urlFilterHandle={urlFilterHandle}
                />
              );
            },
          )}
        </div>
      ) : (
        <div className={`${styles.listingWrap} ${styles.noDataFound}`}>
          {activeApi == "recoOnWatchlist" && !isLogin ? (
            <Blocker type="loginBlocker" />
          ) : (
            <Blocker type={"noDataFound"} />
          )}
        </div>
      )}
    </>
  );
};

export default Listing;
