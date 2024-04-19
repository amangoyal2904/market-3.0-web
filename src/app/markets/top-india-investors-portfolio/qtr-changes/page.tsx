import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullQtrChangesPageClientPage from "./clients";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullQtrChangesPage = async () => {
  const bigBullData = {
    pageData: {},
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <BigBullQtrChangesPageClientPage
      data={bigBullData}
      selectedFilter={selectedFilter}
    />
  );
};

export default BigBullQtrChangesPage;
