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
const fetchL3Nav = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=40`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await Service.get({
    url: API_URL,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const useScreenerNav = async ({ scrid }: any) => {
  const l3Nav = await fetchL3Nav();
  //const metaData = await fetchTitleAndDesc(l3Nav.nav);
  const metaData = [{}];
  return {
    l3Nav,
    metaData,
  };
};

export default useScreenerNav;
