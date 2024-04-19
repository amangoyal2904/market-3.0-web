import styles from "./style.module.scss";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wraper}>
      <div className={styles.topSec}>
        <h1 className={`heading ${styles.head}`}>
          <span className={styles.etprimeLogo}>ETPrime</span>
          <span className={styles.bigLogo}>Big</span>
          <span className={styles.bullTxt}>Bull Portfolio</span>
        </h1>
        <p className={styles.desc}>
          Get to know where the market gurus invest to grow your portfolio.
        </p>
      </div>
      {children}
    </div>
  );
}
