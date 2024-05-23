import styles from "./styles.module.scss";

const LeftSecModule = ({ investorIntro, investorStockData }: any) => {
  return (
    <div className={styles.leftTxt}>
      <img
        src={investorIntro.imageURL}
        alt={investorIntro.name}
        title={investorIntro.name}
        width={140}
        height={140}
        className={styles.leftImg}
      />
      <div className={styles.rightTxt}>
        <h1 className={styles.head1}>{investorIntro.name}</h1>
        <p className={styles.pxtDec}>{investorIntro.aboutShark}</p>
        <ul className={styles.complist}>
          {investorStockData.length > 0
            ? investorStockData.map((sdata: any, index: number) => {
                return (
                  <li key={`${index}-sd`}>
                    <span>{sdata?.uiLabel?.text}: </span>
                    <span
                      className={`${sdata?.uiValue?.trend === "UP" ? styles.up : sdata?.uiValue?.trend === "DOWN" ? styles.down : styles.bold}`}
                      dangerouslySetInnerHTML={{ __html: sdata?.uiValue?.text }}
                    />
                  </li>
                );
              })
            : ""}
        </ul>
      </div>
    </div>
  );
};

export default LeftSecModule;
