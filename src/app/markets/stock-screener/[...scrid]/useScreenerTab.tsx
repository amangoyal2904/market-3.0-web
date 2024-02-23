import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async ({ type }: any) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}?statstype=${type.toLowerCase()}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};
const useScreenerTab = async ({ type }: any) => {
  const tabData = await fetchTabsData({ type });
  const activeViewId = tabData[0].viewId;
  return {
    tabData,
    activeViewId,
  };
};

export default useScreenerTab;
