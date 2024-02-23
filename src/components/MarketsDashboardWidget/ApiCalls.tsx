import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "@/utils/index";
import service from "@/network/service";

export const fetchTableData = async (
  type: any,
  duration: any,
  filter: any,
  activeViewId: any,
) => {
  const apiUrl = (APIS_CONFIG as any)?.marketStatsIntraday[APP_ENV];
  const bodyParams = {
    viewId: activeViewId,
    apiType: type,
    duration: duration,
    filterType: "index",
    filterValue: [filter],
    sort: [{ field: "R1MonthReturn", order: "DESC" }],
    pagesize: 10,
    pageno: 1,
  };
  //console.log(bodyParams)
  const data = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyParams),
    next: { revalidate: 3600 },
  });
  const res = await data.json();
  //console.log("tabledata", res);
  return res.dataList ? res.dataList : res;
};
export const fetchTabsData = async () => {
  const leftNavApi = (APIS_CONFIG as any)["MARKET_STATS_NAV"][APP_ENV];
  const leftNavPromise = await service.get({
    url: leftNavApi + "?type=intraday",
    params: {},
  });

  const data = await leftNavPromise?.json();
  return data;
};
