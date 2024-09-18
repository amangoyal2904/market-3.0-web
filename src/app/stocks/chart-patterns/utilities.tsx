import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

// Helper function to build headers and request options
const buildRequestOptions = (
  payload: any,
  ssoid?: any,
  ticketid?: any,
  method: "POST" | "GET" = "POST",
) => {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (ssoid) headers.ssoid = ssoid;
  if (ticketid) headers.ticketid = ticketid;

  const options: any = {
    headers,
    ...(method === "POST" && { body: JSON.stringify(payload) }),
    params: {},
  };

  // Add `cache: "no-store"` only if both ssoid and ticketid are present
  if (ssoid && ticketid) options.cache = "no-store";

  return options;
};

// Fetch new chart pattern
export const getNewChartPattern = async (
  payload: any,
  ssoid?: any,
  ticketid?: any,
) => {
  try {
    const response = await service.post({
      url: `${(APIS_CONFIG as any)?.CHARTPATTERN_NEW[APP_ENV]}`,
      ...buildRequestOptions(payload, ssoid, ticketid),
    });

    const responseData = await response?.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

// Fetch past chart pattern
export const getPastChartPattern = async (
  payload: any,
  ssoid?: any,
  ticketid?: any,
) => {
  const response = await service.post({
    url: `${(APIS_CONFIG as any)?.CHARTPATTERN_PAST_ALL[APP_ENV]}`,
    ...buildRequestOptions(payload, ssoid, ticketid),
  });

  return await response?.json();
};

// Fetch past chart pattern
export const getPastChartPatternPerformance = async (
  payload: any,
  ssoid?: any,
  ticketid?: any,
) => {
  const response = await service.post({
    url: `${(APIS_CONFIG as any)?.CHARTPATTERN_PAST[APP_ENV]}`,
    ...buildRequestOptions(payload, ssoid, ticketid),
  });

  return await response?.json();
};

// Fetch explore chart pattern
export const getExploreChartPattern = async () => {
  const response = await service.get({
    url: `${(APIS_CONFIG as any)?.CHARTPATTERN_EXPLORE[APP_ENV]}`,
    params: {},
  });
  return await response?.json();
};

// Fetch Pattern List

export const getPatternFilterData = async () => {
  const response = await service.get({
    url: `${(APIS_CONFIG as any)?.PATTERN_FILTER_LIST[APP_ENV]}`,
    params: {},
  });
  return await response?.json();
};
