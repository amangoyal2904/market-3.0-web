import { commonPostAPIHandler } from "../../../../utils/screeners";
import { fetchSelectedFilter } from "@/utils/utility";

const InvestorPage = async (props: any) => {
  //   const payload = {
  //     ssoId: "",
  //     investorType: "INDIVIDUAL",
  //     sortBy: "networth",
  //     orderBy: "DESC",
  //     primeFlag: 1,
  //     pageSize: 3,
  //     pageNo: 1,
  //   };
  //   const data = await commonPostAPIHandler(
  //     `BigBullAllInverstorOverview`,
  //     payload,
  //   );
  const bigBullData = {
    pageData: "",
  };
  return (
    <>
      Heloo
      {JSON.stringify(props)}
    </>
  );
};

export default InvestorPage;
