import styles from "./styles.module.scss";
// import WatchlistAddition from "../../WatchlistAddition";
import { useStateContext } from "@/store/StateContext";
import { getStockUrl } from "@/utils/utility";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
const NonPrimeBlockerModule = dynamic(() => import("../../NonPrimeBlocker"), {
  ssr: false,
});
import { redirectToPlanPage, trackingEvent } from "@/utils/ga";
const WatchlistAddition = dynamic(() => import("../../WatchlistAddition"), {
  ssr: false,
});

const EntryCard = ({ data }: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  //const isPrime = true;
  const [companyName, setCompanyName] = useState("");
  const [showNonPrimeBlocker, setShowNonPrimeBlocker] = useState(false);
  const blurNameHandler = () => {
    const objTracking = {
      category: "mercury_engagement",
      action: "card_clicked",
      label: `${data?.investorIntro?.name}`,
      widget_name: "Big Bull",
      tab_name: "Big Bull",
      obj: {
        item_name: "bigbull_investors",
        item_id: data?.investorIntro?.name,
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
    setCompanyName(data?.investorIntro?.name);
    redirectToPlanPage(objTracking, "view_item_list", false);
    setShowNonPrimeBlocker(true);
    document.body.style.overflow = "hidden";
  };
  const blurNameHandlerClose = () => {
    setShowNonPrimeBlocker(false);
    document.body.style.overflow = "";
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
      <div className={`${styles.card}`}>
        <div className={styles.top}>
          {data?.dealSignal ? (
            <span className={styles[data?.dealSignal]}>
              {data?.dealSignal}{" "}
            </span>
          ) : (
            ""
          )}
          {data?.qtrDate?.text ? (
            <span className={styles.dateTxt}>{data?.qtrDate?.text} </span>
          ) : data?.dealDateStr ? (
            <span className={styles.dateTxt}>{data?.dealDateStr} </span>
          ) : (
            ""
          )}
        </div>
        <div className={styles.middleTop}>
          <div className={styles.mtLeft}>
            <div className={styles.cname}>
              {isPrime ? (
                <a
                  onClick={() =>
                    gaTrackingInvestorNameClick(
                      data?.companyData?.text ||
                        data?.bestPickStockData?.companyData?.text,
                    )
                  }
                  href={getStockUrl(
                    data?.companyData?.companyId ||
                      data?.bestPickStockData?.companyData?.companyId,
                    data?.companyData?.companySeoName ||
                      data?.bestPickStockData?.companyData?.companySeoName,
                    data?.companyData?.companyType ||
                      data?.bestPickStockData?.companyData?.companyType,
                  )}
                  target="_blank"
                  title={
                    data?.companyData?.text ||
                    data?.bestPickStockData?.companyData?.text
                  }
                >
                  {data?.companyData?.text ||
                    data?.bestPickStockData?.companyData?.text}
                </a>
              ) : (
                <span
                  className={styles.nameBlur}
                  onClick={blurNameHandler}
                ></span>
              )}
            </div>
          </div>
          <div className={styles.mtRight}>
            {isPrime && (
              <WatchlistAddition
                companyName={
                  data?.companyData?.text ||
                  data?.bestPickStockData?.companyData?.text
                }
                companyId={
                  data?.companyData?.companyId ||
                  data?.bestPickStockData?.companyData?.companyId
                }
                companyType={
                  data?.companyData?.companyType ||
                  data?.bestPickStockData?.companyData?.companyType
                }
                customStyle={{
                  width: "18px",
                  height: "18px",
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <ul className={styles.cardListBtm}>
            {data?.stockdata && data?.stockdata.length > 0
              ? data.stockdata.slice(0, 3).map((card: any, i: number) => {
                  const __classname =
                    card?.uiValue?.trend === "UP"
                      ? "up"
                      : card?.uiValue?.trend === "DOWN"
                        ? "down"
                        : "";
                  return (
                    <li key={`${i}-cds`}>
                      <h4> {card?.uiLabel.text} </h4>
                      <h5>
                        <span
                          className={`numberFonts ${styles[__classname]}`}
                          dangerouslySetInnerHTML={{
                            __html: card?.uiValue.text,
                          }}
                        />
                      </h5>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      </div>
      {showNonPrimeBlocker && (
        <Suspense fallback={<div>Loading</div>}>
          <NonPrimeBlockerModule
            oncloseModule={blurNameHandlerClose}
            companyName={companyName}
          />
        </Suspense>
      )}
    </>
  );
};

export default EntryCard;
