import { commonPostAPIHandler } from "../../../../utils/screeners";
import {
  fetchSelectedFilter,
  fnGenerateMetaData,
  getBigBullPageName,
} from "@/utils/utility";
// import InvestorClientCatePage from "./investorCatClient";
// import InvestorClientPage from "./investorClient";
import { headers } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import BigBullClientPage from "../clients";
import BigBullAllInvertorsClientPage from "../BigBullAllInvertorsClientPage";
import BigBullQtrChangesClientPage from "../BigBullQtrChangesClientPage";
import BigBullRecentTransactionsClientPage from "../BigBullRecentTransactionsClientPage";
import BigBullBestPicksClientPage from "../BigBullBestPicksClientPage";
import BigBullMostHeldClientPage from "../BigBullMostHeldClientPage";
import InvestorClientHomePage from "../InvestorClientHomePage";
import InvestorClientCategoryPage from "../InvestorClientCategoryPage";
import allInvestorTabsData from "../../../../DataJson/allInvestorTableHead.json";
import qtrChangeTabsData from "../../../../DataJson/qtrChangeTableHead.json";
import recentTransTabsData from "../../../../DataJson/recentTransTableHead.json";
import bestPicksTableHead from "../../../../DataJson/bestPicksTableHead.json";
import mostHeldTableHead from "../../../../DataJson/mostHeldTableHead.json";
import investorOverviewTopTableHead from "../../../../DataJson/investorOverviewTopTableHead.json";
import investorHoldingsTableHead from "../../../../DataJson/investorHoldingsTableHead.json";
import bulkBlockTableHead from "../../../../DataJson/bulkBlockTableHead.json";

export async function generateMetadata(
  { searchParams, params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const slugArray = params.slug;
  const pageType: any = getBigBullPageName(slugArray);

  let SubCategoryName = "";
  let seo_title = `Top Investors in India, List of Individual & Institutional Investors, Investors Portfolio`;
  let seo_desc = `Top Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
  let seo_keywords = `Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks`;

  if (pageType?.page === "homepage") {
    SubCategoryName = ``;
    seo_title = `Top Investors in India, List of Individual & Institutional Investors, Investors Portfolio`;
    seo_desc = `Top Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks`;
  } else if (pageType?.page === "allInvestors") {
    SubCategoryName = "All";
    seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio`;
    seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors`;
  } else if (pageType?.page === "qtrChanges") {
    SubCategoryName = "Qtr Changes";
    seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio`;
    seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors`;
  } else if (pageType?.page === "recentTransactions") {
    SubCategoryName = "Recent Transactions";
    seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio`;
    seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors`;
  } else if (pageType?.page === "bestPicks") {
    SubCategoryName = "Best Picks";
    seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio`;
    seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors`;
  } else if (pageType?.page === "mostHeld") {
    SubCategoryName = "Most  Held";
    seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio`;
    seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
    seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors`;
  } else if (pageType?.page === "investorhomepage") {
    const invertorData = await commonPostAPIHandler(`BigBullInvestorOverview`, {
      sharkId: pageType?.expertId,
      ssoId: "",
      primeFlag: 1,
    });

    const InvestorsName =
      invertorData?.datainfo?.investorOverviewInfo?.investorIntro?.name || "";

    seo_title = `${InvestorsName} Portfolio - ${InvestorsName} Investments, Stocks & Shareholdings`;
    seo_desc = `${InvestorsName} Portfolio - Check ${InvestorsName} Investments Portfolio, recently added stocks details, corporate shareholdings at The Economic Times`;
    seo_keywords = `${InvestorsName} Portfolio, ${InvestorsName} Investments, Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks`;
  } else if (pageType?.page === "expertPage") {
    const invertorData = await commonPostAPIHandler(`BigBullInvestorOverview`, {
      sharkId: pageType?.expertId,
      ssoId: "",
      primeFlag: 1,
    });
    const InvestorsName =
      invertorData?.datainfo?.investorOverviewInfo?.investorIntro?.name || "";
    const subCategoryName = pageType?.subCategoryNameSeo || "";
    seo_title = `${InvestorsName} ${subCategoryName}`;
    seo_desc = `${InvestorsName} ${subCategoryName} - Check updated information & latest news for ${InvestorsName} ${subCategoryName} at The Economic Times`;
    seo_keywords = `${InvestorsName} ${subCategoryName}, Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks`;
  }

  const meta = {
    title: seo_title,
    desc: seo_desc,
    keywords: seo_keywords,
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const BigBullPage = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const slugArray = params.slug;
  const pageType: any = getBigBullPageName(slugArray);
  //console.log('____pageUrl',pageUrl)
  let data: any = {};
  let payload: any = {};
  let tableThSortFilterID: any = null;

  if (pageType?.page === "homepage") {
    payload = {
      ssoId: "",
      investorType: pageType?.subCate || "INDIVIDUAL",
      sortBy: "networth",
      orderBy: "DESC",
      primeFlag: 1,
      pageSize: 3,
      pageNo: 1,
    };
    const getData = await commonPostAPIHandler(
      `BigBullAllInverstorOverview`,
      payload,
    );
    data = { pageData: getData.datainfo };
    return (
      <>
        <BigBullClientPage data={data} payload={payload} pageUrl={pageUrl} />
      </>
    );
  } else if (pageType?.page === "allInvestors") {
    payload = {
      ssoId: "",
      investorType: pageType?.subCate || "INDIVIDUAL",
      sortBy: "networth",
      orderBy: "DESC",
      primeFlag: 1,
      pageSize: 25,
      pageNo: 1,
    };
    const IndividualInvestors = await commonPostAPIHandler(
      `BigBullGetInvestorList`,
      payload,
    );
    const __tableData: any[] =
      IndividualInvestors?.datainfo?.investorlist?.investorData || [];
    const __tableHead: any[] = allInvestorTabsData;
    const foundItem = __tableHead.find(
      (item: any) => item.orderBy === payload.sortBy,
    );
    tableThSortFilterID = foundItem ? foundItem.id : null;

    const __pagination =
      IndividualInvestors?.datainfo?.investorlist?.pageSummaryInfo || {};
    const bigBullData = {
      pageData: IndividualInvestors?.datainfo?.investorlist || {},
      tableData: __tableData,
      tableHead: __tableHead,
      pagination: __pagination,
    };
    return (
      <>
        <BigBullAllInvertorsClientPage
          tableData={bigBullData.tableData}
          tableHead={bigBullData.tableHead}
          pagination={bigBullData.pagination}
          payload={payload}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  } else if (pageType?.page === "qtrChanges") {
    payload = {
      ssoId: "",
      primeFlag: 1,
      investorType: pageType?.subCate || "INDIVIDUAL",
      position: "All",
      filterType: "index",
      filterValue: [],
      sortBy: "qtrDate+absHoldingPercentChange",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 25,
    };
    const allData = await commonPostAPIHandler(
      `BigBullGetLastQuarter`,
      payload,
    );
    const __tableData: any[] =
      allData?.datainfo?.investorKeyChanges?.investorKeyChangesData || [];
    const __tableHead: any[] = qtrChangeTabsData;
    const foundItem = __tableHead.find(
      (item: any) => item.orderBy === payload.sortBy,
    );
    tableThSortFilterID = foundItem ? foundItem.id : null;

    const __pagination =
      allData?.datainfo?.investorKeyChanges?.pageSummaryInfo || {};
    const bigBullData = {
      tableData: __tableData,
      tableHead: __tableHead,
      pagination: __pagination,
    };
    const selectedFilter = await fetchSelectedFilter(0);
    return (
      <>
        <BigBullQtrChangesClientPage
          data={bigBullData}
          selectedFilter={selectedFilter}
          tableData={bigBullData.tableData}
          tableHead={bigBullData.tableHead}
          pagination={bigBullData.pagination}
          payload={payload}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  } else if (pageType?.page === "recentTransactions") {
    payload = {
      ssoId: "",
      primeFlag: 1,
      investorType: pageType?.subCate || "INDIVIDUAL",
      position: "All",
      filterType: "index",
      filterValue: [],
      sortBy: "dealDate",
      orderBy: "DESC",
      timeSpan: "1Y",
      pageNo: 1,
      pageSize: 25,
    };
    const allData = await commonPostAPIHandler(
      `BigBullGetRecentTransactions`,
      payload,
    );
    const __tableData: any[] =
      allData?.datainfo?.recentDealsInfo?.listRecentDeals || [];
    const __tableHead: any[] = recentTransTabsData;
    const foundItem = __tableHead.find(
      (item: any) => item.orderBy === payload.sortBy,
    );
    tableThSortFilterID = foundItem ? foundItem.id : null;
    const __pagination =
      allData?.datainfo?.recentDealsInfo?.pageSummaryInfo || {};
    const bigBullData = {
      tableData: __tableData,
      tableHead: __tableHead,
      pagination: __pagination,
    };
    const selectedFilter = await fetchSelectedFilter(0);
    return (
      <>
        <BigBullRecentTransactionsClientPage
          data={bigBullData}
          selectedFilter={selectedFilter}
          tableData={bigBullData.tableData}
          tableHead={bigBullData.tableHead}
          pagination={bigBullData.pagination}
          payload={payload}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  } else if (pageType?.page === "bestPicks") {
    payload = {
      ssoId: "",
      primeFlag: 1,
      investorType: pageType?.subCate || "INDIVIDUAL",
      position: "All",
      filterType: "index",
      filterValue: [],
      sortBy: "3MReturns",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 25,
    };
    const allData = await commonPostAPIHandler(`BigBullGetBestPicks`, payload);
    const __tableData: any[] =
      allData?.datainfo?.bestPicksDataInfo?.bestPicksListInfo || [];
    const __tableHead: any[] = bestPicksTableHead;
    const foundItem = __tableHead.find(
      (item: any) => item.orderBy === payload.sortBy,
    );
    tableThSortFilterID = foundItem ? foundItem.id : null;

    const __pagination =
      allData?.datainfo?.bestPicksDataInfo?.pageSummaryInfo || {};
    const bigBullData = {
      tableData: __tableData,
      tableHead: __tableHead,
      pagination: __pagination,
    };
    const selectedFilter = await fetchSelectedFilter(0);
    return (
      <>
        <BigBullBestPicksClientPage
          data={bigBullData}
          selectedFilter={selectedFilter}
          tableData={bigBullData.tableData}
          tableHead={bigBullData.tableHead}
          pagination={bigBullData.pagination}
          payload={payload}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  } else if (pageType?.page === "mostHeld") {
    payload = {
      ssoId: "",
      primeFlag: 1,
      investorType: pageType?.subCate || "INDIVIDUAL",
      position: "All",
      filterType: "index",
      filterValue: [],
      sortBy: "noOfBulls",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 25,
    };
    const allData = await commonPostAPIHandler(`BigBullGetMostHeld`, payload);
    const __tableData: any[] =
      allData?.datainfo?.mostHoldCompanyInfo?.mostHoldStockData || [];
    const __tableHead: any[] = mostHeldTableHead;
    const foundItem = __tableHead.find(
      (item: any) => item.orderBy === payload.sortBy,
    );
    tableThSortFilterID = foundItem ? foundItem.id : null;

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
          payload={payload}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  } else if (pageType?.page === "investorhomepage") {
    payload = {
      ssoId: "",
      primeFlag: 1,
      sharkId: pageType?.expertId,
      filterType: "index",
      filterValue: [],
      sortBy: "holdingValue",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 5,
    };
    const invertorDataTopHolding = await commonPostAPIHandler(
      `BigBullHolding`,
      payload,
    );
    const pageData = invertorDataTopHolding ? invertorDataTopHolding : "";
    const arrayOfCompany =
      pageData?.datainfo?.holdingsCompanyInfo?.holdingsStockData || [];
    const pageSummaryInfo =
      pageData?.datainfo?.holdingsCompanyInfo?.pageSummaryInfo || {};
    const tableHead = investorOverviewTopTableHead;
    const topHoldingData = {
      payload,
      tableHead,
      arrayOfCompany,
      pageSummaryInfo,
    };
    const InvertorPorfolioOverviewPayload = {
      ssoId: "",
      primeFlag: 1,
      sharkId: pageType?.expertId,
      pageSize: 7,
    };
    const InvertorOverviewData = await commonPostAPIHandler(
      `BigBullInvestorPortfolioOverview`,
      InvertorPorfolioOverviewPayload,
    );
    const invertorData = await commonPostAPIHandler(`BigBullInvestorOverview`, {
      sharkId: pageType?.expertId,
      ssoId: "",
      primeFlag: 1,
    });
    return (
      <>
        <InvestorClientHomePage
          topHoldingData={topHoldingData}
          data={invertorData}
          otherViewData={InvertorOverviewData?.datainfo}
          pageUrl={pageUrl}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
    // =========
  } else if (pageType?.page === "expertPage") {
    let pageData: any = "";
    let arrayOfCompany: any = [];
    let pageSummaryInfo: any = {};
    let tableHead: any = [];
    let payload: any = {};
    let rightTabTxt: any = "";
    let _title = "";
    const selectedFilter = await fetchSelectedFilter(0);
    const invertorData = await commonPostAPIHandler(`BigBullInvestorOverview`, {
      sharkId: pageType?.expertId,
      ssoId: "",
      primeFlag: 1,
    });
    if (pageType?.slug === "fresh-entry-exit") {
      payload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: pageType?.expertId,
        qtrFilter: "3M",
        tradType: "ALL",
        sortBy: "holdingValue",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 10,
      };
      const invertorData = await commonPostAPIHandler(
        `BigBullFreshEntryExit`,
        payload,
      );
      pageData = invertorData ? invertorData : "";
      _title = pageData?.datainfo?.entryExitDataInfo?.entryExitData?.title;
      arrayOfCompany =
        pageData?.datainfo?.entryExitDataInfo?.entryExitData
          ?.stockEntryExitData || [];
      pageSummaryInfo =
        pageData?.datainfo?.entryExitDataInfo?.pageSummaryInfo || {};
    } else if (pageType?.slug === "holdings") {
      payload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: pageType?.expertId,
        filterType: "index",
        filterValue: [],
        sortBy: "holdingValue",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 25,
      };
      const invertorData = await commonPostAPIHandler(
        `BigBullHolding`,
        payload,
      );
      pageData = invertorData ? invertorData : "";
      _title = `Top Holdings of ${pageData?.datainfo?.holdingsCompanyInfo?.investorIntro.name}`;
      arrayOfCompany =
        pageData?.datainfo?.holdingsCompanyInfo?.holdingsStockData || [];
      pageSummaryInfo =
        pageData?.datainfo?.holdingsCompanyInfo?.pageSummaryInfo || {};
      tableHead = investorHoldingsTableHead;
      const foundItem = tableHead.find(
        (item: any) => item.orderBy === payload.sortBy,
      );
      tableThSortFilterID = foundItem ? foundItem.id : null;
      rightTabTxt =
        pageData?.datainfo?.holdingsCompanyInfo?.investorIntro?.latestQuartor;
    } else if (pageType?.slug === "change-in-holdings") {
      payload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: pageType?.expertId,
        qtrFilter: "3M",
        tradType: "All",
        pageNo: 1,
        pageSize: 25,
      };
      const invertorData = await commonPostAPIHandler(
        `BigBullHoldingChanges`,
        payload,
      );
      pageData = invertorData ? invertorData : "";
      _title = pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.title;
      arrayOfCompany =
        pageData?.datainfo?.stockIncreaseDecreaseDataInfo
          ?.stockIncreaseDecreaseListData || [];
      pageSummaryInfo =
        pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.pageSummaryInfo ||
        {};
      rightTabTxt =
        pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.investorIntro
          ?.latestQuartor;
    } else if (pageType?.slug === "bulk-block-deals") {
      payload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: pageType?.expertId,
        filterType: "index",
        filterValue: [],
        sortBy: "dealDate",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 25,
      };
      const invertorData = await commonPostAPIHandler(
        `BigBullBulkBlockDeal`,
        payload,
      );
      pageData = invertorData ? invertorData : "";
      _title = `${pageData?.datainfo?.bulkblockDealsInfo?.pageSummaryInfo.totalRecords} Deals`;
      arrayOfCompany =
        pageData?.datainfo?.bulkblockDealsInfo?.stockHoldingList || [];
      pageSummaryInfo =
        pageData?.datainfo?.bulkblockDealsInfo?.pageSummaryInfo || {};
      tableHead = bulkBlockTableHead;
      const foundItem = tableHead.find(
        (item: any) => item.orderBy === payload.sortBy,
      );
      tableThSortFilterID = foundItem ? foundItem.id : null;
    }

    return (
      <>
        <InvestorClientCategoryPage
          pageData={pageData}
          title={_title}
          slug={pageType?.slug}
          data={invertorData}
          arrayOfCompany={arrayOfCompany}
          pageSummaryInfo={pageSummaryInfo}
          tableHead={tableHead}
          selectedFilter={selectedFilter}
          payload={payload}
          pageUrl={pageUrl}
          rightTabTxt={rightTabTxt}
          tableThSortFilterID={tableThSortFilterID}
        />
      </>
    );
  }
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <pre>{JSON.stringify(pageType, null, 2)}</pre>
    </>
  );
};

export default BigBullPage;
