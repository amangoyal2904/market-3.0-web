import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async ({ type, isprimeuser, ssoid }: any) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}?statstype=${type.toLowerCase()}`;
  const headers: any = {};
  if (!!ssoid) {
    headers["ssoid"] = ssoid;
    headers["isprimeuser"] = isprimeuser;
  }
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};
const useTechnicalTab = async ({ type, isprimeuser, ssoid }: any) => {
  const tabData = await fetchTabsData({ type, isprimeuser, ssoid });
  const activeViewId = tabData[0].viewId;
  return {
    tabData,
    activeViewId,
  };
};

export default useTechnicalTab;
