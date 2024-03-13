"use client";
import Grid from "./Grid";
import Listing from "./Listing";
import styles from "./styles.module.scss";
import Overview from "./Overviews";
import { useStateContext } from "../../store/StateContext";

const StockRecosListing = (props: any) => {
  const { state, dispatch } = useStateContext();
  const { viewType } = state.StockRecosStatus;
  const { recosDetailResult, activeApi, slug } = props;

  return (
    <>
      {slug?.[0] == "overview" ? (
        <Overview data={recosDetailResult} />
      ) : viewType == "grid" ? (
        <Grid recosDetailResult={recosDetailResult} activeApi={activeApi} />
      ) : (
        <Listing recosDetailResult={recosDetailResult} activeApi={activeApi} />
      )}
    </>
  );
};

export default StockRecosListing;
