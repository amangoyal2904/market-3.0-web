import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullRecentTransactionsPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullRecentTransactionsPage = async () => {
  const bigBullData = {
    pageData: {},
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullRecentTransactionsPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
    />
  );
};

export default BigBullRecentTransactionsPage;
