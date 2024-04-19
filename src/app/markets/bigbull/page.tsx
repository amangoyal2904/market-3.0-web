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
    tabs: [
      { title: "Overview", id: "overview", url: "" },
      { title: "All Investors", id: "allInvestors", url: "" },
      { title: "Qtr. Changes", id: "qtrChanges", url: "" },
      { title: "Recent Transactions", id: "recentTransactions", url: "" },
      { title: "Best Picks", id: "bestPicks", url: "" },
      { title: "Most Held", id: "mostHeld", url: "" },
    ],
    pageData: {
      individualInvestors: IndividualInvestors?.datainfo?.investorlist || {},
      lastQuater: lastQuater?.datainfo?.investorKeyChanges || {},
      recentTransactions: recentTransactions?.datainfo?.recentDealsInfo || {},
      bestPicks: bestPicks?.datainfo?.bestPicksDataInfo || {},
      mostHeld: mostHeld?.datainfo?.mostHoldCompanyInfo || {},
    },
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <div className={styles.wraper}>
      <div className={styles.topSec}>
        <h1 className={`heading ${styles.head}`}>
          <span className={styles.etprimeLogo}>ETPrime</span>
          <span className={styles.bigLogo}>Big</span>
          <span className={styles.bullTxt}>Bull Portfolio</span>
        </h1>
        <p className={styles.desc}>
          Get to know where the market gurus invest to grow your portfolio.
        </p>
      </div>

      <div className={styles.container}>
        <BigBullClientPage data={bigBullData} selectedFilter={selectedFilter} />
      </div>
    </div>
  );
};

export default BigBullPage;
