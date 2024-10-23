import styles from "./styles.module.scss";

const NoDataCard = ({ title }: any) => {
  return (
    <>
      <div className={styles.textError}>
        <div className={styles.noDataFound}></div>
        <p>{title}</p>
      </div>
    </>
  );
};

export default NoDataCard;
