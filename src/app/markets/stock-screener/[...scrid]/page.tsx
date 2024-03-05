import { cookies, headers } from "next/headers";
import {
  getCustomViewTable,
  getScreenerTabViewData,
} from "@/utils/customViewAndTables";

const ScreenerIneerpage = async ({ params, searchParams }: any) => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const scrid = "";

  const { tabData, activeViewId } = await getScreenerTabViewData({
    type: "watchlist",
    ssoid,
  });
  return (
    <>
      Hello
      <hr />
      {JSON.stringify(params, null, 2)}
      <hr />
      {JSON.stringify({ searchParams }, null, 2)}
      <hr />
      {JSON.stringify(tabData, null, 2)}
    </>
  );
};

export default ScreenerIneerpage;
