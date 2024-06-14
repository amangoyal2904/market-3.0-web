import styles from "./styles.module.scss";
import Image from "next/image";
import { getStockUrl } from "@/utils/utility";
import Link from "next/link";
import Loader from "../../Loader";
import { useStateContext } from "@/store/StateContext";
// import WatchlistAddition from "../../WatchlistAddition";
import { redirectToPlanPage, trackingEvent } from "@/utils/ga";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
const NonPrimeBlockerModule = dynamic(() => import("../../NonPrimeBlocker"), {
  ssr: false,
});
const WatchlistAddition = dynamic(() => import("../../WatchlistAddition"), {
  ssr: false,
});

const BiggBullTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
  parentHasScroll = false,
  sectionName = "",
}: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const [showNonPrimeBlocker, setShowNonPrimeBlocker] = useState(false);
  //const isPrime = true;
  //console.log("tableHead", tableHead);
  const [companyName, setCompanyName] = useState("");
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
        event_name: "subscriptions_blocker",
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
        <table
          className={`${styles.bibBullCustomTable} ${styles.allInvestors}`}
        >
          <thead>
            <tr>
              {tableHead &&
                tableHead.length > 0 &&
                tableHead.map((thead: any, index: number) => {
                  return (
                    <th
                      key={`${index}-${thead.id}`}
                      className={`${thead.sort ? styles.enableSort : ""} ${styles[thead.orderBy]}`}
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
              <th
                className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
              ></th>
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.length > 0 &&
              tableData.map((tdata: any, index: any) => {
                const networthIncome = tdata?.stockGroupdata?.filter(
                  (item: any) =>
                    item?.uiValue?.statusCheck === "lNetworthValue",
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
                      <Link
                        title={tdata?.investorIntro?.name}
                        onClick={() =>
                          gaTrackingInvestorNameClick(
                            tdata?.investorIntro?.name,
                          )
                        }
                        href={`/markets/top-india-investors-portfolio/${tdata?.investorIntro?.sharkSeoName},expertid-${tdata?.investorIntro?.sharkID}`}
                        className={styles.investNameImg}
                      >
                        <img
                          src={tdata?.investorIntro?.imageURL}
                          width={42}
                          height={42}
                          alt={tdata?.investorIntro?.name}
                          title={tdata?.investorIntro?.name}
                          className={styles.expertImg}
                          loading="lazy"
                        />
                        <span className={styles.nameTxt}>
                          {tdata?.investorIntro?.name}
                        </span>
                      </Link>
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
                        <div className={styles.rightSec}>
                          {isPrime &&
                          bestPicks[0].uiValue?.text &&
                          bestPicks[0].uiLabel?.companyId &&
                          bestPicks[0].uiLabel?.companyType ? (
                            <WatchlistAddition
                              companyName={bestPicks[0].uiLabel?.text}
                              companyId={bestPicks[0].uiLabel?.companyId}
                              companyType={bestPicks[0].uiLabel?.companyType}
                              customStyle={{
                                width: "18px",
                                height: "18px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className={styles.leftSec}>
                          <h5 className={styles.head5}>
                            {isPrime ? (
                              <a
                                onClick={() =>
                                  gaTrackingCompanyNameClick(
                                    bestPicks[0].uiLabel?.text,
                                  )
                                }
                                href={`${
                                  bestPicks[0]?.uiLabel?.text
                                    ? getStockUrl(
                                        bestPicks[0].uiLabel?.companyId,
                                        bestPicks[0].uiLabel?.companySeoName,
                                        bestPicks[0].uiLabel?.companyType,
                                      )
                                    : null
                                }`}
                                target="_blank"
                              >
                                {bestPicks.length > 0
                                  ? bestPicks[0].uiLabel?.text
                                  : null}
                              </a>
                            ) : (
                              <span
                                className={styles.nameBlur}
                                onClick={() =>
                                  blurNameHandler(bestPicks[0].uiLabel?.text)
                                }
                              ></span>
                            )}
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
                      </div>
                    </td>
                    <td
                      className={`${styles.bestPicWraper} ${styles.bestPic2Wraper}`}
                    >
                      <div className={styles.bestPickSec}>
                        <div className={styles.rightSec}>
                          {isPrime &&
                          bestPicksToNext[0].uiLabel?.text &&
                          bestPicksToNext[0].uiLabel?.companyId &&
                          bestPicksToNext[0].uiLabel?.companyType ? (
                            <WatchlistAddition
                              companyName={bestPicksToNext[0].uiLabel?.text}
                              companyId={bestPicksToNext[0].uiLabel?.companyId}
                              companyType={
                                bestPicksToNext[0].uiLabel?.companyType
                              }
                              customStyle={{
                                width: "18px",
                                height: "18px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className={styles.leftSec}>
                          <h5 className={styles.head5}>
                            {isPrime ? (
                              <a
                                onClick={() =>
                                  gaTrackingCompanyNameClick(
                                    bestPicksToNext[0].uiLabel?.text,
                                  )
                                }
                                href={`${
                                  bestPicksToNext[0]?.uiLabel?.text
                                    ? getStockUrl(
                                        bestPicksToNext[0].uiLabel?.companyId,
                                        bestPicksToNext[0].uiLabel
                                          ?.companySeoName,
                                        bestPicksToNext[0].uiLabel?.companyType,
                                      )
                                    : null
                                }`}
                                target="_blank"
                              >
                                {bestPicksToNext.length > 0
                                  ? bestPicksToNext[0].uiLabel?.text
                                  : null}
                              </a>
                            ) : (
                              <span
                                className={styles.nameBlur}
                                onClick={() =>
                                  blurNameHandler(
                                    bestPicksToNext[0].uiLabel?.text,
                                  )
                                }
                              ></span>
                            )}
                          </h5>
                          <span className={styles.fresExitEntry}>
                            {bestPicksToNext[0].text} -{" "}
                          </span>
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
                      </div>
                    </td>
                    <td
                      className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                    ></td>
                  </tr>
                );
              })}
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

export default BiggBullTable;
