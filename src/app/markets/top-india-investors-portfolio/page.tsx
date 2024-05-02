import styles from "./style.module.scss";
import { commonPostAPIHandler } from "../../../utils/screeners";
import BigBullClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";
import { headers } from "next/headers";
import BreadCrumb from "@/components/BreadCrumb";

const BigBullPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const payload = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 3,
    pageNo: 1,
  };
  const data = await commonPostAPIHandler(
    `BigBullAllInverstorOverview`,
    payload,
  );
  const bigBullData = {
    pageData: data.datainfo,
  };
  return (
    <>
      {/* {JSON.stringify(pageUrl)} */}
      <BigBullClientPage data={bigBullData} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Overview", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullPage;
