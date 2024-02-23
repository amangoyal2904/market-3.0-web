"use client";
import { useState } from "react";
import styles from "./Marketstats.module.scss";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { updateOrAddParamToPath } from "@/utils/utility";

const TechnicalFilters = ({ technicalCategory }: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [firstOperand, setFirstOperand] = useState(
    technicalCategory.selectedFilter.firstOperand,
  );
  const [operationType, setOperationType] = useState(
    technicalCategory.selectedFilter.operationType,
  );
  const [secondOperand, setSecondOperand] = useState(
    technicalCategory.selectedFilter.secondOperand,
  );

  const handleFirstOperandChange = (event: any) => {
    setFirstOperand(event.target.value);
  };

  const handleOperationTypeChange = (event: any) => {
    setOperationType(event.target.value);
  };

  const handleSecondOperandChange = (event: any) => {
    setSecondOperand(event.target.value);
  };

  const onSumbitHandler = () => {
    const url = `${pathname}?${searchParams}`;
    let fnewUrl = updateOrAddParamToPath(url, "firstoperand", firstOperand),
      snewUrl = updateOrAddParamToPath(fnewUrl, "secondoperand", secondOperand),
      finalUrl = updateOrAddParamToPath(
        snewUrl,
        "operationtype",
        operationType,
      );
    router.push(finalUrl, { scroll: false });
  };

  return (
    <div className={`dflex align-item-center ${styles.mb20}`}>
      <select
        className={styles.formControl}
        value={firstOperand}
        onChange={handleFirstOperandChange}
      >
        {technicalCategory.firstOperands.map((item: any) => (
          <option value={item.fieldName} key={item.fieldID}>
            {item.displayName}
          </option>
        ))}
      </select>
      <select
        className={styles.formControl}
        value={operationType}
        onChange={handleOperationTypeChange}
      >
        <option value="ABOVE">Above</option>
        <option value="BELOW">Below</option>
      </select>
      {technicalCategory.secondOperands.length ? (
        <select
          className={styles.formControl}
          value={secondOperand}
          onChange={handleSecondOperandChange}
        >
          {technicalCategory.secondOperands.map((item: any) => (
            <option value={item.fieldName} key={item.fieldID}>
              {item.displayName}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={styles.formControl}
          type="number"
          value={secondOperand}
        />
      )}
      <div className={styles.blackCTA} onClick={onSumbitHandler}>
        Submit
      </div>
    </div>
  );
};

export default TechnicalFilters;
