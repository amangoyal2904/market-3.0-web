import { useState } from "react";
import styles from "./styles.module.scss";
import { saveStockInWatchList } from "../../utils/utility";
import { initSSOWidget } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
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
    // const companytType =
    //   companyData?.entityType === "company" && !companyData.subType
    //     ? "equity"
    //     : companyData.subType || "equity";
    //const { companyName, companyId, companyid } = companyData;

    const stockDetails = {
      companyName,
      companyType,
      companyId,
    };
    const type = 11;
    console.log("stockDetails---", stockDetails);
    getMoreDetailsStockWatchList(action, stockDetails, type);
  };

  const getMoreDetailsStockWatchList = async (
    action: any,
    data: any,
    type: any,
  ) => {
    const API_URL = (APIS_CONFIG as any).GETCompanyShortData[APP_ENV];
    const ApiFullURL = `${API_URL}?companyid=${data.companyId}&companytype=${data.companyType}`;
    if (action == 1) {
      const apiRes = await fetch(ApiFullURL);
      const jsonRes = await apiRes.json();
      let ltp = "",
        exch: any = "";
      if (jsonRes.nse?.current) {
        ltp = jsonRes.nse.current;
        exch = 50;
      } else if (jsonRes.bse?.current) {
        ltp = jsonRes.bse.current;
        exch = 47;
      }
      data.ltp = ltp;
      data.exchange = exch;
    }
    saveStockInWatchListHandler(action, data, type);
  };

  const saveStockInWatchListHandler = async (
    action: any,
    data: any,
    type: any,
  ) => {
    const followData = {
      action,
      applicationname: 1,
      articletype: type || "11",
      position: 0,
      source: 0,
      stype: 2,
      ...(type == 22 || type == 23
        ? { msid: data.id }
        : {
            companytype: data.companyType,
            msid: data.companyId,
          }),
      ...(type == 11 &&
        action == 1 && {
          propertiesList: [
            { key: "companyName", value: data.companyName },
            { key: "priceOnDate", value: data.ltp },
            { key: "updatedPrice", value: data.ltp },
            { key: "exchange", value: data.exchange },
          ],
        }),
    };

    //console.log("data----", data, type);

    const addWathlistResAPI = await saveStockInWatchList(followData);
    if (addWathlistResAPI?.status === "success") {
      const newWatchList =
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
          watchlist: newWatchList,
        },
      });

      console.log("newWatchList----", newWatchList, action);
    } else if (addWathlistResAPI?.status === "failure") {
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
