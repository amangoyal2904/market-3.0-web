import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV } from "../utils";

export const fetchTabsData = async () => {
    //const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
    const ssoid = window.objUser?.ssoid;
    const apiUrl = `${APIS_CONFIG?.watchListTab["development"]}?ssoid=${ssoid}`
    const data = await fetch(apiUrl);
    const res = await data.json();
    return res;
}

export const fetchTableData = async (viewId: any) => {
    //const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
    const ssoid = window.objUser?.ssoid;
    const apiUrl = APIS_CONFIG?.watchListTable["development"];
    const data = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ssoid: ssoid
        },
        body: JSON.stringify({ "pageno": 1, "pagesize": 15, "sort": [], "type": "STOCK", "viewId": viewId, "deviceId": "web" })
    });
    const res = await data.json();
    console.log('tabledata', res)
    return res;
}

export const getStockUrl = (id:number, seoName:string, stockType:string) => {
    if(seoName.indexOf(' ') >= 0) {
        seoName = (seoName.replaceAll(' ', '-').replaceAll('&', '').replaceAll('.', '')).toLowerCase();
    }
    let stockUrl = '/'+seoName+'/stocks/companyid-'+id+'.cms';
    if (stockType != 'equity' && stockType !== '')
        stockUrl = stockUrl + '?companytype=' + stockType.toLowerCase()
    return  stockUrl;
  }