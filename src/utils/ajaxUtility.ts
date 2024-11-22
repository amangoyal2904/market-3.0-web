import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";
import Service from "@/network/service";

/**
 * Sends a GET request to the specified endpoint with optional query parameters.
 *
 * @param {string} endpoint - The API endpoint to which the request will be sent.
 * @param {any} filters - Query parameters to append to the endpoint URL. These will be serialized into a query string.
 * @returns {Promise<any>} - A Promise resolving to the response data from the API.
 *
 * @example
 * const response = await getRequest('/api/users', { page: 1, limit: 10 });
 * console.log(response);
 */

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

/**
 * Sends a POST request to the specified endpoint with the provided request body and headers.
 *
 * @param {string} endpoint - The API endpoint to which the request will be sent.
 * @param {any} [bodyObj] - Optional. The payload to include in the request body. Default is an empty object.
 * @param {any} [headers] - Optional. Custom headers to include in the request. Default is undefined.
 * @returns {Promise<any>} - A Promise resolving to the response data from the API.
 *
 * @example
 * const response = await postRequest('/api/login', { username: 'john', password: '12345' }, { 'Content-Type': 'application/json' });
 * console.log(response);
 */

export const postRequest = async (
  endpoint: string,
  bodyObj?: any,
  headers?: any,
) => {
  let baseUrl = `${(APIS_CONFIG as any)?.[endpoint][APP_ENV]}`;
  const response = await Service.post({
    url: baseUrl,
    body: bodyObj ? JSON.stringify(bodyObj) : {},
    params: {},
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  const originalJson = await response?.json();
  return originalJson;
};
