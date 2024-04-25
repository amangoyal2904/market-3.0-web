import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";

const BiggBullMostHeldTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
}: any) => {
  console.log("tableData", tableData);
  const { state } = useStateContext();
  const { isPrime } = state.login;
  console.log("isPrime", isPrime);
  return (
    <div className="prel">
      <table className={styles.bibBullCustomTable}>
        <thead>
          <tr>
            {tableHead &&
              tableHead.length > 0 &&
              tableHead.map((thead: any, index: number) => {
                return (
                  <th
                    key={`${index}-${thead.id}`}
                    className={`${thead.sort ? styles.enableSort : ""}`}
                  >
                    <div
                      className={`${styles.thead}`}
                      onClick={() => {
                        thead.sort &&
                        (!thead.primeFlag || (isPrime && thead.primeFlag))
                          ? handleSort(thead?.id, thead?.orderBy)
                          : null;
                      }}
                    >
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
                        {thead.name}
                      </div>
                      {thead.sort &&
                        (!thead.primeFlag || (isPrime && thead.primeFlag)) && (
                          <span className={`${styles.sortIcons}`}>
                            <span
                              className={`${
                                sortData?.field == thead.id &&
                                sortData?.order == "ASC"
                                  ? styles.asc
                                  : ""
                              } eticon_up_arrow`}
                            ></span>
                            <span
                              className={`${
                                sortData?.field == thead.id &&
                                sortData?.order == "DESC"
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
              return (
                <tr key={`${index}`}>
                  <td>
                    <div className={styles.comNameSec}>
                      <div>
                        {!isPrime ? (
                          <a
                            href={getStockUrl(
                              tdata?.companyData?.companyId,
                              tdata?.companyData?.companySeoName,
                              tdata?.companyData?.companyType,
                            )}
                            target="_blank"
                          >
                            {tdata?.companyData?.text}
                          </a>
                        ) : (
                          <span className={styles.nameBlur}></span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.mostHeldListitem}>
                      <ul>
                        {tdata?.investorsList.length > 0 &&
                          tdata?.investorsList
                            .slice(0, 2)
                            .map((list: any, index: number) => {
                              return (
                                <li key={`-${index}--`}>
                                  <img
                                    src={list.imageURL}
                                    width={28}
                                    height={28}
                                    alt={list.name}
                                    title={list.name}
                                  />
                                  <h4>{list.name}</h4>
                                </li>
                              );
                            })}
                      </ul>
                    </div>
                  </td>
                  {tdata?.stockdata?.length > 0
                    ? tdata?.stockdata.map((stock: any, index: any) => {
                        const updownClass =
                          stock.uiValue?.trend === "UP"
                            ? "up"
                            : stock.uiValue?.trend === "DOWN"
                              ? "down"
                              : "";
                        return (
                          <td
                            className={styles[updownClass]}
                            key={`${stock?.uiLabel?.statusCheck}-${index}`}
                            dangerouslySetInnerHTML={{
                              __html: stock?.uiValue?.text,
                            }}
                          ></td>
                        );
                      })
                    : ""}
                  {/* <td>
                    {currHolding.length > 0
                      ? currHolding[0].uiValue?.text
                      : null}
                  </td>
                  <td>
                    {prevHolding.length > 0
                      ? prevHolding[0].uiValue?.text
                      : null}
                  </td>
                  <td>
                    <span
                      className={`${styles[updownClass]}`}
                      dangerouslySetInnerHTML={{
                        __html:
                          indecrease.length > 0
                            ? indecrease[0].uiValue?.text
                            : null,
                      }}
                    />
                  </td>
                  <td>
                    {amountInvSold.length > 0
                      ? amountInvSold[0].uiValue?.text
                      : null}
                  </td> */}
                </tr>
              );
            })}
        </tbody>
      </table>
      {shouldShowLoader && <Loader loaderType="container" />}
    </div>
  );
};

export default BiggBullMostHeldTable;
