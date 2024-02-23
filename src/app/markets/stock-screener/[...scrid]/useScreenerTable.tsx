import APIS_CONFIG from "../../../../network/api_config.json";
import { APP_ENV } from "../../../../utils/index";

const fetchTableData = async (scrid: any) => {
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getScreenerByScreenerId[APP_ENV]}`;
  const bodyparams = {
    pageno: 1,
    pagesize: 25,
    screenerId: scrid,
    deviceId: "web",
  };
  const data = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyparams),
  });
  return data.json();
};

const useScreenerTable = async ({ scrid, sort, pagesize, pageno }: any) => {
  const responseData = await fetchTableData(scrid);
  const ivKey = responseData?.iv || [];
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
  return {
    tableHeaderData,
    tableData,
    ivKey,
    screenerDetail,
    pageSummary,
    allowSortFields,
  };
};

export default useScreenerTable;
