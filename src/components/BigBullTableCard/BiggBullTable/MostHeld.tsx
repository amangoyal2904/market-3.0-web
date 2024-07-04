import styles from "./styles.module.scss";
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

const BiggBullMostHeldTable = ({
  tableHead,
  tableData,
  sortData,
  handleSort,
  shouldShowLoader,
  parentHasScroll = false,
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
  const [showPopupIndex, setShowPopupIndex] = useState<number | null>(null);

  const showMoreInvestorHandler = (index: number) => {
    if (showPopupIndex === index) {
      setShowPopupIndex(null); // Clicking on the same item should close the popup
    } else {
      setShowPopupIndex(index); // Clicking on a different item should show its popup
    }
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
          className={`${styles.bibBullCustomTable} ${styles.mostHeldTable}`}
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
              <th
                className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
              ></th>
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
                                title={tdata?.companyData?.text}
                                onClick={() =>
                                  gaTrackingCompanyNameClick(
                                    tdata?.companyData?.text,
                                  )
                                }
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
                            <span
                              className={styles.nameBlur}
                              onClick={() =>
                                blurNameHandler(tdata?.companyData?.text)
                              }
                            ></span>
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
                                  <li
                                    key={`-${index}--`}
                                    className={`${tdata?.investorsList.length === 1 || (tdata?.investorsList.length === 2 && index === 1) ? styles.noBorder : ""}`}
                                  >
                                    <Link
                                      title={list.name}
                                      onClick={() =>
                                        gaTrackingInvestorNameClick(list.name)
                                      }
                                      href={`/markets/top-india-investors-portfolio/${list?.sharkSeoName},expertid-${list?.sharkID}`}
                                      className={styles.investNameImg}
                                    >
                                      <img
                                        src={list.imageURL}
                                        width={28}
                                        height={28}
                                        alt={list.name}
                                        title={list.name}
                                        loading="lazy"
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

                              <div className={styles.popup}>
                                <div className={styles.popupContent}>
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
                                                title={list.name}
                                                onClick={() =>
                                                  gaTrackingInvestorNameClick(
                                                    list.name,
                                                  )
                                                }
                                                href={`/markets/top-india-investors-portfolio/${list?.sharkSeoName},expertid-${list?.sharkID}`}
                                                className={styles.investNameImg}
                                              >
                                                <img
                                                  src={list.imageURL}
                                                  width={28}
                                                  height={28}
                                                  alt={list.name}
                                                  title={list.name}
                                                  loading="lazy"
                                                />
                                                <h4>{list.name}</h4>
                                              </Link>
                                            </div>
                                          );
                                        })}
                                  </div>
                                </div>
                              </div>
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
                    <td
                      className={`${styles.fullWidth} ${!!parentHasScroll ? styles.hide : ""}`}
                    ></td>
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

export default BiggBullMostHeldTable;
