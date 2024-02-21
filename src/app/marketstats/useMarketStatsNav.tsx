import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTitleAndDesc = async (navData: any, subNavType: any) => {
  const results: { title: string; desc: string }[] = [];
  navData.forEach((navItem: any) => {
    navItem.sub_nav.forEach((subNavItem: any) => {
      if (subNavItem.type.toLowerCase() === subNavType.toLowerCase()) {
        const { title, desc } = subNavItem;
        results.push({ title, desc });
      }
    });
  });
  return results;
};
const fetchL3Nav = async ({ duration, filter }: any) => {
  filter = !!filter ? filter : 0;
  duration = !!duration ? duration.toUpperCase() : "";
  const apiUrl = `${(APIS_CONFIG as any)?.["MARKET_STATS_NAV"][APP_ENV]}?duration=${duration}&filter=${filter}`;

  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const useMarketStatsNav = async ({ type, filter, duration }: any) => {
  const l3Nav = await fetchL3Nav({ duration, filter });
  const metaData = await fetchTitleAndDesc(l3Nav.nav, type);
  return {
    l3Nav,
    metaData,
  };
};

export default useMarketStatsNav;
