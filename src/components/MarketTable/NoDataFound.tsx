import styles from "./MarketTable.module.scss";

const NoDataFound = ({ message }: any) => {
  return (
    <div>
      <p className={styles.noDataWrapper}>{message}</p>
    </div>
  );
};
export default NoDataFound;
