import { fetchViewTable } from "@/utils/utility";

const useTechnicalTable = async ({
  activeViewId,
  filter,
  firstOperand,
  operationType,
  secondOperand,
  sort,
  pagesize,
  pageno,
  isprimeuser,
  ssoid,
}: any) => {
  const responseData = await fetchViewTable(
    {
      viewId: activeViewId,
      filterValue: filter,
      filterType: !!filter && filter.length ? "index" : null,
      firstOperand,
      operationType,
      secondOperand,
      sort,
      pagesize,
      pageno,
    },
    "movingAverages",
    isprimeuser,
    ssoid,
  );
  const payload: any = {
    viewId: activeViewId,
    firstOperand: firstOperand,
    operationType: operationType,
    secondOperand: secondOperand,
    filterValue: filter,
    filterType: null,
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

export default useTechnicalTable;
