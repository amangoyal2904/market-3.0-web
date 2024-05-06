import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";
import WatchlistAddition from "../../WatchlistAddition";
import NodataForTable from "../NodataForTable";
import { useState } from "react";

const BiggBullMostHeldTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
}: any) => {
  //console.log("tableData", tableData);
  const { state } = useStateContext();
  const { isPrime } = state.login;
  //const isPrime = true;
  //console.log("isPrime", isPrime);
  const [showPopupIndex, setShowPopupIndex] = useState<number | null>(null);

  const showMoreInvestorHandler = (index: number) => {
    if (showPopupIndex === index) {
      setShowPopupIndex(null); // Clicking on the same item should close the popup
    } else {
      setShowPopupIndex(index); // Clicking on a different item should show its popup
    }
  };
  return (
    <div className="prel">
      <table className={`${styles.bibBullCustomTable} ${styles.mostHeldTable}`}>
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
                        thead.sort
                          ? handleSort(thead?.id, thead?.orderBy)
                          : null;
                      }}
                    >
                      <div className={styles.theading}>{thead.name}</div>
                      {thead.sort && (
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
          {tableData && tableData.length > 0 ? (
            tableData.map((tdata: any, index: any) => {
              return (
                <tr key={`${index}`}>
                  <td>
                    <div className={styles.comNameSec}>
                      <div className={styles.comDivSec}>
                        {isPrime ? (
                          <>
                            <WatchlistAddition
                              companyName={tdata.companyData?.text}
                              companyId={tdata?.companyData?.companyId}
                              companyType={tdata?.companyData?.companyType}
                              customStyle={{
                                width: "18px",
                                height: "18px",
                              }}
                            />
                            <a
                              href={getStockUrl(
                                tdata?.companyData?.companyId,
                                tdata?.companyData?.companySeoName,
                                tdata?.companyData?.companyType,
                              )}
                              target="_blank"
                              className={styles.linkTxt}
                            >
                              {tdata?.companyData?.text}
                              <span>{tdata.companyData?.marketCapText}</span>
                            </a>
                          </>
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
                                  <Link
                                    href={`/markets/top-india-investors-portfolio/${list?.sharkSeoName},expertid-${list?.sharkID}`}
                                    target="_blank"
                                    className={styles.investNameImg}
                                  >
                                    <img
                                      src={list.imageURL}
                                      width={28}
                                      height={28}
                                      alt={list.name}
                                      title={list.name}
                                    />
                                    <h4>{list.name}</h4>
                                  </Link>
                                </li>
                              );
                            })}
                        {tdata?.investorsList.length > 2 && (
                          <li className={styles.dotes}>
                            <span
                              className={styles.iconBtn}
                              onClick={() => showMoreInvestorHandler(index)}
                            >
                              <i></i>
                              <i></i>
                              <i></i>
                            </span>
                            {showPopupIndex === index && (
                              <div className={styles.popup}>
                                <div className={styles.popupContent}>
                                  <span
                                    className={styles.closeBtn}
                                    onClick={() => setShowPopupIndex(null)}
                                  ></span>
                                  <div className={styles.contentWraper}>
                                    {tdata?.investorsList.length > 0 &&
                                      tdata?.investorsList
                                        .slice(2, 6)
                                        .map((list: any, index: number) => {
                                          return (
                                            <div
                                              className={styles.userSec}
                                              key={`-${index}--`}
                                            >
                                              <Link
                                                href={`/markets/top-india-investors-portfolio/${list?.sharkSeoName},expertid-${list?.sharkID}`}
                                                target="_blank"
                                                className={styles.investNameImg}
                                              >
                                                <img
                                                  src={list.imageURL}
                                                  width={28}
                                                  height={28}
                                                  alt={list.name}
                                                  title={list.name}
                                                />
                                                <h4>{list.name}</h4>
                                              </Link>
                                            </div>
                                          );
                                        })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </li>
                        )}
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
                            className={`${styles.rightTxt} ${styles[updownClass]}`}
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
            })
          ) : (
            <tr>
              <td colSpan={100} className={styles.nodatafound}>
                <NodataForTable />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {shouldShowLoader && <Loader loaderType="container" />}
    </div>
  );
};

export default BiggBullMostHeldTable;
