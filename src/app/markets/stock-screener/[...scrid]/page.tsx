import { cookies, headers } from "next/headers";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import {
  getCustomViewTable,
  getScreenerTabViewData,
} from "@/utils/customViewAndTables";
import StockScreeners from "./client";

const ScreenerIneerpage = async ({ params, searchParams }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const scrid = "2554";
  const pagesize = 20;
  const pageno = 1;
  const sort: any = [];
  const deviceId = "web";
  const filterType = "index";

  const { tabData, activeViewId } = await getScreenerTabViewData({
    type: "watchlist",
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
  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(
      bodyParams,
      isprimeuser,
      ssoid,
      "screenerGetViewById",
    );

  const title = "stock screener page";
  const desc = `Discover the stocks in the Indian stock market with exclusively on The Economic Times`;

  const meta = {
    title: title,
    desc: desc,
  };
  return (
    <>
      <hr />
      {JSON.stringify(params, null, 2)}

      <br />
      <StockScreeners
        // l3Nav={l3Nav}
        metaData={meta}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        isTechnical={true}
        // technicalCategory={technicalCategory}
        tableConfig={tableConfig["stocksScreener"]}
        tabConfig={tabConfig["stocksScreener"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
        // l3NavMenuItem={L3NavMenuItem}
        // l3NavSubItem={L3NavSubItem}
        // actualUrl={actualUrl}
        // shortUrlMapping={shortUrlMapping}
      />
    </>
  );
};

export default ScreenerIneerpage;
