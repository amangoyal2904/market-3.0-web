import { fetchViewTable } from "@/utils/utility";

const useIntradayTable = async ({
  activeViewId,
  type,
  duration,
  filter,
  sort,
  pagesize,
  pageno,
  isprimeuser,
  ssoid,
}: any) => {
  const responseData = await fetchViewTable(
    {
      viewId: activeViewId,
      apiType: type,
      filterValue: filter,
      filterType: !!filter ? "index" : null,
      duration,
      sort,
      pagesize,
      pageno,
    },
    "marketStatsIntraday",
    isprimeuser,
    ssoid,
  );
  const payload: any = {
    viewId: activeViewId,
    apiType: type,
    duration: duration,
    filterValue: filter,
    sort: sort,
    pagesize: pagesize,
    pageno: pageno,
  };
  if (!!filter && filter.length) {
    payload.filterType = "index";
  }
  const pageSummary = responseData.pageSummary;
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
    pageSummary,
    payload,
  };
};

export default useIntradayTable;
