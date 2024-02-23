import { fetchIntradayTable } from "@/utils/utility";

const useIntradayTable = async ({
  activeViewId,
  type,
  duration,
  filter,
  sort,
  pagesize,
  pageno,
}: any) => {
  const responseData = await fetchIntradayTable({
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
