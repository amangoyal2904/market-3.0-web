import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullRecentTransactionsPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullRecentTransactionsPage = async () => {
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "companyName",
    orderBy: "ASC",
    timeSpan: "",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(
    `BigBullGetRecentTransactions`,
    payload,
  );
  const __tableData: any[] =
    allData?.datainfo?.recentDealsInfo?.listRecentDeals || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: false,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "Buy / Sell",
      id: "01",
      sort: false,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Trans. Value(Cr.)",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Stake Bought/ Sold",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Chg. Since Bought",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Deal Qty.",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Deal Price (Rs)",
      id: "6",
      sort: true,
      primeFlag: false,
      orderBy: "",
    },
  ];
  const __pagination =
    allData?.datainfo?.recentDealsInfo?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullRecentTransactionsPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
      tableData={bigBullData.tableData}
      tableHead={bigBullData.tableHead}
      pagination={bigBullData.pagination}
    />
  );
};

export default BigBullRecentTransactionsPage;
