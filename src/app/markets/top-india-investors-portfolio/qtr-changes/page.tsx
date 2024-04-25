import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullQtrChangesPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullQtrChangesPage = async () => {
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "companyName",
    orderBy: "ASC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetLastQuarter`, payload);
  const __tableData: any[] =
    allData?.datainfo?.investorKeyChanges?.investorKeyChangesData || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: true,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "Company Name",
      id: "1",
      sort: true,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Curr. Holdings%",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "currHoldingPercent",
    },
    {
      name: "Prev. Holdings%",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "prevHoldingPercent",
    },
    {
      name: "Increase/Decrease",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "holdingPercentChange",
    },
    {
      name: "Amt. Invested /Sold (Rs in Cr.)",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "holdingValueChange",
    },
  ];
  const __pagination =
    allData?.datainfo?.investorKeyChanges?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullQtrChangesPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
      tableData={bigBullData.tableData}
      tableHead={bigBullData.tableHead}
      pagination={bigBullData.pagination}
    />
  );
};

export default BigBullQtrChangesPage;
