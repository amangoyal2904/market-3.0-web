
import { getParameterByName, APP_ENV } from "../utils";
const headerWhiteList = ["X-FORWARDED-FOR", "X-ISBOT", "fullcontent"];
const getApiUrl = (config:any, index:any) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = APP_ENV || "production";
  const domain = api.dns ? api.dns[env][index] || api.dns[env][0] : "";
  const urlPath = (type && path == "reactfeed" && `reactfeed_${type}.cms`) || api.path;
  const completeURL = url || domain + urlPath;
  return completeURL;
};

export const get = (config:any) => {
  try {
    const url = getApiUrl(config, 0);    
    if (!config.headers) {
      config["headers"] = {};
    }
    return fetch(url, config);
  } catch (e) {
    console.log("error in get request", e);
  }
};

export const post = async (config:any) => {
  const { payload } = config;
  const url = getApiUrl(config, 0);
  const response = await fetch(url, {
    method: "POST",
    data: payload,
    ...config
  });
  return response;
};

export default {
  get,
  post
};
