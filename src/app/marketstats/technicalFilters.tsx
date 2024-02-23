import styles from "./Marketstats.module.scss";
const TechnicalFilters = ({ technicalCategory }: any) => {
  return (
    <div className={`dflex align-item-center ${styles.mb20}`}>
      <select className={styles.formControl}>
        {technicalCategory.firstOperands.map((item: any) => (
          <option value={item.fieldName} key={item.fieldID}>
            {item.displayName}
          </option>
        ))}
      </select>
      <select className={styles.formControl}>
        <option value="ABOVE">Above</option>
        <option value="BELOW">Below</option>
      </select>
      {technicalCategory.secondOperands.length ? (
        <select className={styles.formControl}>
          {technicalCategory.secondOperands.map((item: any) => (
            <option value={item.fieldName} key={item.fieldID}>
              {item.displayName}
            </option>
          ))}
        </select>
      ) : (
        <input className={styles.formControl} type="number" />
      )}
      <div className={styles.blackCTA}>Submit</div>
    </div>
  );
};

export default TechnicalFilters;
