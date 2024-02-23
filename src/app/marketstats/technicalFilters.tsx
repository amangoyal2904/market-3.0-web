import styles from "./Marketstats.module.scss";
const TechnicalFilters = ({ technicalCategory }: any) => {
  const firstOperand = technicalCategory.selectedFilter.firstOperand;
  const operationType = technicalCategory.selectedFilter.operationType;
  const secondOperand = technicalCategory.selectedFilter.secondOperand;
  return (
    <div className={`dflex align-item-center ${styles.mb20}`}>
      <select className={styles.formControl} value={firstOperand}>
        {technicalCategory.firstOperands.map((item: any) => (
          <option value={item.fieldName} key={item.fieldID}>
            {item.displayName}
          </option>
        ))}
      </select>
      <select className={styles.formControl} value={operationType}>
        <option value="ABOVE">Above</option>
        <option value="BELOW">Below</option>
      </select>
      {technicalCategory.secondOperands.length ? (
        <select className={styles.formControl} value={secondOperand}>
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
      <div className={styles.blackCTA}>Submit</div>
    </div>
  );
};

export default TechnicalFilters;
