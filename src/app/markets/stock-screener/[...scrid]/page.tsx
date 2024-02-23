import styles from "./scid.module.scss";
import APIS_CONFIG from "../../../../network/api_config.json";
import Service from "@/network/service";
import { APP_ENV } from "../../../../utils/index";
import AsideNavComponets from "./ClientComponets/AsideNav";
import RightSideTabTableComponent from "./ClientComponets/RightSide";
import { cookies } from "next/headers";

const fetchData = async () => {
  const bodyParams = `?collectiontypeid=5&screenercount=40`;
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getAllScreenerlist[APP_ENV]}${bodyParams}`;
  const response = await Service.get({
    url: API_URL,
    params: {},
    cache: "no-store",
  });
  return response?.json();
};

const fetchTableData = async (scrid: any) => {
  const API_URL = `${(APIS_CONFIG as any)?.SCREENER?.getScreenerByScreenerId[APP_ENV]}`;
  const bodyparams = {
    pageno: 1,
    pagesize: 25,
    screenerId: scrid,
    deviceId: "web",
  };
  const data = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyparams),
  });
  return data.json();
};
const fetchTabsData = async (statstype: string) => {
  const apiUrl = `${(APIS_CONFIG as any)?.["watchListTab"][APP_ENV]}?statstype=${statstype}`;
  const response = await Service.get({
    url: apiUrl,
    params: {},
    cache: "no-store",
  });

  return response?.json();
};
const ScreenerIneerpages = async ({ params }: any) => {
  const cookieStore = cookies();
  //console.log('cookieStore',cookieStore)
  const asideNavData = await fetchData();
  const asideFitlerData: any =
    asideNavData &&
    asideNavData.datainfo &&
    asideNavData.datainfo.screenerCollectionMasterInfo &&
    asideNavData.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo &&
    asideNavData.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo.length > 0
      ? asideNavData.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo
      : [];
  const scrid = await params.scrid;
  const scridValue = scrid.find((item: any) => item.startsWith("scrid-"));
  const activeId = scridValue ? scridValue.split("-")[1] : "";
  const allTableData = await fetchTableData(activeId);

  const tabData = await fetchTabsData("gainer");
  return (
    <>
      <h1 className="heading">Inner page</h1>
      <div className={styles.container}>
        <aside className={styles.lhs}>
          <AsideNavComponets data={asideFitlerData} activeId={activeId} />
        </aside>
        <div className={styles.rhs}>
          <RightSideTabTableComponent data={allTableData} tabData={tabData} />
          {/* <pre>{JSON.stringify(TableRequestObj, null, 2)}</pre>
                    <pre>{JSON.stringify(TableScreenerDetail, null, 2)}</pre>
                    <pre>{JSON.stringify(TableDataList, null, 2)}</pre> */}
          <pre>{JSON.stringify(scrid, null, 2)}</pre>
          {cookieStore.getAll().map((cookie: any) => {
            return (
              <div key={cookie.name}>
                <p>Name: {cookie.name}</p>
                <p>Value: {cookie.value}</p>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ScreenerIneerpages;
