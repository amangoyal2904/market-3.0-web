import { cookies, headers } from "next/headers";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import {
  getCustomViewTable,
  getScreenerTabViewData,
} from "@/utils/customViewAndTables";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import { fnGenerateMetaData } from "@/utils/utility";
import service from "@/network/service";
import StockScreeners from "./client";
import { Metadata, ResolvingMetadata } from "next";
import BreadCrumb from "@/components/BreadCrumb";

const getCommonHeadersAndCookies = () => {
  const headersList = headers();
  const cookieStore = cookies();
  return {
    pageUrl: headersList.get("x-url") || "",
    isprimeuser: cookieStore.get("isprimeuser")?.value === "true",
    ssoid: cookieStore.get("ssoid")?.value || "",
    ticketId: cookieStore.get("TicketId")?.value || "",
  };
};

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { pageUrl, isprimeuser, ssoid, ticketId } =
    getCommonHeadersAndCookies();

  const scridMatch = pageUrl.match(/scrid-(\d+)/);
  const scrid = scridMatch ? scridMatch[1] : "";

  if (!scrid) {
    console.error("scrid value not found");
  }

  const screenerTabData = await getScreenerTabViewData({
    type: "screenerGetViewById",
    ssoid,
  });

  const { activeViewId } = screenerTabData;

  const bodyParams = {
    viewId: activeViewId,
    sort: [],
    pagesize: 20,
    pageno: 1,
    deviceId: "web",
    filterType: "index",
    filterValue: [],
    screenerId: scrid,
  };

  const { screenerDetail } = await getCustomViewTable({
    bodyParams,
    isprimeuser,
    apiType: "screenerGetViewById",
    ssoid,
    ticketId,
  });

  const meta = {
    title: screenerDetail?.seoTitle || screenerDetail?.name,
    desc: screenerDetail?.seoDescription,
    keywords: `et, etmarkets, economictimes, ${screenerDetail?.name}`,
    pathname: pageUrl,
  };

  return fnGenerateMetaData(meta);
}

const fetchData = async (apiUrl: string) => {
  const response = await service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const getScreenerNav = async () => {
  const apiParams = `?collectiontypeid=5&screenercount=100&list=true`;
  const apiUrl = `${(APIS_CONFIG as any)?.["screenerL3Nav"][APP_ENV]}${apiParams}`;
  const resJson = await fetchData(apiUrl);

  return {
    l3Nav:
      resJson?.datainfo?.screenerCollectionMasterInfo
        ?.listScreenerCollectionMasterDataInfo || [],
  };
};

const getScreenerUserNav = async (ssoid: string) => {
  const apiParams = `?ssoId=${ssoid}&screenercount=20`;
  const apiUrl = `${(APIS_CONFIG as any)?.["GetScreenerBySSOID"][APP_ENV]}${apiParams}`;
  const resJson = await fetchData(apiUrl);

  const listDataInfo =
    resJson?.datainfo?.screenerCollectionMasterInfo
      ?.listScreenerCollectionMasterDataInfo || [];

  return {
    l3UserNav:
      listDataInfo.find((item: any) => item.collectionId === 0) || null,
  };
};

const ScreenerIneerpage = async ({ params }: any) => {
  const { pageUrl, isprimeuser, ssoid, ticketId } =
    getCommonHeadersAndCookies();

  const scrid =
    params.scrid?.find((el: string) => el.includes("scrid"))?.split("-")[1] ||
    "";

  const [screenerNavData, screenerUserNavData, screenerTabData] =
    await Promise.all([
      getScreenerNav(),
      getScreenerUserNav(ssoid),
      getScreenerTabViewData({ type: "screenerGetViewById", ssoid }),
    ]);

  const { l3Nav } = screenerNavData;
  const { l3UserNav } = screenerUserNavData;
  const { tabData, activeViewId } = screenerTabData;

  const bodyParams = {
    viewId: activeViewId,
    sort: [],
    pagesize: 20,
    pageno: 1,
    deviceId: "web",
    filterType: "index",
    filterValue: [],
    screenerId: scrid,
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
    apiType: "screenerGetViewById",
    ssoid,
    ticketId,
  });

  const meta = {
    title: screenerDetail?.name || "",
    desc: screenerDetail?.description || "",
  };

  const breadCrumbObj = [{ label: meta.title, redirectUrl: "" }];

  return (
    <>
      <StockScreeners
        l3Nav={l3Nav}
        l3UserNav={l3UserNav}
        metaData={meta}
        tabData={tabData}
        activeViewId={activeViewId}
        unixDateTime={unixDateTime}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        isTechnical
        tableConfig={tableConfig.stocksScreener}
        tabConfig={tabConfig.stocksScreener}
        payload={payload}
        ssoidAtServerEnd={ssoid}
        isprimeuser={isprimeuser}
        screenerDetail={screenerDetail}
        scrid={scrid}
      />
      <BreadCrumb pagePath={pageUrl} pageName={breadCrumbObj} />
    </>
  );
};

export default ScreenerIneerpage;
