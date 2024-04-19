import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";

const BigBullCard = ({ data, type, mode }: any) => {
  return (
    <>
      <div className={`${styles.card} ${styles[type]}`}>
        <div className={styles.top}>
          <img
            src={data?.investorIntro?.imageURL}
            width={52}
            height={52}
            alt={data?.investorIntro?.name}
            className={styles.expertImg}
          />
          <h4 className={styles.expertName}>
            {mode === "transaction" && (
              <span className={styles.green}>Bought By</span>
            )}
            {data?.investorIntro?.name}
          </h4>
        </div>
        {type === "card2" && (
          <div className={styles.middleTop}>
            <div className={styles.mtLeft}>
              <div className={styles.updateDate}>Updated for Mar24 Qtr</div>
              <div className={styles.cname}>Balkrishna Industries Ltd.</div>
            </div>
            <div className={styles.mtRight}>WhL</div>
          </div>
        )}
        <div className={styles.middle}>
          <ul className={styles.netItemList}>
            {data?.stockGroupdata && data?.stockGroupdata.length > 0
              ? data.stockGroupdata.map((item: any, index: number) => {
                  return (
                    <li key={`${index}-dinv`}>
                      <span>{item?.uiLabel?.text}</span>
                      <span className={styles.noTxt}>
                        {item?.uiValue?.text}
                      </span>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
        {type === "card1" && (
          <div className={styles.bottom}>
            <ul className={styles.cardListBtm}>
              {data?.cards && data?.cards.length > 0
                ? data.cards.map((card: any, i: number) => {
                    return (
                      <li key={`${i}-cds`}>
                        <span
                          className={`${styles.topBatch} ${i === 0 ? styles.suc : styles.wr}`}
                        >
                          {card?.text}
                        </span>
                        <h4>{card?.uiLabel.text}</h4>
                        <h5>
                          <span
                            className={`${card?.uiValue.trend === "UP" ? styles.green : styles.red}`}
                          >
                            {card?.uiValue.text}
                          </span>
                        </h5>
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default BigBullCard;
