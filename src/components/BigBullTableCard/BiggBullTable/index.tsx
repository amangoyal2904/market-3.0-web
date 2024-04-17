import styles from "./styles.module.scss";
import Image from "next/image";

const BiggBullTable = ({ isSorting = true, isPrime = false }) => {
  const thead: any = {};
  const sortData: any = {};
  const repeatCount = 40;
  return (
    <>
      <table className={styles.bibBullCustomTable}>
        <thead>
          <th>Investors Name</th>
          <th>
            <div className={styles.thead}>
              <div className={styles.theading}>
                {isPrime && thead?.primeFlag ? (
                  <Image
                    src="/prime_icon.svg"
                    width={10}
                    height={10}
                    alt="ETPrime"
                    className={styles.primeIcon}
                  />
                ) : null}
                No. Of Companies
              </div>
              {isSorting &&
                thead.valueType != "date" &&
                (!thead.primeFlag || (isPrime && thead.primeFlag)) && (
                  <span className={`${styles.sortIcons}`}>
                    <span
                      className={`${
                        sortData.field == thead.keyId && sortData.order == "ASC"
                          ? styles.asc
                          : ""
                      } eticon_up_arrow`}
                    ></span>
                    <span
                      className={`${
                        sortData.field == thead.keyId &&
                        sortData.order == "DESC"
                          ? styles.desc
                          : ""
                      } eticon_down_arrow`}
                    ></span>
                  </span>
                )}
            </div>
          </th>
          <th>Networth (Cr)</th>
          <th>Networth (QoQ)</th>
          <th>Best Picks</th>
          <th>Top Activity</th>
        </thead>
        <tbody>
          {Array.from({ length: repeatCount }, (_: any, index: any) => {
            return (
              <tr key={`${index}`}>
                <td>
                  <div className={styles.investNameImg}>
                    <Image
                      src="/img/bigbullAvtar.png"
                      width={42}
                      height={42}
                      alt="Rakesh"
                      className={styles.expertImg}
                    />
                    <span className={styles.nameTxt}>
                      Rakesh Jhunjhunwala Associates
                    </span>
                  </div>
                </td>
                <td>12</td>
                <td>1234</td>
                <td>10.7%</td>
                <td>Jubil</td>
                <td>Zee engt</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default BiggBullTable;
