import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";
import WatchlistAddition from "../../WatchlistAddition";
import NodataForTable from "../NodataForTable";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
const NonPrimeBlockerModule = dynamic(() => import("../../NonPrimeBlocker"), {
  ssr: false,
});

const BiggBullInvestorHoldingTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
}: any) => {
  //console.log("tableHead", tableHead);
  const { state } = useStateContext();
  const { isPrime } = state.login;
  //const isPrime = true;
  //console.log("isPrime", isPrime);
  const [showNonPrimeBlocker, setShowNonPrimeBlocker] = useState(false);
  const blurNameHandler = () => {
    setShowNonPrimeBlocker(true);
    document.body.style.overflow = "hidden";
  };
  const blurNameHandlerClose = () => {
    setShowNonPrimeBlocker(false);
    document.body.style.overflow = "";
  };
  return (
    <>
      <div className="prel">
        <table
          className={`${styles.bibBullCustomTable} ${styles.holdingInvestor}`}
        >
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
            {tableData && tableData?.length > 0 ? (
              tableData?.map((tdata: any, index: any) => {
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
                                <span>{tdata?.latestAvailableQtr}</span>
                              </a>
                            </>
                          ) : (
                            <span
                              className={styles.nameBlur}
                              onClick={blurNameHandler}
                            ></span>
                          )}
                        </div>
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
      {showNonPrimeBlocker && (
        <Suspense fallback={<div>Loading</div>}>
          <NonPrimeBlockerModule oncloseModule={blurNameHandlerClose} />
        </Suspense>
      )}
    </>
  );
};

export default BiggBullInvestorHoldingTable;
