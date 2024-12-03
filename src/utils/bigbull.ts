import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";

export const fetchPostCommonAPI = async (
  bodyParams: any,
  isprimeuser: any,
  ssoid: any,
  apiType: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.[apiType][APP_ENV];
  const response = await service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
      isprime: isprimeuser,
    },
    cache: "no-store",
    body: JSON.stringify({ ...bodyParams }),
    params: {},
  });
  const resJson = response?.json();
  return resJson;
};

export const fetchGetCommonAPI = async ({
  type,
  searchParam = "",
  ssoid = "",
}: any) => {
  const apiUrl = (APIS_CONFIG as any)?.[type][APP_ENV];
  const response = await service.get({
    url: `${apiUrl}${searchParam}`,
    params: {},
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
    },
  });
  return response?.json();
};
