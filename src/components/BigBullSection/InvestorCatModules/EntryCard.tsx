import styles from "./styles.module.scss";
import WatchlistAddition from "../../WatchlistAddition";
import { useStateContext } from "@/store/StateContext";
import { getStockUrl } from "@/utils/utility";

const EntryCard = ({ data }: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  //const isPrime = true;
  return (
    <div className={`${styles.card}`}>
      <div className={styles.top}>
        {data?.dealSignal ? (
          <span className={styles[data?.dealSignal]}>{data?.dealSignal} </span>
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
                href={getStockUrl(
                  data?.companyData?.companyId ||
                    data?.bestPickStockData?.companyData?.companyId,
                  data?.companyData?.companySeoName ||
                    data?.bestPickStockData?.companyData?.companySeoName,
                  data?.companyData?.companyType ||
                    data?.bestPickStockData?.companyData?.companyType,
                )}
                target="_blank"
              >
                {/* {data?.filingAwaitedText &&
                        data?.filingAwaitedText !== "" ? (
                        <span>{data?.filingAwaitedText}</span>
                        ) : data?.dealDateStr && data?.dealDateStr !== "" ? (
                        <span>{data?.dealDateStr}</span>
                        ) : (
                        ""
                        )} */}
                {data?.companyData?.text ||
                  data?.bestPickStockData?.companyData?.text}
              </a>
            ) : (
              <span className={styles.nameBlur}></span>
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
                        className={`${styles[__classname]}`}
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
  );
};

export default EntryCard;
