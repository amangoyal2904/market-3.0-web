import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";

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
              const bestPicks = tdata?.cards?.filter(
                (item: any) => item?.type === "bestpick",
              );
              const bestPicksToNext = tdata?.cards?.filter(
                (item: any) =>
                  item?.type === "freshentryexit" ||
                  item?.type === "mostincrease",
              );
              const updownClass =
                networthQoQ.length > 0 &&
                networthQoQ[0].uiValue?.trend &&
                networthQoQ[0].uiValue?.trend === "UP"
                  ? "up"
                  : networthQoQ[0].uiValue?.trend === "DOWN"
                    ? "down"
                    : "";
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
                    <span
                      className={`${styles[updownClass]}`}
                      dangerouslySetInnerHTML={{
                        __html:
                          networthQoQ.length > 0
                            ? networthQoQ[0].uiValue?.text
                            : null,
                      }}
                    />
                  </td>
                  <td className={styles.bestPicWraper}>
                    <div className={styles.bestPickSec}>
                      <div className={styles.leftSec}>
                        <h5 className={styles.head5}>
                          <a
                            href={getStockUrl(
                              bestPicks[0].uiLabel?.companyId,
                              bestPicks[0].uiLabel?.companySeoName,
                              bestPicks[0].uiLabel?.companyType,
                            )}
                            target="_blank"
                          >
                            {bestPicks.length > 0
                              ? bestPicks[0].uiLabel?.text
                              : null}
                          </a>
                        </h5>
                        <span
                          className={`${styles.bestTxtSec} ${
                            bestPicks.length > 0
                              ? styles[bestPicks[0].uiValue?.trend]
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html:
                              bestPicks.length > 0
                                ? bestPicks[0].uiValue?.text
                                : null,
                          }}
                        ></span>
                      </div>
                      <div className={styles.rightSec}>+</div>
                    </div>
                  </td>
                  <td
                    className={`${styles.bestPicWraper} ${styles.bestPic2Wraper}`}
                  >
                    <div className={styles.bestPickSec}>
                      <div className={styles.leftSec}>
                        <h5 className={styles.head5}>
                          <a
                            href={getStockUrl(
                              bestPicksToNext[0].uiLabel?.companyId,
                              bestPicksToNext[0].uiLabel?.companySeoName,
                              bestPicksToNext[0].uiLabel?.companyType,
                            )}
                            target="_blank"
                          >
                            {bestPicksToNext.length > 0
                              ? bestPicksToNext[0].uiLabel?.text
                              : null}
                          </a>
                        </h5>
                        <span
                          className={`${styles.bestTxtSec} ${
                            bestPicksToNext.length > 0
                              ? styles[bestPicksToNext[0].uiValue?.trend]
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html:
                              bestPicksToNext.length > 0
                                ? bestPicksToNext[0].uiValue?.text
                                : null,
                          }}
                        ></span>
                      </div>
                      <div className={styles.rightSec}>+</div>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default BiggBullTable;
