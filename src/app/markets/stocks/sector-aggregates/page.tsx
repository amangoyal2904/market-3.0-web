import SectorAggregatesClintPage from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { headers } from "next/headers";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { fetchSelectedFilter, saveLogs } from "@/utils/utility";
import DfpAds from "@/components/Ad/DfpAds";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../utils/screeners";
import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata } from "next";
import APIS_CONFIG from "@/network/api_config.json";
import service from "@/network/service";
import { APP_ENV } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: "Sector Aggregates",
    desc: "Sector Aggregates",
    keywords: "Sector Aggregates",
    pathname: `/markets/stocks/sector-aggregates`,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const SectorAggregatesPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const selectedFilter = await fetchSelectedFilter(0);
  const bodyPayloadSector = {
    apiType: "top-performing",
    pageSize: 10,
    pageNo: 1,
    sort: [{ field: "sectorPATQoqAvg", order: "DESC" }],
  };
  const bodyPayloadSectorUnder = {
    apiType: "under-performing",
    pageSize: 10,
    pageNo: 1,
    sort: [{ field: "sectorPATQoqAvg", order: "DESC" }],
  };
  const _topSector = await commonPostAPIHandler(
    `SECTOR_AGGREGATE`,
    bodyPayloadSector,
  );
  const _underSector = await commonPostAPIHandler(
    `SECTOR_AGGREGATE`,
    bodyPayloadSectorUnder,
  );
  const upcoingData = {
    data: "coming soon...",
    sectorData: {
      topSector: _topSector || {},
      underSector: _underSector || {},
    },
    payload: {
      topSector: bodyPayloadSector,
      underSector: bodyPayloadSectorUnder,
    },
  };
  return (
    <>
      <SectorAggregatesClintPage
        data={upcoingData}
        selectedFilter={selectedFilter}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Earnings", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};
export default SectorAggregatesPage;
