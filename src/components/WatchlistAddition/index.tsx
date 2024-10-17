import { useState } from "react";
import styles from "./styles.module.scss";
import { saveStockInWatchList } from "../../utils/utility";
import { initSSOWidget } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import { trackingEvent } from "@/utils/ga";
import toast from "react-hot-toast";

const WatchlistAddition = ({
  companyName,
  companyId,
  companyType,
  customStyle,
  customeFun,
}: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoReady } = state.login;
  const { watchlist } = state.watchlistStatus;
  const [loadingStatus, setLoadingStatus] = useState(false);

  const addStockInWatchlistHandler = (action: any) => {
    const stockDetails = {
      companyName,
      companyType,
      companyId,
    };
    saveStockInWatchListHandler(action, stockDetails);
  };

  const saveStockInWatchListHandler = async (action: any, data: any) => {
    const stockData = [
      {
        action,
        stock: {
          id: data?.companyId,
          companyType: data?.companyType,
        },
      },
    ];

    const response = await saveStockInWatchList(stockData);
    const addWathlistResAPI = response[0];
    if (addWathlistResAPI?.statusCode === 200) {
      const updatedWatchlist =
        action == 1
          ? [
              ...watchlist,
              {
                companyId: data?.companyId?.toString(),
                companyType: data?.companyType,
              },
            ]
          : watchlist.filter(
              (item: any) =>
                item.companyId != data?.companyId?.toString() ||
                item.companyType != data?.companyType,
            );

      if (action == 1) {
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "watchlist_add_stock_success",
          event_label: data?.companyName + "-" + data?.companyId,
        });

        toast((t) => (
          <span className="errorToast">
            <span>
              <b>{data?.companyName}</b> added to Watchlist
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <i className="eticon_cross"></i>
            </button>
          </span>
        ));
      } else {
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "watchlist_remove_stock_success",
          event_label: data?.companyName + "-" + data?.companyId,
        });

        toast((t) => (
          <span className="errorToast">
            <span>
              <b>{data?.companyName}</b> removed from Watchlist
            </span>
            <button onClick={() => toast.dismiss(t.id)}>
              <i className="eticon_cross"></i>
            </button>
          </span>
        ));
      }

      dispatch({
        type: "UPDATE_MSID",
        payload: {
          watchlist: updatedWatchlist,
        },
      });
    } else if (addWathlistResAPI?.statusCode === 513) {
      toast((t) => (
        <span className="errorToast">
          <span>
            {` You've reached the limit of stocks in your watchlist! Consider
            removing some stocks to add new ones.`}
          </span>
          <button onClick={() => toast.dismiss(t.id)}>
            <i className="eticon_cross"></i>
          </button>
        </span>
      ));
    } else {
      toast((t) => (
        <span className="errorToast">
          <span>
            Oops! There is some error while updating watchlist. Please retry.
          </span>
          <button onClick={() => toast.dismiss(t.id)}>
            <i className="eticon_cross"></i>
          </button>
        </span>
      ));
    }
    setLoadingStatus(false);
    customeFun ? customeFun() : null;
  };

  const handleWatchListClick = () => {
    if (isLogin) {
      console.log("watchlist----------", watchlist);
      const watchlistStatus =
        typeof companyId != "undefined" &&
        !!watchlist &&
        watchlist.some(
          (item: any) =>
            item.companyId === companyId?.toString() &&
            item.companyType === companyType,
        )
          ? 0
          : 1;
      setLoadingStatus(true);
      addStockInWatchlistHandler(watchlistStatus);
    } else {
      initSSOWidget();
    }
  };
  //console.log("companyId --- watchlist", companyId);
  const mergedStyle = { ...customStyle };
  const watchlistCheck =
    typeof companyId != "undefined" &&
    !!watchlist &&
    watchlist.some(
      (item: any) =>
        item?.companyId === companyId?.toString() &&
        item?.companyType === companyType,
    );
  return (
    <>
      {ssoReady && companyId && (
        <span
          style={mergedStyle}
          onClick={handleWatchListClick}
          className={styles.watchlistPlusWrap}
          title={
            loadingStatus
              ? ""
              : watchlistCheck
                ? "Added to watchlist"
                : "Add to watchlist"
          }
        >
          {loadingStatus ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : watchlistCheck ? (
            <span className="eticon_tick icon_22 bold"></span>
          ) : (
            <span className="eticon_add bold"></span>
          )}
        </span>
      )}
    </>
  );
};

export default WatchlistAddition;
