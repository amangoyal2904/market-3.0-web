import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullMostHeldClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullMostHeldPage = async () => {
  const bigBullData = {
    pageData: {},
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullMostHeldClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
    />
  );
};

export default BigBullMostHeldPage;
