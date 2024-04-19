import styles from "./style.module.scss";
import { commonPostAPIHandler } from "../../../utils/screeners";
import BigBullClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullPage = async () => {
  const individualInvestorsBodyParams = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 3,
    pageNo: 1,
  };
  const lastQuaterBodyParams = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "companyName",
    orderBy: "ASC",
    pageNo: 1,
    pageSize: 3,
  };
  const recentTransactionsBodyParams = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    filterType: "index",
    filterValue: [],
    pageNo: 1,
    pageSize: 3,
  };
  const bestPicksBodyParams = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    filterType: "index",
    filterValue: [],
    sortBy: "3MReturns",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 3,
  };
  const mostHeldBodyParams = {
    ssoId: "",
    primeFlag: 1,
    filterType: "index",
    filterValue: [],
    sortBy: "noOfBulls",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 3,
  };
  const IndividualInvestors = await commonPostAPIHandler(
    `BigBullGetInvestorList`,
    individualInvestorsBodyParams,
  );
  const lastQuater = await commonPostAPIHandler(
    `BigBullGetLastQuarter`,
    lastQuaterBodyParams,
  );
  const recentTransactions = await commonPostAPIHandler(
    `BigBullGetRecentTransactions`,
    recentTransactionsBodyParams,
  );

  const bestPicks = await commonPostAPIHandler(
    `BigBullGetBestPicks`,
    bestPicksBodyParams,
  );
  const mostHeld = await commonPostAPIHandler(
    `BigBullGetMostHeld`,
    mostHeldBodyParams,
  );

  const bigBullData = {
    pageData: {
      individualInvestors: IndividualInvestors?.datainfo?.investorlist || {},
      lastQuater: lastQuater?.datainfo?.investorKeyChanges || {},
      recentTransactions: recentTransactions?.datainfo?.recentDealsInfo || {},
      bestPicks: bestPicks?.datainfo?.bestPicksDataInfo || {},
      mostHeld: mostHeld?.datainfo?.mostHoldCompanyInfo || {},
    },
  };
  return <BigBullClientPage data={bigBullData} />;
};

export default BigBullPage;
