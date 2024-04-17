import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";

const BigBullCard = ({ type, mode }: any) => {
  return (
    <>
      <div className={`${styles.card} ${styles[type]}`}>
        <div className={styles.top}>
          <Image
            src="/img/bigbullAvtar.png"
            width={52}
            height={52}
            alt="Rakesh"
            className={styles.expertImg}
          />
          <h4 className={styles.expertName}>
            {mode === "transaction" && (
              <span className={styles.green}>Bought By</span>
            )}
            Rakesh Jhunjhunwala & Associates
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
            <li>
              <span>Companies</span>
              <span className={styles.noTxt}>27</span>
            </li>
            <li>
              <span>Networth (Crs.)</span>
              <span className={styles.noTxt}>35,171.1</span>
            </li>
            <li>
              <span>Networth (QoQ)</span>
              <span className={styles.noTxt}>21.57%</span>
            </li>
          </ul>
        </div>
        {type === "card1" && (
          <div className={styles.bottom}>
            <ul className={styles.cardListBtm}>
              <li>
                <span className={`${styles.topBatch} ${styles.suc}`}>
                  Best Pick
                </span>
                <h4>Wockhardt Ltd.</h4>
                <h5>
                  <span className={styles.green}>+61.00%</span> in 3 months
                </h5>
              </li>
              <li>
                <span className={`${styles.topBatch} ${styles.wr}`}>
                  Fresh Entry
                </span>
                <h4>VaTech Wabag</h4>
                <h5>
                  <span className={styles.green}>Invested 369 Cr</span>
                </h5>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default BigBullCard;
