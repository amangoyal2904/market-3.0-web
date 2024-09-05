import { useEffect } from "react";
import { useStateContext } from "@/store/StateContext";
import {
  delete_cookie,
  loadPrimeApiNew,
  setCookieToSpecificTime,
  verifyLogin,
} from "@/utils";
import { fetchAllWatchListData, saveLogs } from "@/utils/utility";
import { activateFreeTrial } from "@/utils/freeTrail";
import { trackingEvent } from "@/utils/ga";
import jStorageReact from "@/utils/jStorageReact";

const useLogin = (frmapp: string = "", platform: string = "") => {
  const { dispatch } = useStateContext();

  const fetchWatchListStocks = async () => {
    const data = await fetchAllWatchListData(2, 11);
    let watchlistArr = [];
    if (data?.resData?.length > 0) {
      watchlistArr = data?.resData.map((entry: any) => {
        return (
          entry.companyType && {
            companyId: entry.prefDataVal,
            companyType: entry.id,
          }
        );
      });
    } else if (data?.length > 0) {
      watchlistArr = data.map((entry: any) => {
        return (
          entry.companyType && {
            companyId: entry.prefDataVal,
            companyType: entry.companyType,
          }
        );
      });
    }
    if (watchlistArr.length > 0) {
      dispatch({
        type: "UPDATE_MSID",
        payload: {
          watchlist: watchlistArr,
        },
      });
    }
  };

  const verifyLoginSuccessCallback = async () => {
    try {
      fetchWatchListStocks();
      const primeRes = await loadPrimeApiNew();
      if (primeRes.code === "200") {
        const resObj = primeRes.data.productDetails.filter((item: any) => {
          return item.productCode == "ETPR";
        });
        const oauthAPiRes = resObj[0];
        const isPrime =
          primeRes.data &&
          oauthAPiRes.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("subscribed");
          });
        window.objUser.permissions = oauthAPiRes.permissions || [];
        window.objUser.accessibleFeatures =
          oauthAPiRes.accessibleFeatures || [];
        window.objUser.userAcquisitionType =
          oauthAPiRes.subscriptionDetail &&
          "userAcquisitionType" in oauthAPiRes.subscriptionDetail
            ? oauthAPiRes.subscriptionDetail.userAcquisitionType
            : "free";
        window.objUser.primeInfo = oauthAPiRes;
        window.objUser.isPrime = isPrime;
        setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");
        if (primeRes?.data?.token) {
          setCookieToSpecificTime("OTR", primeRes?.data?.token, 30, 0, 0, "");
        }
        setCookieToSpecificTime("etprc", oauthAPiRes.prc, 30, 0, 0);
        trackingEvent("user_profile_create", { url: window.location.href });

        const freeTrialData = jStorageReact.get("et_freetrial");
        if (freeTrialData?.hitAccessPass) {
          setTimeout(() => {
            activateFreeTrial();
          }, 500);
        }

        saveLogs({
          type: "Mercury",
          res: "SUCCESS",
          msg: "verifyLoginSuccessCallback",
          resData: primeRes.data,
          objUser: window.objUser,
        });
      } else {
        window.objUser.permissions = [];
        window.objUser.accessibleFeatures = [];
        window.objUser.userAcquisitionType = "free";
        window.objUser.primeInfo = {};
        window.objUser.isPrime = false;
        delete_cookie("isprimeuser");
        if (primeRes && primeRes.data && primeRes.data.token) {
          delete_cookie("OTR");
        }
        saveLogs({
          type: "Mercury",
          res: "Fail",
          msg: "verifyLoginSuccessCallback",
          resData: primeRes,
          objUser: window.objUser,
        });
      }
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ssoReady: true,
          isLogin: true,
          isPrime: window.objUser.isPrime,
          userInfo: window.objUser?.info,
          ssoid: window.objUser?.ssoid,
          ticketId: window.objUser?.ticketId,
          accessibleFeatures: window.objUser.accessibleFeatures,
          userAcquisitionType: window.objUser.userAcquisitionType,
          permissions: window.objUser.permissions,
          subscriptionDetails: window.objUser.primeInfo?.subscriptionDetails,
        },
      });
    } catch (e) {
      console.log("verifyLogin Catch", e);
    }
  };

  const getUserDetailsSuccessCallback = () => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        ssoReady: true,
        isLogin: true,
        isPrime: window.objUser.isPrime,
        userInfo: window.objUser?.info,
        ssoid: window.objUser?.ssoid,
        ticketId: window.objUser?.ticketId,
        accessibleFeatures: window.objUser.accessibleFeatures,
        userAcquisitionType: window.objUser.userAcquisitionType,
        permissions: window.objUser.permissions,
        subscriptionDetails: window.objUser.primeInfo?.subscriptionDetails,
      },
    });
  };

  const authFailCallback = () => {
    dispatch({
      type: "LOGOUT",
      payload: {
        ssoReady: true,
        isLogin: false,
        isPrime: false,
        userInfo: {},
        ssoid: "",
        ticketId: "",
        accessibleFeatures: [],
        userAcquisitionType: "free",
        permissions: [],
        primeInfo: {},
      },
    });
  };

  const jssoLoadedCallback = () => {
    verifyLogin();
  };

  useEffect(() => {
    document.addEventListener("jssoLoaded", jssoLoadedCallback);
    document.addEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
    document.addEventListener("verifyLoginFail", authFailCallback);
    document.addEventListener(
      "getUserDetailsSuccess",
      getUserDetailsSuccessCallback,
    );
    document.addEventListener("getUserDetailsFail", authFailCallback);
    return () => {
      document.removeEventListener("jssoLoaded", jssoLoadedCallback);

      document.removeEventListener(
        "verifyLoginStatus",
        verifyLoginSuccessCallback,
      );
      document.removeEventListener("verifyLoginFail", authFailCallback);

      document.removeEventListener(
        "getUserDetailsSuccess",
        getUserDetailsSuccessCallback,
      );
      document.removeEventListener("getUserDetailsFail", authFailCallback);
    };
  }, []);
};

export default useLogin;
