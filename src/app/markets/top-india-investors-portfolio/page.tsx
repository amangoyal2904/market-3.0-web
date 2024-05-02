import styles from "./style.module.scss";
import { commonPostAPIHandler } from "../../../utils/screeners";
import BigBullClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";
import { headers } from "next/headers";
import BreadCrumb from "@/components/BreadCrumb";

const BigBullPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
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
  const payload = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 3,
    pageNo: 1,
  };
  const data = await commonPostAPIHandler(
    `BigBullAllInverstorOverview`,
    payload,
  );
  const bigBullData = {
    pageData: data.datainfo,
    // individualInvestors: IndividualInvestors?.datainfo?.investorlist || {},
    // lastQuater: lastQuater?.datainfo?.investorKeyChanges || {},
    // recentTransactions: recentTransactions?.datainfo?.recentDealsInfo || {},
    // bestPicks: bestPicks?.datainfo?.bestPicksDataInfo || {},
    // mostHeld: mostHeld?.datainfo?.mostHoldCompanyInfo || {},
  };
  return (
    <>
      {/* {JSON.stringify(pageUrl)} */}
      <BigBullClientPage data={bigBullData} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Overview", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullPage;
