import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullAllInvertorsPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullAllInvertorsPage = async () => {
  const individualInvestorsBodyParams = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 10,
    pageNo: 1,
  };
  const IndividualInvestors = await commonPostAPIHandler(
    `BigBullGetInvestorList`,
    individualInvestorsBodyParams,
  );
  const __tableData: any[] =
    IndividualInvestors?.datainfo?.investorlist?.investorData || [];
  const __tableHead: any[] = [
    { name: "Investors Name", id: "0", sort: true },
    { name: "No. Of Companies", id: "1", sort: true },
    { name: "Networth (Cr)", id: "2", sort: true },
    { name: "Networth (QoQ)", id: "3", sort: true },
    { name: "Best Picks", id: "4", sort: true },
    { name: "Top Activity", id: "5", sort: true },
  ];
  const __pagination =
    IndividualInvestors?.datainfo?.investorlist?.pageSummaryInfo || {};
  const bigBullData = {
    pageData: IndividualInvestors?.datainfo?.investorlist || {},
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  return (
    <BigBullAllInvertorsPageClientPage
      tableData={bigBullData.tableData}
      tableHead={bigBullData.tableHead}
      pagination={bigBullData.pagination}
    />
  );
};

export default BigBullAllInvertorsPage;
