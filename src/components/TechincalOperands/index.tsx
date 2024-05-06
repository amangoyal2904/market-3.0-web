import React, { useEffect, useState } from "react";
import styles from "./TechnicalOperands.module.scss";

const TechnicalOperands = React.memo(
  ({ technicalCategory, handleTechnicalOperands }: any) => {
    const [firstOperand, setFirstOperand] = useState(
      technicalCategory.selectedFilter.firstOperand,
    );
    const [operationType, setOperationType] = useState(
      technicalCategory.selectedFilter.operationType,
    );
    const [secondOperand, setSecondOperand] = useState(
      technicalCategory.selectedFilter.secondOperand,
    );

    const handleFirstOperandChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const selectedValue = event.target.value;
      setFirstOperand(selectedValue);
      // Disable selected option in second operand
      setSecondOperand((prevSecondOperand: any) =>
        prevSecondOperand === selectedValue ? "" : prevSecondOperand,
      );
    };

    const handleOperationTypeChange = (
      event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setOperationType(event.target.value);
    };

    const handleSecondOperandChange = (
      event:
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement>,
    ) => {
      const selectedValue = event.target.value;
      setSecondOperand(selectedValue);
      // Disable selected option in first operand
      setFirstOperand((prevFirstOperand: any) =>
        prevFirstOperand === selectedValue ? "" : prevFirstOperand,
      );
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const validNum = /^\d*$/;
      if (validNum.test(value) || value === "") {
        setSecondOperand(value);
      }
    };

    const handleSubmit = () => {
      handleTechnicalOperands({ firstOperand, secondOperand, operationType });
    };

    useEffect(() => {
      setFirstOperand(technicalCategory.selectedFilter.firstOperand);
      setOperationType(technicalCategory.selectedFilter.operationType);
      setSecondOperand(technicalCategory.selectedFilter.secondOperand);
    }, [technicalCategory]);

    return (
      <div className={`dflex align-item-center ${styles.mb20}`}>
        <select
          className={styles.formControl}
          value={firstOperand}
          onChange={handleFirstOperandChange}
        >
          {technicalCategory.firstOperands &&
            technicalCategory.firstOperands.map((item: any) => (
              <option
                value={item.fieldName}
                key={item.fieldID}
                disabled={secondOperand === item.fieldName}
              >
                {item.displayName}
              </option>
            ))}
        </select>
        <select
          className={styles.formControl}
          value={operationType}
          onChange={handleOperationTypeChange}
        >
          {technicalCategory.operationType &&
            technicalCategory.operationType.map((item: any, index: number) => (
              <option value={item.fieldName} key={index}>
                {item.displayName}
              </option>
            ))}
        </select>
        {technicalCategory.secondOperands &&
        technicalCategory.secondOperands.length ? (
          <select
            className={styles.formControl}
            value={secondOperand}
            onChange={handleSecondOperandChange}
          >
            {technicalCategory.secondOperands.map((item: any) => (
              <option
                value={item.fieldName}
                key={item.fieldID}
                disabled={firstOperand === item.fieldName}
              >
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
            maxLength={10}
          />
        )}
        <div className={styles.blackCTA} onClick={handleSubmit}>
          Submit
        </div>
      </div>
    );
  },
);
TechnicalOperands.displayName = "TechnicalOperands";
export default TechnicalOperands;
