import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";

const fetchTitleAndDesc = async (
  navData: any,
  L3NavSubItem: any,
  L3NavMenuItem: any,
) => {
  const results: { title: string; desc: string }[] = [];

  if (!!L3NavSubItem) {
    navData.forEach((navItem: any) => {
      navItem.sub_nav.forEach((subNavItem: any) => {
        if (subNavItem?.type?.toLowerCase() === L3NavSubItem) {
          const { title, desc } = subNavItem;
          results.push({ title, desc });
        }
      });
    });
  } else {
    navData.forEach((navItem: any) => {
      if (navItem?.type?.toLowerCase() === L3NavMenuItem) {
        const { title, desc } = navItem;
        results.push({ title, desc });
      }
    });
  }

  return results;
};

const fetchL3Nav = async ({ duration, intFilter }: any) => {
  intFilter = !!intFilter ? intFilter : 0;
  duration = !!duration ? duration.toUpperCase() : "";
  const apiUrl = `${(APIS_CONFIG as any)?.["MARKET_STATS_NAV"][APP_ENV]}?filter=${intFilter}&duration=${duration}`;
  const response = await service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const fetchTechnicalCategory = async (L3NavMenuItem: any) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["MARKET_STATS_TECHNICAL_OPERANDS"][APP_ENV]}?category=${L3NavMenuItem}`;
  const response = await service.get({
    url: apiUrl,
    params: {},
  });
  return await response?.json();
};

export const getMarketStatsNav = async ({
  L3NavMenuItem,
  L3NavSubItem,
  intFilter,
  duration = null,
}: any) => {
  const l3Nav = await fetchL3Nav({ duration, intFilter });
  const metaData = await fetchTitleAndDesc(
    l3Nav.nav,
    L3NavSubItem,
    L3NavMenuItem,
  );
  return {
    l3Nav,
    metaData,
  };
};

export const getTechincalOperands = async (
  L3NavMenuItem: any,
  firstOperand: any,
  operationType: any,
  secondOperand: any,
) => {
  let category = L3NavMenuItem;
  if (category == "moving-averages") {
    if (
      firstOperand?.toLowerCase().includes("ema") ||
      secondOperand?.toLowerCase().includes("ema")
    ) {
      category = "ema-ema-crossovers";
    } else {
      category = "sma-sma-crossovers";
    }
  }
  const response = await fetchTechnicalCategory(category);

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
  const response = await service.get({
    url: (APIS_CONFIG as any)["MARKET_STATS_SHORTURLS_MAPPING"][APP_ENV],
    params: {},
  });
  return await response?.json();
};

export const getShortUrlMapping = async (pathname: any) => {
  try {
    const urlList = await getAllShortUrls();
    let pageData = urlList.find((item: any) => pathname === item.shortUrl);

    if (!pageData) {
      const pathWithoutParam = pathname.split("?")[0];
      pageData = urlList.find(
        (item: any) => pathWithoutParam === item.shortUrl,
      );
    }
    if (pageData) {
      return { shortUrl: true, pageData };
    } else {
      return { shortUrl: false };
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
    return { shortUrl: false };
  }
};
