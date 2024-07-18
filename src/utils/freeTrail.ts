import jStorageReact from "jstorage-react";

import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV, getCookie } from "@/utils";
import { saveLogs } from "@/utils/utility";
import Service from "../network/service";
import { initSSOWidget } from "@/utils";

export const freeTrialElegibilty = () => {
  const storedData = jStorageReact.get("et_freetrial");
  let userElegibilty = false;

  if (storedData && storedData?.eligible) {
    userElegibilty = true;
  }
  return userElegibilty;
};

export const activateFreeTrial = async () => {
  const isLive = APP_ENV == "development" ? 0 : 1;
  const storedData = jStorageReact.get("et_freetrial");

  try {
    if (typeof window.objUser.info != "undefined") {
      const apiUrl = (APIS_CONFIG as any)?.["ACCESS_PASS"][APP_ENV];
      const response: any = await Service.post({
        url: apiUrl,
        body: JSON.stringify({}),
        datatype: "json",
        params: {},
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN":
            getCookie("OTR") ||
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYmVlYmM5Mi1jNjYyLTQ5N2QtYWM1Yi0wMWJjNmY4ZjM3ZDYiLCJpc3MiOiJldC1vYXV0aC5jb20iLCJ0eXBlIjoibG9nZ2VkaW4iLCJleHAiOjE3MjM4Njk4NjkyOTgsImlhdCI6MTcyMTI3Nzg2OTI5OCwiaGFzaCI6IjU0NTg1NTliYzM4NDY3Yjg5M2NjMzkxNzhkMWZiZGVhIn0.w6RGLCvPoc02u6B1ZOLcdS5LBOy4chOA3_PAHKtYPy0",
          "X-CLIENT-ID": isLive
            ? "b2a8e883ec676f417520f422068a4742"
            : "w2a8e883ec676f417520f422068a4741",
        },
      });
      const accessPassData = await response?.json();
      console.log("## Access Pass Response ## ", accessPassData);

      storedData.hitAccessPass = false;
      jStorageReact.set("et_freetrial", storedData);

      if (
        accessPassData?.code === 7701 &&
        accessPassData?.msg === "SUBSCRIPTION_CREATED_SUCCESSFUL"
      ) {
        window.location.href = "/access_pass_success.cms";
        console.log("Success");
      } else if (accessPassData.code == 7700) {
        const freeTrialListner = new CustomEvent("freeTrialStateChange", {
          detail: "availedAPError",
        });
        document.dispatchEvent(freeTrialListner);
      } else {
        const freeTrialListner = new CustomEvent("freeTrialStateChange", {
          detail: "invalidAPHit",
        });
        document.dispatchEvent(freeTrialListner);
        saveLogs({
          type: "Mercury_AccessPass",
          error: accessPassData,
          origin: "activateFreeTrial",
        });
      }
    } else {
      storedData.hitAccessPass = true;
      jStorageReact.set("et_freetrial", storedData);
      initSSOWidget();
    }
  } catch (e) {
    saveLogs({
      type: "Mercury_AccessPass",
      res: e,
      msg: "Error in Access Pass data",
    });
  }
};
