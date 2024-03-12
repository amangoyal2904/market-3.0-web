import Link from "next/link";
import styles from "./styles.module.scss";
import FundNavAccordionItem from "./FundNavAccordionItem";
import { getFundHouseInfo } from "../../utils";

const InnerLeftNav = (props: any) => {
  const { recosNavResult, recosDetailResult, activeApi, slug } = props;

  return (
    <>
      {activeApi == "newRecos" &&
        recosNavResult?.tabs.map((item: any, index: any) => {
          return (
            <>
              {item.apiType == "newRecos" && item?.ss.length > 0 && (
                <ul className={styles.newRecosWrap}>
                  {item.ss.map((ssItem: any, ssindex: any) => {
                    return (
                      <>
                        <li
                          key={`newrecos_ss_${ssindex}`}
                          className={`${styles.newRecosSSList} ${slug?.[1] == ssItem.recoType ? styles.active : ""}`}
                        >
                          <Link
                            className={styles.ssLabel}
                            href={`/stocksrecos/${item.seoPath}/${ssItem.recoType}`}
                          >
                            {ssItem.label}
                          </Link>
                        </li>
                      </>
                    );
                  })}
                </ul>
              )}
            </>
          );
        })}
      {slug.includes("fundhousedetails") && (
        <ul className={styles.fundHousesLeftNavWrap}>
          <li
            className={`${styles.fundHousesLeftNav} ${styles.allBrokeragesTab} ${activeApi == "recoByFH" ? styles.active : ""}`}
          >
            <Link href="/stocksrecos/fundhousedetails">All Brokerages</Link>
          </li>
          {recosDetailResult?.recoData?.[0].data.map(
            (item: any, index: any) => (
              <FundNavAccordionItem
                key={`fundHousesLeftNavWrap_key_${index}`}
                getFundHouseInfo={getFundHouseInfo(item, slug)}
                item={item}
                slug={slug}
              />
            ),
          )}
        </ul>
      )}
    </>
  );
};

export default InnerLeftNav;
