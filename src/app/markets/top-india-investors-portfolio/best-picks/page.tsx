import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullBestPicksPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullBestPicksPage = async () => {
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "3MReturns",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetBestPicks`, payload);
  const __tableData: any[] =
    allData?.datainfo?.bestPicksDataInfo?.bestPicksListInfo || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: false,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Holdings%",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "holdingPercent",
    },
    {
      name: "Holdings (Rs in Cr.)",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "holdingValue",
    },
    {
      name: "3M Return %",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "3MReturns",
    },
    {
      name: "6M Returns %",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "6MReturns",
    },
  ];
  const __pagination =
    allData?.datainfo?.bestPicksDataInfo?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullBestPicksPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
      tableData={bigBullData.tableData}
      tableHead={bigBullData.tableHead}
      pagination={bigBullData.pagination}
    />
  );
};

export default BigBullBestPicksPage;
