import { headers, cookies } from 'next/headers';
import Service from "../../network/service";
import APIS_CONFIG from "../../network/api_config.json";
import Watchlist from "../../containers/Watchlist"
import Layout from '../../components/Layout';
import React, { Suspense } from 'react';
import { pageType } from '@/utils';
import NotFound from '@/containers/NotFound';

export default async function Page({ params, searchParams }: {
  params: { all: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = headers()
  console.log({ headersList });
  
  const isprimeuser = cookies().get('isprimeuser'),
  { all = [] } = params,
  lastUrlPart: string = all?.slice(-1).toString(),
  api = APIS_CONFIG.FEED;
  //REQUEST = APIS_CONFIG.REQUEST;

  //console.log({isprimeuser});
  console.log("alll", all);
  let page = pageType(all.join('/')),
  extraParams: any = {},
  response: any = {},
  menuData: any = {},
  dynamicFooterData: any = {};
  
  const versionControl = {};
  console.log("Page???",page);
  return <Layout page={page} dynamicFooterData={dynamicFooterData} menuData={menuData} objVc={versionControl} data={response}>      
    <Suspense fallback={<p>Loading...</p>}>
        {page == "notfound" ? <NotFound/> : <Watchlist {...response} objVc={versionControl} />}
    </Suspense>
  </Layout>
  ;
}