import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";
import WatchlistAddition from "../../WatchlistAddition";
import NodataForTable from "../NodataForTable";

const BiggBullQtrChangesTable = ({
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
  return (
    <div className="prel">
      <table className={`${styles.bibBullCustomTable} ${styles.qtrChange}`}>
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
              const currHolding = tdata?.stockdata?.filter(
                (item: any) =>
                  item?.uiValue?.statusCheck === "KCompanyQtr-Pre-Value",
              );
              const prevHolding = tdata?.stockdata?.filter(
                (item: any) =>
                  item?.uiValue?.statusCheck === "KCompanyQtr-Latest-Value",
              );
              const indecrease = tdata?.stockdata?.filter(
                (item: any) =>
                  item?.uiValue?.statusCheck === "KCompanyInc-Dec-Flag-Value",
              );
              const amountInvSold = tdata?.stockdata?.filter(
                (item: any) =>
                  item?.uiValue?.statusCheck === "KCompanyQtr-Latest-Value",
              );

              return (
                <tr key={`${index}`}>
                  <td>
                    <Link
                      href={`/markets/top-india-investors-portfolio/${tdata?.investorIntro?.sharkSeoName},expertid-${tdata?.investorIntro?.sharkID}`}
                      target="_blank"
                      className={styles.investNameImg}
                    >
                      <img
                        src={tdata?.investorIntro?.imageURL}
                        width={42}
                        height={42}
                        alt={tdata?.investorIntro?.name}
                        className={styles.expertImg}
                      />
                      <span className={styles.nameTxt}>
                        <span
                          className={`${styles.fillingTxt} ${tdata?.filingAwaitedTrend && tdata.filingAwaitedTrend !== "" ? styles[tdata?.filingAwaitedTrend] : ""}`}
                        >
                          {tdata?.filingAwaitedText}
                        </span>
                        {tdata?.investorIntro?.name}
                      </span>
                    </Link>
                  </td>
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
                              {tdata.companyData?.text}
                              <span>{tdata.companyData?.marketCapText}</span>
                            </a>
                          </>
                        ) : (
                          <span className={styles.nameBlur}></span>
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
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: stock?.uiValue?.text,
                              }}
                            />
                            {stock?.uiValue?.qtrText &&
                            stock?.uiValue?.qtrText !== "" ? (
                              <span className={styles.qtrText}>
                                {stock?.uiValue?.qtrText}
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
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
  );
};

export default BiggBullQtrChangesTable;
