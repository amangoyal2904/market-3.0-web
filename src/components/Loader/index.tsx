import styles from "./styles.module.scss";

const Loader = () => {
  return (
    <>
      <div className={styles.loading_layer} id="loading_layer">
        <div className={styles.spinner}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
}
export default Loader;
