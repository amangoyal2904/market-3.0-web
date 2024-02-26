import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async () => {
  const apiUrl = `${(APIS_CONFIG as any)?.["SCREENER"]?.["screenerListTab"][APP_ENV]}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};
const useScreenerTab = async () => {
  const tabData = await fetchTabsData();
  const activeViewId = tabData[0]?.viewId;
  return {
    tabData,
    activeViewId,
  };
};

export default useScreenerTab;
