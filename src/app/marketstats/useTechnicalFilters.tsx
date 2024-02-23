import { fetchTechnicalCategory } from "@/utils/utility";

const useTechnicalFilters = async (
  params: any,
  type: any,
  firstOperand: any,
  operationType: any,
  secondOperand: any,
) => {
  const response = await fetchTechnicalCategory(params, type);

  return {
    ...response,
    selectedFilter: {
      firstOperand: firstOperand,
      operationType: operationType,
      secondOperand: secondOperand,
    },
  };
};

export default useTechnicalFilters;
