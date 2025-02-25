import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";
// import WatchlistAddition from "../../WatchlistAddition";
import NodataForTable from "../NodataForTable";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
const NonPrimeBlockerModule = dynamic(() => import("../../NonPrimeBlocker"), {
  ssr: false,
});

import { redirectToPlanPage, trackingEvent } from "@/utils/ga";
const WatchlistAddition = dynamic(() => import("../../WatchlistAddition"), {
  ssr: false,
});

const BiggBullRecentTransactionsTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
  sectionName = "",
}: any) => {
  //console.log("tableData", tableData);
  const { state } = useStateContext();
  const { isPrime } = state.login;
  //const isPrime = true;
  //console.log("isPrime", isPrime);
  const [companyName, setCompanyName] = useState("");
  const [showNonPrimeBlocker, setShowNonPrimeBlocker] = useState(false);
  const blurNameHandler = (companyName: string) => {
    const objTracking = {
      category: "mercury_engagement",
      action: "card_clicked",
      label: `${companyName}`,
      widget_name: `${sectionName}`,
      tab_name: `${sectionName}`,
      obj: {
        item_name: "bigbull_investors",
        item_id: companyName,
        item_brand: "market_tools",
        item_category: "bigbull",
        item_category2: "bigbull_investors",
        item_category3: "",
        item_category4: "",
      },
      cdp: {
        event_nature: "impression",
        event_category: "subscription",
        event_name: "subscription_feature",
      },
    };
    redirectToPlanPage(objTracking, "view_item_list", false);
    setCompanyName(companyName);
    setShowNonPrimeBlocker(true);
    document.body.style.overflow = "hidden";
  };
  const blurNameHandlerClose = () => {
    setShowNonPrimeBlocker(false);
    document.body.style.overflow = "";
  };
  const gaTrackingCompanyNameClick = (comname: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "company_clicked",
      event_label: comname,
    });
  };
  const gaTrackingInvestorNameClick = (investorName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "investor_clicked",
      event_label: investorName,
    });
  };
  return (
    <>
      <div className="prel">
        <table className={`${styles.bibBullCustomTable} ${styles.recentTrans}`}>
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
                        onClick={() =>
                          gaTrackingInvestorNameClick(
                            tdata?.investorIntro?.name,
                          )
                        }
                        href={`/markets/top-india-investors-portfolio/${tdata?.investorIntro?.sharkSeoName},expertid-${tdata?.investorIntro?.sharkID}`}
                        className={styles.investNameImg}
                        title={tdata?.investorIntro?.name}
                      >
                        <img
                          src={tdata?.investorIntro?.imageURL}
                          width={42}
                          height={42}
                          alt={tdata?.investorIntro?.name}
                          className={styles.expertImg}
                          title={tdata?.investorIntro?.name}
                          loading="lazy"
                        />
                        <span className={styles.nameTxt}>
                          <span className={styles.fillingTxt}>
                            {tdata?.dealDateStr}
                          </span>
                          {tdata?.investorIntro?.name}
                        </span>
                      </Link>
                    </td>
                    <td>
                      <div
                        className={`${styles.buySellSec} ${styles[tdata?.dealSignal]}`}
                      >
                        {tdata?.dealSignal && tdata?.dealSignal.toLowerCase()}
                      </div>
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
                                onClick={() =>
                                  gaTrackingCompanyNameClick(
                                    tdata.companyData?.text,
                                  )
                                }
                                href={getStockUrl(
                                  tdata?.companyData?.companyId,
                                  tdata?.companyData?.companySeoName,
                                  tdata?.companyData?.companyType,
                                )}
                                target="_blank"
                                className={styles.linkTxt}
                                title={tdata?.companyData?.text}
                              >
                                {tdata.companyData?.text}
                              </a>
                            </>
                          ) : (
                            <span
                              className={styles.nameBlur}
                              onClick={() =>
                                blurNameHandler(tdata.companyData?.text)
                              }
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
      {showNonPrimeBlocker && (
        <Suspense fallback={<div>Loading</div>}>
          <NonPrimeBlockerModule
            oncloseModule={blurNameHandlerClose}
            companyName={companyName}
            sectionName={sectionName}
          />
        </Suspense>
      )}
    </>
  );
};

export default BiggBullRecentTransactionsTable;
