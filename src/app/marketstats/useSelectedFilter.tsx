import { fetchFilters } from "@/utils/utility";

const fetchSelectedFilter = async (data: any, desiredIndexId: any) => {
  let filterData;
  if (data.keyIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)) {
    filterData = data.keyIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.keyIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.keyIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  } else if (
    data.sectoralIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.sectoralIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.sectoralIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.sectoralIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  } else if (
    data.otherIndices.nse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.otherIndices.nse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "nse";
  } else if (
    data.otherIndices.bse.some((obj: any) => obj.indexId == desiredIndexId)
  ) {
    filterData = data.otherIndices.bse.find(
      (obj: any) => obj.indexId == desiredIndexId,
    );
    filterData.selectedTab = "bse";
  }
  return filterData;
};

const useSelectedFilter = async (filter: any) => {
  let selectedFilter;
  const filters = await fetchFilters();
  if (!!filter) {
    selectedFilter = await fetchSelectedFilter(filters, filter);
  } else {
    selectedFilter = { name: "All Stocks", indexId: 0, selectedTab: "nse" };
  }

  return {
    name: selectedFilter.name,
    id: selectedFilter.indexId,
    selectedTab: selectedFilter.selectedTab,
  };
};

export default useSelectedFilter;
