import GLOBAL_CONFIG from "../network/global_config.json";
import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV, getCookie } from "@/utils";
import { saveLogs } from "@/utils/utility";
import Service from "../network/service";
import { initSSOWidget } from "@/utils";
import jStorageReact from "jstorage-react";

export const freeTrialElegibilty = () => {
  const storedData = jStorageReact.get("et_freetrial");
  let userElegibilty = false;

  if (storedData && storedData?.eligible) {
    userElegibilty = true;
  }
  return userElegibilty;
};

export const activateFreeTrial = async () => {
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
          "X-CLIENT-ID": (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
          "Content-Type": "application/json",
          "X-TOKEN": getCookie("OTR"),
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
