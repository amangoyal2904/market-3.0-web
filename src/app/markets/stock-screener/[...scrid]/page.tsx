import { cookies, headers } from "next/headers";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import {
  getCustomViewTable,
  getScreenerTabViewData,
} from "@/utils/customViewAndTables";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Service from "@/network/service";
import StockScreeners from "./client";

const ScreenerIneerpage = async ({ params, searchParams }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const isprimeuser =
    cookieStore.get("isprimeuser") &&
    cookieStore.get("isprimeuser")?.value == "true"
      ? true
      : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const myList = params.scrid;
  const scridElement = myList.find((element: any) => element.includes("scrid"));
  const scridParts = scridElement.split("-");
  const scrid = scridParts[1];
  const pagesize = 20;
  const pageno = 1;
  const sort: any = [];
  const deviceId = "web";
  const filterType = "index";

  const getScreenerNav = async () => {
    // https://screener.indiatimes.com/screener/getScreenerCollectionMasterData?screenercount=3&ssoId=2vff6v9j5sy2xi8elymo46c85
    const apiParams = `?collectiontypeid=5&screenercount=40&list=true`;
    const apiUrl = `${(APIS_CONFIG as any)?.["screenerL3Nav"][APP_ENV]}${apiParams}`;
    const response = await Service.get({
      url: apiUrl,
      params: {},
      cache: "no-store",
    });
    const resJson = await response?.json();

    let l3Nav: any[] = [];
    if (
      resJson &&
      resJson?.datainfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo
        ?.listScreenerCollectionMasterDataInfo
    ) {
      l3Nav = [
        ...resJson.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo,
      ];
    }
    return {
      l3Nav,
    };
  };
  const getScreenerUserNav = async () => {
    const apiParams = `?ssoId=${ssoid}&screenercount=20`;
    const apiUrl = `${(APIS_CONFIG as any)?.["GetScreenerBySSOID"][APP_ENV]}${apiParams}`;
    const response = await Service.get({
      url: apiUrl,
      params: {},
      cache: "no-store",
    });
    const resJson = await response?.json();

    let l3UserNav: any[] = [];
    if (
      resJson &&
      resJson?.datainfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo &&
      resJson?.datainfo?.screenerCollectionMasterInfo
        ?.listScreenerCollectionMasterDataInfo
    ) {
      const listDataInfo = [
        ...resJson.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo,
      ];
      const collectionId = 0;
      const filteredArrays = listDataInfo.filter(
        (item: any) => item.collectionId === collectionId,
      );
      l3UserNav = filteredArrays[0];
    }
    return {
      l3UserNav,
    };
  };
  const { l3Nav } = await getScreenerNav();
  const { l3UserNav } = await getScreenerUserNav();

  const { tabData, activeViewId } = await getScreenerTabViewData({
    type: "screenerGetViewById",
    ssoid,
  });
  const bodyParams = {
    viewId: activeViewId,
    sort,
    pagesize,
    pageno,
    deviceId,
    filterType,
    filterValue: [],
    screenerId: scrid,
  };
  const { tableHeaderData, tableData, pageSummary, payload, screenerDetail } =
    await getCustomViewTable(
      bodyParams,
      isprimeuser,
      ssoid,
      "screenerGetViewById",
    );

  const title =
    screenerDetail && screenerDetail?.name ? screenerDetail.name : "";
  const desc =
    screenerDetail && screenerDetail?.description
      ? screenerDetail.description
      : "";

  const meta = {
    title: title,
    desc: desc,
  };
  return (
    <>
      <StockScreeners
        l3Nav={l3Nav}
        l3UserNav={l3UserNav}
        metaData={meta}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        isTechnical={true}
        tableConfig={tableConfig["stocksScreener"]}
        tabConfig={tabConfig["stocksScreener"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
        screenerDetail={screenerDetail}
        scrid={scrid}
        // l3NavMenuItem={L3NavMenuItem}
        // l3NavSubItem={L3NavSubItem}
        // actualUrl={actualUrl}
        // shortUrlMapping={shortUrlMapping}
      />
    </>
  );
};

export default ScreenerIneerpage;
