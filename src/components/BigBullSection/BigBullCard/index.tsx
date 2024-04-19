import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { getStockUrl } from "@/utils/utility";

const BigBullCard = ({ data, type, mode }: any) => {
  return (
    <>
      <div className={`${styles.card} ${styles[type]}`}>
        <div className={styles.top}>
          <img
            src={data?.investorIntro?.imageURL}
            width={52}
            height={52}
            alt={data?.investorIntro?.name}
            className={styles.expertImg}
          />
          <h4 className={styles.expertName}>
            {data?.dealSignal !== "" ? (
              <span className={`${styles[data?.dealSignal]}`}>
                {data?.dealSignal}
              </span>
            ) : (
              ""
            )}
            {data?.investorIntro?.name}
          </h4>
        </div>
        {type === "card2" && (
          <div className={styles.middleTop}>
            <div className={styles.mtLeft}>
              {/* <div className={styles.updateDate}>Updated for Mar24 Qtr</div> */}
              <div className={styles.cname}>
                {data?.companyData?.text ||
                  data?.bestPickStockData?.companyData?.text}
              </div>
            </div>
            <div className={styles.mtRight}>+</div>
          </div>
        )}
        {data?.stockGroupdata && data?.stockGroupdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.stockGroupdata.map((item: any, index: number) => {
                const __classname =
                  item?.uiValue?.trend === "UP"
                    ? "up"
                    : item?.uiValue?.trend === "DOWN"
                      ? "down"
                      : "";
                return (
                  <li key={`${index}-dinv`}>
                    <span>{item?.uiLabel?.text}</span>
                    <span
                      className={`${styles.noTxt} ${styles[__classname]}`}
                      dangerouslySetInnerHTML={{ __html: item?.uiValue?.text }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}

        {data?.stockdata && data?.stockdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.stockdata.map((item: any, index: number) => {
                const __classname =
                  item?.uiValue?.trend === "UP"
                    ? "up"
                    : item?.uiValue?.trend === "DOWN"
                      ? "down"
                      : "";
                return (
                  index <= 2 && (
                    <li key={`${index}-dinv`}>
                      <span>{item?.uiLabel?.text}</span>
                      <span
                        className={`${styles.noTxt} ${styles[__classname]}`}
                        dangerouslySetInnerHTML={{
                          __html: item?.uiValue?.text,
                        }}
                      />
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}

        {data?.bestPickStockData?.stockdata &&
        data?.bestPickStockData?.stockdata.length > 0 ? (
          <div className={styles.middle}>
            <ul className={styles.netItemList}>
              {data.bestPickStockData.stockdata.map(
                (item: any, index: number) => {
                  const __classname =
                    item?.uiValue?.trend === "UP"
                      ? "up"
                      : item?.uiValue?.trend === "DOWN"
                        ? "down"
                        : "";
                  return (
                    index <= 2 && (
                      <li key={`${index}-dinv`}>
                        <span>{item?.uiLabel?.text}</span>
                        <span
                          className={`${styles.noTxt} ${styles[__classname]}`}
                          dangerouslySetInnerHTML={{
                            __html: item?.uiValue?.text,
                          }}
                        />
                      </li>
                    )
                  );
                },
              )}
            </ul>
          </div>
        ) : (
          ""
        )}

        {type === "card1" && (
          <div className={styles.bottom}>
            <ul className={styles.cardListBtm}>
              {data?.cards && data?.cards.length > 0
                ? data.cards.map((card: any, i: number) => {
                    const __classname =
                      card?.uiValue?.trend === "UP"
                        ? "up"
                        : card?.uiValue?.trend === "DOWN"
                          ? "down"
                          : "";
                    return (
                      <li key={`${i}-cds`}>
                        <span
                          className={`${styles.topBatch} ${i === 0 ? styles.suc : styles.wr}`}
                        >
                          {card?.text}
                        </span>
                        <h4>
                          <Link
                            href={getStockUrl(
                              card.uiLabel.companyId,
                              card.uiLabel.companySeoName,
                              card.uiLabel.companyType,
                            )}
                            target="_blank"
                          >
                            {card?.uiLabel.text}
                          </Link>
                        </h4>
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
        )}
      </div>
    </>
  );
};

export default BigBullCard;
