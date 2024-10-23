import styles from "./styles.module.scss";

const HeroBanner = ({ title, desc }: any) => {
  return (
    <>
      <div className={styles.heroWrap}>
        <h1 className={styles.head1}>{title}</h1>
        <p className={styles.pTxt}>{desc}</p>
      </div>
    </>
  );
};

export default HeroBanner;
