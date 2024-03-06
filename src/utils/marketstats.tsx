import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTitleAndDesc = async (navData: any, L3NavSubItem: any) => {
  const results: { title: string; desc: string }[] = [];
  navData.forEach((navItem: any) => {
    navItem.sub_nav.forEach((subNavItem: any) => {
      if (subNavItem.type.toLowerCase() === L3NavSubItem) {
        const { title, desc } = subNavItem;
        results.push({ title, desc });
      }
    });
  });
  return results;
};

const fetchL3Nav = async ({ duration, intFilter }: any) => {
  intFilter = !!intFilter ? intFilter : 0;
  duration = !!duration ? duration.toUpperCase() : "";
  const apiUrl = `${(APIS_CONFIG as any)?.["MARKET_STATS_NAV"][APP_ENV]}?filter=${intFilter}&duration=${duration}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const fetchTechnicalCategory = async (
  L3NavMenuItem: any,
  L3NavSubItem: any,
) => {
  if (L3NavMenuItem == "moving-averages") {
    L3NavMenuItem =
      L3NavSubItem == "ema-ema-crossovers" ||
      L3NavSubItem == "price-ema-crossovers"
        ? "ema-ema-crossovers"
        : "sma-sma-crossovers";
  }
  const apiUrl =
    "https://qcbselivefeeds.indiatimes.com/et-screener/operands-data?category=" +
    L3NavMenuItem;
  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return await response?.json();
};

export const getMarketStatsNav = async ({
  L3NavSubItem,
  intFilter,
  duration = null,
}: any) => {
  const l3Nav = await fetchL3Nav({ duration, intFilter });
  const metaData = await fetchTitleAndDesc(l3Nav.nav, L3NavSubItem);
  return {
    l3Nav,
    metaData,
  };
};

export const getTechincalOperands = async (
  L3NavMenuItem: any,
  L3NavSubItem: any,
  firstOperand: any,
  operationType: any,
  secondOperand: any,
) => {
  const response = await fetchTechnicalCategory(L3NavMenuItem, L3NavSubItem);

  return {
    ...response,
    selectedFilter: {
      firstOperand: firstOperand,
      operationType: operationType,
      secondOperand: secondOperand,
    },
    selectedFilterLabel: {
      firstOperand: response?.firstOperands.find(
        (operand: any) => operand.fieldName === firstOperand,
      )?.displayName,
      operationType: response?.operationType.find(
        (operand: any) => operand.fieldName === operationType,
      )?.displayName,
      secondOperand: !isNaN(secondOperand)
        ? secondOperand
        : response?.secondOperands.find(
            (operand: any) => operand.fieldName === secondOperand,
          )?.displayName,
    },
    category: L3NavMenuItem,
  };
};

export const getAllShortUrls = async () => {
  const response = await Service.get({
    url: (APIS_CONFIG as any)["MARKET_STATS_SHORTURLS_MAPPING"][APP_ENV],
    params: {},
  });
  return await response?.json();
};

export const getShortUrlMapping = async (pathname: any) => {
  const urlList = await getAllShortUrls();
  const isExist = urlList.some((item: any) => item.shortUrl == pathname);
  if (isExist) {
    const pageData = urlList.find((item: any) => item.shortUrl == pathname);
    return { shortUrl: true, pageData };
  }
  return { shortUrl: false };
};
