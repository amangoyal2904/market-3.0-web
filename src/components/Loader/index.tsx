import styles from "./styles.module.scss";

const Loader = ({ loaderType }: any) => {
  return (
    <>
      <div
        className={
          loaderType == "inner"
            ? styles.innerLoading_layer
            : loaderType == "container"
              ? styles.container_layer
              : loaderType == "containerBg"
                ? styles.container_whitelayer
                : styles.loading_layer
        }
        id="loading_layer"
      >
        <div className={styles.spinner}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};
export default Loader;
