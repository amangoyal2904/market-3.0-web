import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTabsData = async ({ type, ssoid }: any) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}?statstype=${type.toLowerCase()}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ssoid: ssoid,
    },
  });
  return response?.json();
};

const concatenateAndLowerCase = (
  param1: string,
  param2: string,
  param3: any,
): string => {
  let concatenatedString: string = `${param1}-${param2}-${param3}`;
  concatenatedString = concatenatedString.toLowerCase();
  if (!isNaN(param3)) {
    concatenatedString = concatenatedString.replace(
      param3.toString(),
      "number",
    );
  }
  return concatenatedString;
};

const useTechnicalTab = async ({
  firstOperand,
  operationType,
  secondOperand,
  ssoid,
}: any) => {
  const type = concatenateAndLowerCase(
    firstOperand,
    operationType,
    secondOperand,
  );
  const tabData = await fetchTabsData({ type, ssoid });
  const activeViewId = tabData[0].viewId;
  return {
    tabData,
    activeViewId,
  };
};

export default useTechnicalTab;
