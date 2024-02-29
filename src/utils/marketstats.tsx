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

const fetchTechnicalCategory = async (params: any, type: any) => {
  let category = params.technicals[0];
  if (category == "moving-averages") {
    category =
      type == "ema-ema-crossovers" || type == "price-ema-crossovers"
        ? "ema-ema-crossovers"
        : "sma-sma-crossovers";
  }
  const apiUrl =
    "https://qcbselivefeeds.indiatimes.com/et-screener/operands-data?category=" +
    category;
  const response = await Service.get({
    url: apiUrl,
    params: {},
  });
  return response?.json();
};

export const getMarketStatsNav = async ({
  type,
  intFilter,
  duration = null,
}: any) => {
  const l3Nav = await fetchL3Nav({ duration, intFilter });
  const metaData = await fetchTitleAndDesc(l3Nav.nav, type);
  return {
    l3Nav,
    metaData,
  };
};

export const getTechincalOperands = async (
  params: any,
  type: any,
  firstOperand: any,
  operationType: any,
  secondOperand: any,
) => {
  const response = await fetchTechnicalCategory(params, type);

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
    category: params,
  };
};
