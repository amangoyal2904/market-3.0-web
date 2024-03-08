import Service from "../network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

export const createNewScreener = async (bodyParams: any) => {
  const apiUrl = (APIS_CONFIG as any)?.["SaveScreenerAPI"][APP_ENV];
  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ ...bodyParams }),
    params: {},
  });
  return response?.json();
};
