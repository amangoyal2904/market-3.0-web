import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullMostHeldClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";
import { headers } from "next/headers";
import BreadCrumb from "@/components/BreadCrumb";

const BigBullMostHeldPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "noOfBulls",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetMostHeld`, payload);
  const __tableData: any[] =
    allData?.datainfo?.mostHoldCompanyInfo?.mostHoldStockData || [];
  const __tableHead: any[] = [
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Held By",
      id: "11",
      sort: false,
      primeFlag: false,
      orderBy: "noOfBulls",
    },
    {
      name: "Bull Holdings%",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "bullHolding",
    },
    {
      name: "Bull Holdings (Rs in Cr.)",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "bullHoldingValue",
    },
    {
      name: "3M Return %",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "3MReturn",
    },
    {
      name: "6M Returns %",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "6MReturn",
    },
  ];
  const __pagination =
    allData?.datainfo?.mostHoldCompanyInfo?.pageSummaryInfo || {};
  const __lastUpdatedQtr =
    allData?.datainfo?.mostHoldCompanyInfo?.lastUpdatedQtr || "";
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
    lastUpdatedQtr: __lastUpdatedQtr,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <>
      <BigBullMostHeldClientPage
        data={bigBullData}
        selectedFilter={selectedFilter}
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
        lastUpdatedQtr={bigBullData.lastUpdatedQtr}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Most Held", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullMostHeldPage;
