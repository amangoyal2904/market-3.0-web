import styles from "./styles.module.scss";
import Image from "next/image";

const BiggBullTable = ({
  tableHead,
  tableData,
  isSorting = true,
  isPrime = false,
}: any) => {
  const thead: any = {};
  const sortData: any = {};
  return (
    <>
      <table className={styles.bibBullCustomTable}>
        <thead>
          <tr>
            {tableHead &&
              tableHead.length > 0 &&
              tableHead.map((th: any, index: number) => {
                return (
                  <th key={`${index}-${th.id}`}>
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
                        {th.name}
                      </div>
                      {th.sort &&
                        thead.valueType != "date" &&
                        (!thead.primeFlag || (isPrime && thead.primeFlag)) && (
                          <span className={`${styles.sortIcons}`}>
                            <span
                              className={`${
                                sortData.field == thead.keyId &&
                                sortData.order == "ASC"
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
                );
              })}
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.length > 0 &&
            tableData.map((tdata: any, index: any) => {
              const networthIncome = tdata?.stockGroupdata?.filter(
                (item: any) => item?.uiValue?.statusCheck === "lNetworthValue",
              );
              const networthQoQ = tdata?.stockGroupdata?.filter(
                (item: any) => item?.uiValue?.statusCheck === "lReturnValue",
              );
              return (
                <tr key={`${index}`}>
                  <td>
                    <div className={styles.investNameImg}>
                      <img
                        src={tdata?.investorIntro?.imageURL}
                        width={42}
                        height={42}
                        alt={tdata?.investorIntro?.name}
                        className={styles.expertImg}
                      />
                      <span className={styles.nameTxt}>
                        {tdata?.investorIntro?.name}
                      </span>
                    </div>
                  </td>
                  <td>{tdata?.companyCount}</td>
                  <td>
                    {networthIncome.length > 0
                      ? networthIncome[0].uiValue?.text
                      : null}
                  </td>
                  <td>
                    {networthQoQ.length > 0
                      ? networthQoQ[0].uiValue?.text
                      : null}
                  </td>
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
