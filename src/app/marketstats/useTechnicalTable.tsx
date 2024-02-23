import { fetchTechnicalTable } from "@/utils/utility";

const useTechnicalTable = async ({
  activeViewId,
  filter,
  firstOperand,
  operationType,
  secondOperand,
  sort,
  pagesize,
  pageno,
}: any) => {
  const responseData = await fetchTechnicalTable({
    activeViewId,
    filter,
    firstOperand,
    operationType,
    secondOperand,
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

export default useTechnicalTable;
