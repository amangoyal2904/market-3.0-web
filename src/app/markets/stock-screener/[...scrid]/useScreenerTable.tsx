import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils/index";

const fetchTableData = async (scrid: any, viewId: any) => {
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getScreenerByScreenerId[APP_ENV]}`;
  const bodyparams = {
    pageno: 1,
    pagesize: 25,
    screenerId: scrid,
    deviceId: "web",
    viewId: parseInt(viewId),
  };

  const data = await service.post({
    url: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyparams),
    params: {},
  });

  return data.json();
};

const useScreenerTable = async ({
  scrid,
  sort,
  pagesize,
  pageno,
  activeViewId,
}: any) => {
  const responseData = await fetchTableData(scrid, activeViewId);
  const tableData = responseData?.dataList
    ? responseData.dataList
    : responseData;

  const tableHeaderData =
    tableData && tableData.length && tableData[0] && tableData[0]?.data
      ? tableData[0]?.data
      : [];
  const screenerDetail = responseData?.screenerDetail
    ? responseData.screenerDetail
    : {};
  const pageSummary = responseData?.pageSummary ? responseData.pageSummary : {};
  const allowSortFields = responseData?.allowSortFields
    ? responseData.allowSortFields
    : {};
  const payload = {};
  return {
    tableHeaderData,
    tableData,
    screenerDetail,
    pageSummary,
    allowSortFields,
    payload,
  };
};

export default useScreenerTable;
