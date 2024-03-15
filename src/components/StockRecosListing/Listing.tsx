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
      {typeof recosDetailResult != "undefined" && (
        <div className={styles.listingWrap}>
          {recosDetailResult?.map((recoDataValue: any, index: any) => {
            return (
              <StockReco
                data={recoDataValue}
                key={index}
                activeTab={activeApi}
                pageName="stockRecosPage"
                urlFilterHandle={urlFilterHandle}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default Listing;
