"use client";

import StockReco from "../StockReco";
import styles from "./styles.module.scss";
import Blocker from "../Blocker";
import { useStateContext } from "../../store/StateContext";

const Listing = (props: any) => {
  const { recosDetailResult, activeApi, urlFilterHandle } = props;
  const { state, dispatch } = useStateContext();
  const { watchlist } = state.watchlistStatus;

  return (
    <>
      {typeof recosDetailResult != "undefined" && (
        <div
          className={`${styles.listingWrap} ${recosDetailResult.length < 3 ? styles.noGridCardView : ""}`}
        >
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
