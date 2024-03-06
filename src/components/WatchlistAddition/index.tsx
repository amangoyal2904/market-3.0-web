import { useState } from "react";
import styles from "./styles.module.scss";
import { saveStockInWatchList } from "../../utils/utility";
import { initSSOWidget } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";

const WatchlistAddition = ({
  companyData,
  companyName,
  companyId,
  companyType,
  customStyle,
}: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoReady } = state.login;
  const { watchlist } = state.watchlistStatus;
  const [loadingStatus, setLoadingStatus] = useState(false);

  const addStockInWatchlistHandler = (companyData: any, action: any) => {
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
    console.log("stockDetails---", stockDetails, companyData);
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
    console.log("getMoreDetailsStockWatchList---", data);
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

    console.log("data----", data, type);

    const addWathlistResAPI = await saveStockInWatchList(followData);
    if (addWathlistResAPI?.status === "success") {
      const newWatchList =
        action == 1
          ? [...watchlist, data.companyId]
          : watchlist.filter((item: any) => item !== data.companyId);

      dispatch({
        type: "UPDATE_MSID",
        payload: {
          watchlist: newWatchList,
        },
      });

      console.log("newWatchList----", newWatchList, action);
    } else if (addWathlistResAPI?.status === "failure") {
      alert(addWathlistResAPI.meessage);
    }

    setLoadingStatus(false);
  };

  const handleWatchListClick = () => {
    if (isLogin) {
      console.log("watchlist----------", watchlist, companyData);
      const watchlistStatus = watchlist.includes(companyId) ? 0 : 1;
      console.log("watchlistStatus---", watchlistStatus);
      setLoadingStatus(true);
      addStockInWatchlistHandler(companyData, watchlistStatus);
    } else {
      initSSOWidget();
    }
  };
  const defaultStyle = {
    position: "relative",
  };
  const mergedStyle = { ...defaultStyle, ...customStyle };

  return (
    <>
      {ssoReady && (
        <span
          style={mergedStyle}
          onClick={handleWatchListClick}
          className={styles.watchlistPlusWrap}
        >
          {loadingStatus ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : watchlist.includes(companyId) ? (
            <span className="eticon_tick"></span>
          ) : (
            <span className="eticon_add"></span>
          )}
        </span>
      )}
    </>
  );
};

export default WatchlistAddition;
