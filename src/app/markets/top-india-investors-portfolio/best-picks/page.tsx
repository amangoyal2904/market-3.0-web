import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullBestPicksPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullBestPicksPage = async () => {
  const bigBullData = {
    pageData: {},
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullBestPicksPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
    />
  );
};

export default BigBullBestPicksPage;
