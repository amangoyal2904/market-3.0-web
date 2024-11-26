import SectorPageClient from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers, cookies } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { saveLogs } from "@/utils/utility";
import DfpAds from "@/components/Ad/DfpAds";
import {
  getScreenerTabViewData,
  getCustomViewTable,
} from "@/utils/customViewAndTables";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../../../utils/screeners";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";
import { getOtherSectors } from "@/utils/utility";

const SectorPage = async (props: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const allSlug = props?.params?.sectorId;
  const id = allSlug.find((item: any) => item.startsWith("id-"));
  const numericValue = id.split("-")[1];
  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const isprimeuser = cookieStore.get("isprimeuser")?.value === "true";
  const bodyPayloadSector = {
    sectorId: numericValue,
  };

  const bodyPayloadConstituent = {
    viewId: 6916,
    apiType: "index-constituents",
    filterType: null,
    sectorId: numericValue,
    sort: [],
    pagesize: 10,
    pageno: 1,
  };
  const fetchTopNews = async () => {
    try {
      const response = await service.get({
        url: `${(APIS_CONFIG as any)?.APIDOMAIN[APP_ENV]}?type=plist&msid=5766568&mode=hierarchy`,
        params: {},
      });
      const data = response ? await response?.json() : {};
      const topNewsData =
        (data &&
          data.searchResult &&
          data.searchResult[0] &&
          data.searchResult[0].data) ||
        [];
      const topNewsFilteredData = topNewsData?.filter(
        (data: { type: string }) => data.type === "articleshow",
      );
      return topNewsFilteredData;
    } catch (e) {
      console.log("error in fetching top news", e);
      saveLogs({
        type: "Mercury",
        res: "error",
        msg: "Error in fetching top news data stocks earnings",
      });
      return [];
    }
  };
  const _sectorSummary = await commonPostAPIHandler(
    `SECTOR_AGGREGATE`,
    bodyPayloadSector,
  );

  const _sectorConstituent = await commonPostAPIHandler(
    `MARKETSTATS_INTRADAY`,
    bodyPayloadConstituent,
  );
  // SECTORS_OTHER
  const topNewsData = await fetchTopNews();
  const otherSectorData = await getOtherSectors(numericValue);
  // Sector FAQ SECTOR_FAQ
  const _faq = await commonGetAPIHandler(
    `SECTOR_FAQ`,
    `?sectorid=${numericValue}`,
  );
  const { tabData, activeViewId } = await getScreenerTabViewData({
    type: "screenerGetViewById",
    ssoid,
  });
  const pagesize = 1;
  const pageno = 1;
  const sort: any = [];
  const deviceId = "web";
  const filterType = "index";
  const bodyParams = {
    viewId: 6916,
    apiType: "index-constituents",
    filterType: null,
    sectorId: numericValue,
    sort: [],
    pagesize: 10,
    pageno: 1,
  };
  const {
    tableHeaderData,
    tableData,
    pageSummary,
    unixDateTime,
    payload,
    screenerDetail,
  } = await getCustomViewTable({
    bodyParams,
    isprimeuser,
    ssoid,
    apiType: "MARKETSTATS_INTRADAY",
  });
  const upcoingData = {
    data: "coming soon...",
    sectorSummary: _sectorSummary,
    sectorConstituent: _sectorConstituent,
    topNewsData: topNewsData,
    otherSectorData: otherSectorData,
    faq: _faq,
    payload: {
      sectorSummary: bodyPayloadSector,
      allSlug: allSlug,
      sectorConstituent: bodyPayloadConstituent,
    },
  };
  const sectorTitle =
    upcoingData?.sectorSummary?.sectorAggregateData[0]?.sectorName || "";
  return (
    <>
      <SectorPageClient
        data={upcoingData}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        pageSummary={pageSummary}
        payload={payload}
        unixDateTime={unixDateTime}
        tableData={tableData}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[
          {
            label: "Sector Aggregate  ",
            redirectUrl:
              "/markets/stocks/earnings/sector-aggregate/top-performing",
          },
          { label: sectorTitle, redirectUrl: "" },
        ]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};
export default SectorPage;
