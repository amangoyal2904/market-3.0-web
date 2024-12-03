import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";

const fetchTabsData = async () => {
  //const ssoid = window.objUser?.ssoid;
  const apiUrl = `${(APIS_CONFIG as any)?.["SCREENER"]?.["screenerListTab"][APP_ENV]}`;
  const response = await service.get({
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
