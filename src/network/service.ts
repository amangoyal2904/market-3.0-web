import { getParameterByName, APP_ENV } from "../utils";
const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];
const getApiUrl = (config: any, index: any) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = APP_ENV || "production";
  const domain = api.dns ? api.dns[env][index] || api.dns[env][0] : "";
  const urlPath =
    (type && path == "reactfeed" && `reactfeed_${type}.cms`) || api.path;
  const completeURL = url || domain + urlPath;
  return completeURL;
};

export const get = async (config: any) => {
  try {
    //console.log("config----", config);
    const url = getApiUrl(config, 0);
    //console.log("url------", url);
    const cache = config.cache ? config.cache : "false";
    if (cache) {
      config["cache"] = "no-store";
    }
    if (!config.headers) {
      config["headers"] = {};
    }
    const response = await fetch(url, { ...config });
    //console.log(response?.json())
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (e) {
    //console.log("error in get request", e);
  }
};

export const post = async (config: any) => {
  try {
    const { payload } = config;
    const url = getApiUrl(config, 0);
    const cache = config.cache ? config.cache : "false";
    if (cache) {
      config["cache"] = "no-store";
    }
    const response = await fetch(url, {
      method: "POST",
      data: payload,
      ...config,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (e) {
    //console.log("error in post request", e);
  }
};

export default {
  get,
  post,
};
