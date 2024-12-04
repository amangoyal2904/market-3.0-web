import { saveLogs } from "@/utils/utility";
import { APP_ENV } from "../utils";

const getApiUrl = (config: any, index: any) => {
  const { api = {}, url, params } = config;
  const { type = "" } = params;
  const { path } = api;
  const env = APP_ENV || "production";
  const domain = api.dns ? api.dns[env][index] || api.dns[env][0] : "";
  const urlPath =
    (type && path === "reactfeed" && `reactfeed_${type}.cms`) || api.path;
  return url || `${domain}${urlPath}`;
};

// Unified log function for MercuryClientRequest and MercuryServerRequest
const logError = (
  context: "MercuryClientRequest" | "MercuryServerRequest",
  config: any,
  error: any, // Keep as 'any' if the source of errors varies
) => {
  const isAxiosError = (err: any): err is { response: { status: number } } => {
    return err && err.response && typeof err.response.status === "number";
  };

  const errorMessage =
    error instanceof Error ? error.message : `HTTP error! Status: ${error}`;

  const statusCode = isAxiosError(error)
    ? `Status Code: ${error.response.status}`
    : "";

  saveLogs({
    type: context,
    res: "error",
    msg: `${errorMessage} ${statusCode}`.trim(),
    resData: config,
  });
};

const fetchData = async (
  method: "GET" | "POST",
  config: any,
  context: "MercuryClientRequest" | "MercuryServerRequest",
) => {
  const url = getApiUrl(config, 0);
  const cache = config.cache || false;
  if (cache) {
    config["cache"] = "no-store";
  }

  if (!config.headers) {
    config["headers"] = {};
  }

  const fetchOptions = {
    method,
    ...(method === "POST" && { body: JSON.stringify(config.payload) }),
    ...config,
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      logError(context, config, response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    logError(context, config, error);
    throw error; // Optionally re-throw the error for higher-level handling
  }
};

export const get = (config: any) => {
  const context =
    typeof window !== "undefined"
      ? "MercuryClientRequest"
      : "MercuryServerRequest";
  return fetchData("GET", config, context);
};

export const post = (config: any) => {
  const context =
    typeof window !== "undefined"
      ? "MercuryClientRequest"
      : "MercuryServerRequest";
  return fetchData("POST", config, context);
};

export default {
  get,
  post,
};
