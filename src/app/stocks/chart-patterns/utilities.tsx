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

  // Add deviceType and appType to the headers
  headers.deviceType = "web";
  headers.appType = "etmarkets";

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

export const getPatternDescriptionText = (pattern: string) => {
  switch (pattern) {
    case "ascending-triangle":
      return "An <b>ascending triangle</b> is a bullish pattern with rising lows and flat resistance, signaling a potential breakout. Here are new chart patterns based on it.";
    case "symmetrical-triangle":
      return "A <b>symmetrical triangle</b> is a neutral pattern with converging trendlines, signaling a potential breakout in either direction. Here are new chart patterns based on it.";
    case "falling-wedge":
      return "A <b>falling wedge</b> is a bullish pattern with converging downward trendlines, indicating a potential breakout to the upside. Here are new chart patterns based on it.";
    case "rising-channel":
      return "A <b>rising channel</b> is a bullish pattern with parallel upward trendlines, suggesting continued upward momentum. Here are new chart patterns based on it.";
    default:
      return "AI Chart Pattern Past Performance provides insights into past patterns like Ascending Triangle, Symmetrical Triangle, and Falling Wedge, with quick summaries and performance metrics across various stocks";
  }
};
