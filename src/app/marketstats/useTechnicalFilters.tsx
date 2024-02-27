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
    selectedFilterLabel: {
      firstOperand: response?.firstOperands.find(
        (operand: any) => operand.fieldName === firstOperand,
      )?.displayName,
      operationType: response?.operationType.find(
        (operand: any) => operand.fieldName === operationType,
      )?.displayName,
      secondOperand: !isNaN(secondOperand)
        ? secondOperand
        : response?.secondOperands.find(
            (operand: any) => operand.fieldName === secondOperand,
          )?.displayName,
    },
    category: params,
  };
};

export default useTechnicalFilters;
