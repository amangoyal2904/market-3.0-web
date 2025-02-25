import service from "../network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV, getCookie } from "@/utils";

export const createNewScreener = async (bodyParams: any) => {
  const apiUrl = (APIS_CONFIG as any)?.["SaveScreenerAPI"][APP_ENV];
  const response = await service.post({
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
  ssoid?: any,
  ticketId?: any,
) => {
  try {
    const userSsoId = getCookie("ssoid");
    const apiUrl = (APIS_CONFIG as any)?.[urlPathName][APP_ENV];
    // Check if we are in a browser environment
    const isBrowser = typeof window !== "undefined";
    // Fetch ssoid and ticketId from cookies if not provided and we're in the browser
    const finalSsoid = ssoid || (isBrowser ? getCookie("ssoid") || "" : "");
    const finalTicketId =
      ticketId || (isBrowser ? getCookie("TicketId") || "" : "");

    const response: any = await service.post({
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
        ssoid: finalSsoid,
        ticketId: finalTicketId,
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

export const commonGetAPIHandler = async (urlPathName: string, query = "") => {
  try {
    const apiUrl = `${(APIS_CONFIG as any)?.[urlPathName][APP_ENV]}${query && query !== "" ? query : ""}`;
    const response: any = await service.get({
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      params: {},
    });

    if (!response?.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in commonGetAPIHandler:", error);
    throw error; // Rethrow the error to handle it outside of this function
  }
};
