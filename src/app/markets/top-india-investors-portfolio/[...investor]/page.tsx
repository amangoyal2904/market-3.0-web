import { commonPostAPIHandler } from "../../../../utils/screeners";
import { fetchSelectedFilter, fnGenerateMetaData } from "@/utils/utility";
import InvestorClientCatePage from "./investorCatClient";
import InvestorClientPage from "./investorClient";
import { headers } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const getExpertId = (arr: any) => {
    if (arr && arr.length > 0) {
      for (let item of arr) {
        const parts = item.split(",");
        for (let part of parts) {
          if (part.includes("expertid-")) {
            const idParts = part.split("-");
            return idParts[idParts.length - 1];
          }
        }
      }
    }
    return null;
  };
  const investorArray = params.investor;
  const invertorId = getExpertId(investorArray);
  let slug = "";
  let pageType = "";

  if (investorArray.length === 2 && invertorId !== null && invertorId !== "") {
    pageType = "inverstorCatepage";
    slug = investorArray[1] || "";
  } else if (
    investorArray.length === 1 &&
    invertorId !== null &&
    invertorId !== ""
  ) {
    pageType = "inverstorHomepage";
  }
  const bodyPayload = {
    sharkId: invertorId,
    ssoId: "",
    primeFlag: 1,
  };
  const invertorData = await commonPostAPIHandler(
    `BigBullInvestorOverview`,
    bodyPayload,
  );
  const sharkName =
    invertorData?.datainfo?.investorOverviewInfo?.investorIntro?.name;

  const InvestorsName = sharkName;
  const subCategoryName =
    slug === "fresh-entry-exit"
      ? "Fresh Entry & Exit"
      : slug === "holdings"
        ? "Holdings"
        : slug === "change-in-holdings"
          ? "Change in Holdings"
          : slug === "bulk-block-deals"
            ? "Bulk/Block Deals"
            : slug;
  let seo_title = ``;
  let seo_desc = ``;
  let seo_keywords = ``;
  if (pageType === "inverstorHomepage") {
    seo_title = `${InvestorsName} Portfolio - ${InvestorsName} Investments, Stocks & Shareholdings | The Economic Times`;
    seo_desc = `${InvestorsName} Portfolio - Check ${InvestorsName} Investments Portfolio, recently added stocks details, corporate shareholdings at The Economic Times
    Ex. - Ashish Dhawan Portfolio - Check Ashish Dhawan Investments Portfolio, recently added stocks details, corporate shareholdings at The Economic Times`;
    seo_keywords = `${InvestorsName} Portfolio, ${InvestorsName} Investments, Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks`;
  } else {
    seo_title = `${InvestorsName} ${subCategoryName} | The Economic Times`;
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

const InvestorPage = async ({ params }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const getExpertId = (arr: any) => {
    if (arr && arr.length > 0) {
      // Added null check for arr
      for (let item of arr) {
        const parts = item.split(","); // Splitting each item by comma
        for (let part of parts) {
          if (part.includes("expertid-")) {
            // Checking for 'expertid-' substring
            const idParts = part.split("-");
            return idParts[idParts.length - 1];
          }
        }
      }
    }
    return null;
  };
  const investorArray = params.investor;
  const invertorId = getExpertId(investorArray);

  let pageType = "";
  let slug = "";
  let _title = "";
  if (investorArray.length === 2 && invertorId !== null && invertorId !== "") {
    pageType = "inverstorCatepage";
    slug = investorArray[1] || "";
  } else if (
    investorArray.length === 1 &&
    invertorId !== null &&
    invertorId !== ""
  ) {
    pageType = "inverstorHomepage";
  } else {
    pageType = "notFoundpage";
  }

  const bodyPayload = {
    sharkId: invertorId,
    ssoId: "",
    primeFlag: 1,
  };
  const invertorData = await commonPostAPIHandler(
    `BigBullInvestorOverview`,
    bodyPayload,
  );
  if (pageType === "inverstorHomepage") {
    const bodyPayload = {
      ssoId: "",
      primeFlag: 1,
      sharkId: invertorId,
      filterType: "index",
      filterValue: [],
      sortBy: "holdingValue",
      orderBy: "DESC",
      pageNo: 1,
      pageSize: 10,
    };

    const payload = { ...bodyPayload };
    const invertorDataTopHolding = await commonPostAPIHandler(
      `BigBullHolding`,
      bodyPayload,
    );
    const pageData = invertorDataTopHolding ? invertorDataTopHolding : "";
    const arrayOfCompany =
      pageData?.datainfo?.holdingsCompanyInfo?.holdingsStockData || [];
    const pageSummaryInfo =
      pageData?.datainfo?.holdingsCompanyInfo?.pageSummaryInfo || {};
    const tableHead = [
      {
        name: "Company Name",
        id: "0",
        sort: false,
        primeFlag: false,
        orderBy: "",
      },
      {
        name: "Holdings Value (Cr.)",
        id: "1",
        sort: false,
        primeFlag: false,
        orderBy: "holdingValue",
      },
      {
        name: "Holdings % Latest Qtr.",
        id: "2",
        sort: false,
        primeFlag: false,
        orderBy: "holdingPercent",
      },
      {
        name: "Holdings % Prev. Qtr",
        id: "3",
        sort: false,
        primeFlag: false,
        orderBy: "prevHoldingPercent",
      },
      {
        name: "Chg (QoQ)",
        id: "4",
        sort: false,
        primeFlag: false,
        orderBy: "changeFromPrevQtr",
      },
      {
        name: "3M Returns %",
        id: "6",
        sort: false,
        primeFlag: false,
        orderBy: "return3Month",
      },
      {
        name: "M.Cap (Cr)",
        id: "5",
        sort: false,
        primeFlag: false,
        orderBy: "marketCap",
      },
    ];
    const topHoldingData = {
      payload,
      tableHead,
      arrayOfCompany,
      pageSummaryInfo,
    };
    const InvertorPorfolioOverviewPayload = {
      ssoId: "",
      primeFlag: 1,
      sharkId: 25,
      pageSize: 7,
    };
    const InvertorOverviewData = await commonPostAPIHandler(
      `BigBullInvestorPortfolioOverview`,
      InvertorPorfolioOverviewPayload,
    );

    return (
      <>
        <InvestorClientPage
          topHoldingData={topHoldingData}
          data={invertorData}
          otherViewData={InvertorOverviewData?.datainfo}
          pageUrl={pageUrl}
        />
      </>
    );
  } else if (pageType === "inverstorCatepage") {
    let pageData: any = "";
    let arrayOfCompany: any = [];
    let pageSummaryInfo: any = {};
    let tableHead: any = [];
    let payload: any = {};
    const selectedFilter = await fetchSelectedFilter(0);
    if (slug === "fresh-entry-exit") {
      const bodyPayload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: invertorId,
        qtrFilter: "3M",
        tradType: "SOLD",
        sortBy: "holdingValue",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 10,
      };
      payload = { ...bodyPayload };
      const invertorData = await commonPostAPIHandler(
        `BigBullFreshEntryExit`,
        bodyPayload,
      );
      pageData = invertorData ? invertorData : "";
      _title = pageData?.datainfo?.entryExitDataInfo?.entryExitData?.title;
      arrayOfCompany =
        pageData?.datainfo?.entryExitDataInfo?.entryExitData
          ?.stockEntryExitData || [];
      pageSummaryInfo =
        pageData?.datainfo?.entryExitDataInfo?.pageSummaryInfo || {};
    } else if (slug === "holdings") {
      const bodyPayload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: invertorId,
        filterType: "index",
        filterValue: [],
        sortBy: "holdingValue",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 10,
      };
      payload = { ...bodyPayload };
      const invertorData = await commonPostAPIHandler(
        `BigBullHolding`,
        bodyPayload,
      );
      pageData = invertorData ? invertorData : "";
      _title = `Top Holdings of ${pageData?.datainfo?.holdingsCompanyInfo?.investorIntro.name}`;
      arrayOfCompany =
        pageData?.datainfo?.holdingsCompanyInfo?.holdingsStockData || [];
      pageSummaryInfo =
        pageData?.datainfo?.holdingsCompanyInfo?.pageSummaryInfo || {};
      tableHead = [
        {
          name: "Company Name",
          id: "0",
          sort: false,
          primeFlag: false,
          orderBy: "",
        },
        {
          name: "Holdings Value (Cr.)",
          id: "1",
          sort: true,
          primeFlag: false,
          orderBy: "holdingValue",
        },
        {
          name: "Holdings % Latest Qtr.",
          id: "2",
          sort: true,
          primeFlag: false,
          orderBy: "holdingPercent",
        },
        {
          name: "Holdings % Prev. Qtr",
          id: "3",
          sort: true,
          primeFlag: false,
          orderBy: "prevHoldingPercent",
        },
        {
          name: "Chg (QoQ)",
          id: "4",
          sort: true,
          primeFlag: false,
          orderBy: "changeFromPrevQtr",
        },
        {
          name: "3M Returns %",
          id: "6",
          sort: true,
          primeFlag: false,
          orderBy: "return3Month",
        },
        {
          name: "M.Cap (Cr)",
          id: "5",
          sort: true,
          primeFlag: false,
          orderBy: "marketCap",
        },
      ];
    } else if (slug === "change-in-holdings") {
      const bodyPayload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: invertorId,
        qtrFilter: "3M",
        tradType: "All",
        pageNo: 1,
        pageSize: 10,
      };
      payload = { ...bodyPayload };
      const invertorData = await commonPostAPIHandler(
        `BigBullHoldingChanges`,
        bodyPayload,
      );
      pageData = invertorData ? invertorData : "";
      _title = pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.title;
      arrayOfCompany =
        pageData?.datainfo?.stockIncreaseDecreaseDataInfo
          ?.stockIncreaseDecreaseListData || [];
      pageSummaryInfo =
        pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.pageSummaryInfo ||
        {};
    } else if (slug === "bulk-block-deals") {
      const bodyPayload = {
        ssoId: "",
        primeFlag: 1,
        sharkId: invertorId,
        filterType: "index",
        filterValue: [],
        sortBy: "dealDate",
        orderBy: "DESC",
        pageNo: 1,
        pageSize: 10,
      };
      payload = { ...bodyPayload };
      const invertorData = await commonPostAPIHandler(
        `BigBullBulkBlockDeal`,
        bodyPayload,
      );
      pageData = invertorData ? invertorData : "";
      _title = `${pageData?.datainfo?.bulkblockDealsInfo?.pageSummaryInfo.totalRecords} Deals`;
      arrayOfCompany =
        pageData?.datainfo?.bulkblockDealsInfo?.stockHoldingList || [];
      pageSummaryInfo =
        pageData?.datainfo?.bulkblockDealsInfo?.pageSummaryInfo || {};
      tableHead = [
        {
          name: "Date",
          id: "0",
          sort: true,
          primeFlag: false,
          orderBy: "dealDate",
        },
        {
          name: "Buy / Sell",
          id: "1",
          sort: true,
          primeFlag: false,
          orderBy: "dealSignal",
        },
        {
          name: "Company Name",
          id: "2",
          sort: true,
          primeFlag: false,
          orderBy: "companyName",
        },
        {
          name: "Trans. Value (Cr.)",
          id: "3",
          sort: true,
          primeFlag: false,
          orderBy: "dealValue",
        },
        {
          name: "Stake Bought/ Sold",
          id: "4",
          sort: true,
          primeFlag: false,
          orderBy: "stakeChange",
        },
        {
          name: "Chg. Since Bought",
          id: "6",
          sort: true,
          primeFlag: false,
          orderBy: "changeSinceDeal",
        },
        {
          name: "Deal Qty.",
          id: "5",
          sort: true,
          primeFlag: false,
          orderBy: "dealQuantity",
        },
        {
          name: "Deal Price (Cr.)",
          id: "6",
          sort: true,
          primeFlag: false,
          orderBy: "dealPrice",
        },
      ];
    }
    return (
      <>
        <InvestorClientCatePage
          pageData={pageData}
          title={_title}
          slug={slug}
          data={invertorData}
          arrayOfCompany={arrayOfCompany}
          pageSummaryInfo={pageSummaryInfo}
          tableHead={tableHead}
          selectedFilter={selectedFilter}
          payload={payload}
          pageUrl={pageUrl}
        />
      </>
    );
  } else {
    return (
      <>
        Page not found <br />
        {JSON.stringify(invertorId)}- {JSON.stringify(pageType)}-
        {JSON.stringify(investorArray)}
      </>
    );
  }
};

export default InvestorPage;
