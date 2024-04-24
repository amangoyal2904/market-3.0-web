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

export const commonPostAPIHandler = async (
  urlPathName: string,
  bodyParams: any,
) => {
  try {
    const apiUrl = (APIS_CONFIG as any)?.[urlPathName][APP_ENV];
    const response: any = await Service.post({
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ ...bodyParams }),
      params: {},
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in commonPostAPIHandler:", error);
    throw error; // Rethrow the error to handle it outside of this function
  }
};
