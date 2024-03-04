"use client";
import { useState } from "react";
import styles from "./TechnicalOperands.module.scss";

const TechincalOperands = ({
  technicalCategory,
  handleTechnicalOperands,
}: any) => {
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

  const handleTextChange = (e: any) => {
    const { value } = e.target;
    const validNum = /^\d+$/;
    if (validNum.test(value) || value === "") {
      setSecondOperand(value);
    }
  };

  const onSumbitHandler = () => {
    handleTechnicalOperands({ firstOperand, secondOperand, operationType });
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
        {technicalCategory.operationType.map((item: any, index: number) => (
          <option value={item.fieldName} key={index}>
            {item.displayName}
          </option>
        ))}
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
          type="text"
          value={secondOperand}
          onChange={handleTextChange}
        />
      )}
      <div className={styles.blackCTA} onClick={onSumbitHandler}>
        Submit
      </div>
    </div>
  );
};

export default TechincalOperands;
