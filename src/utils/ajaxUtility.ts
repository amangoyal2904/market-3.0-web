import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "@/network/service";

export const getRequest = async (endpoint: string, filters: any) => {
  const queryFilters = new URLSearchParams(filters).toString();
  let baseUrl = `${(APIS_CONFIG as any)?.[endpoint][APP_ENV]}`;
  if (queryFilters) {
    baseUrl += (queryFilters.includes("?") ? "&" : "?") + queryFilters;
  }

  const response = await Service.get({
    url: baseUrl,
    params: {},
  });
  const originalJson = await response?.json();
  return originalJson;
};
