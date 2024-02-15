import { headers, cookies } from "next/headers";
import Service from "../../network/service";
import Watchlist from "../../containers/Watchlist";
import Eticons from "../../containers/Eticons";
import Layout from "../../components/Layout";
import React, { Suspense } from "react";
import { pageType, APP_ENV } from "@/utils";
import NotFound from "@/containers/NotFound";
import APIS_CONFIG from "../../network/api_config.json";
declare global {
  interface Window {
    objVc: any;
    __APP: {
      env?: string;
    };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { all: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const headersList = headers();
  console.log({ headersList });

  const isprimeuser = cookies().get("isprimeuser"),
    { all = [] } = params,
    lastUrlPart: string = all?.slice(-1).toString(),
    api = "";
  //REQUEST = APIS_CONFIG.REQUEST;

  //console.log({isprimeuser});
  console.log("alll", all);
  let page = pageType(all.join("/")),
    extraParams: any = {},
    response: any = {},
    menuData: any = {},
    dynamicFooterData: any = {};

  // =====  Get Left Nav Data =======
  const leftNavApi = (APIS_CONFIG as any)["LEFT_NAV"][APP_ENV];
  const leftNavPromise = await Service.get({
    url: leftNavApi,
    params: {},
  });

  const leftNavResult = await leftNavPromise?.json();

  const versionControl = {};
  console.log("Page???", page);
  return (
    <Layout
      page={page}
      dynamicFooterData={dynamicFooterData}
      menuData={menuData}
      objVc={versionControl}
      data={response}
      leftNavResult={leftNavResult}
    >
      <Suspense fallback={<p>Loading...</p>}>
        {page == "watchlist" ? (
          <Watchlist {...response} objVc={versionControl} />
        ) : page == "eticons" ? (
          <Eticons {...response} objVc={versionControl} />
        ) : (
          <NotFound />
        )}
      </Suspense>
    </Layout>
  );
}
