import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTableData = async ({
  activeViewId,
  pageType,
  searchParams,
}: any) => {
  let bodyParams: any = {},
    apiUrl;
  const type = searchParams?.type;
  const filter = searchParams.filter ? [parseInt(searchParams.filter)] : [];
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const duration = searchParams?.duration;
  if (pageType.includes("intraday")) {
    apiUrl = (APIS_CONFIG as any)?.["marketStatsIntraday"][APP_ENV];
    bodyParams = {
      apiType: type,
      filterValue: filter,
      viewId: activeViewId,
      duration: duration,
      pagesize: 100,
      pageno: 1,
    };
  } else {
    apiUrl = (APIS_CONFIG as any)?.["movingAverages"][APP_ENV];
    bodyParams = {
      filterValue: filter,
      viewId: activeViewId,
      firstOperand: firstOperand,
      operationType: operationType,
      secondOperand: secondOperand,
      pagesize: 100,
      pageno: 1,
    };
  }

  if (!!filter && filter.length) {
    bodyParams.filterType = "index";
  }

  const response = await Service.post({
    url: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(bodyParams),
    params: {},
  });
  return response?.json();
};
const useTechnicalTable = async ({
  activeViewId,
  pageType,
  searchParams,
}: any) => {
  const responseData = await fetchTableData({
    activeViewId,
    pageType,
    searchParams,
  });
  const ivKey = responseData.iv;
  const tableData = responseData?.dataList
    ? responseData.dataList
    : responseData;

  const tableHeaderData =
    tableData && tableData.length && tableData[0] && tableData[0]?.data
      ? tableData[0]?.data
      : [];
  return {
    tableHeaderData,
    tableData,
    ivKey,
  };
};

export default useTechnicalTable;
