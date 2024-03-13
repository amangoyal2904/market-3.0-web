"use client";
import Grid from "./Grid";
import Listing from "./Listing";
import styles from "./styles.module.scss";
import Overview from "./Overviews";
import { useStateContext } from "../../store/StateContext";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getStockRecosDetail } from "@/utils";

const StockRecosListing = (props: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const { viewType } = state.StockRecosStatus;
  const { recosDetailResult, activeApi, slug } = props;
  const pathName = usePathname();
  const [recosDetailJSON, setRecosDetailJSON] = useState(recosDetailResult);
  useEffect(() => {
    async function recosWatchList() {
      if (pathName.indexOf("recos-on-your-watchlist") != -1) {
        console.log(activeApi + "===" + slug);
        const recosDetailResult = await getStockRecosDetail({
          getApiType: activeApi,
          slug,
          ssoid: isLogin ? "ce1tl8rz8t1lk96gdlrxwquku" : "",
        });

        console.log(recosDetailResult);

        setRecosDetailJSON(recosDetailResult);
      }
    }

    recosWatchList();
    console.log("path changed", pathName);
  }, [pathName]);

  return (
    <>
      {slug?.[0] == "overview" ? (
        <Overview data={recosDetailJSON} />
      ) : viewType == "grid" ? (
        <Grid recosDetailResult={recosDetailJSON} activeApi={activeApi} />
      ) : (
        <Listing recosDetailResult={recosDetailJSON} activeApi={activeApi} />
      )}
    </>
  );
};

export default StockRecosListing;
