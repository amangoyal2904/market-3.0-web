import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";

const fetchTableData = async ({
  activeViewId,
  type,
  duration,
  filter,
  sort,
  pagesize,
  pageno,
}: any) => {
  const apiUrl = (APIS_CONFIG as any)?.["marketStatsIntraday"][APP_ENV];
  const bodyParams: any = {
    viewId: activeViewId,
    apiType: type,
    duration: duration,
    filterValue: filter,
    sort: sort,
    pagesize: pagesize,
    pageno: pageno,
  };

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

const useIntradayTable = async ({
  activeViewId,
  type,
  duration,
  filter,
  sort,
  pagesize,
  pageno,
}: any) => {
  const responseData = await fetchTableData({
    activeViewId,
    type,
    duration,
    filter,
    sort,
    pagesize,
    pageno,
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

export default useIntradayTable;
