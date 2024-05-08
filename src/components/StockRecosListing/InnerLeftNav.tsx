import Link from "next/link";
import styles from "./styles.module.scss";
import FundNavAccordionItem from "./FundNavAccordionItem";
import { getFundHouseInfo } from "../../utils";
import GLOBAL_CONFIG from "../../network/global_config.json";

const InnerLeftNav = (props: any) => {
  const {
    recosNavResult,
    recosDetailResult,
    activeApi,
    niftyFilterData,
    slug,
    urlFilterHandle,
  } = props;

  return (
    <>
      {activeApi == "newRecos" &&
        recosNavResult?.tabs.map((item: any, index: any) => {
          return (
            <>
              {item.apiType == "newRecos" && item?.ss.length > 0 && (
                <ul
                  key={`newrecos_customScroll_ss_${index}`}
                  className={`customScroll ${styles.newRecosWrap}`}
                >
                  {item.ss.map((ssItem: any, ssindex: any) => {
                    return (
                      <>
                        <li
                          key={`newrecos_ss_${ssindex}`}
                          className={`${styles.newRecosSSList} ${slug?.[1] == ssItem.recoType ? styles.active : ""}`}
                        >
                          <Link
                            className={styles.ssLabel}
                            href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["home"]}/${item.seoPath}/${ssItem.recoType}${urlFilterHandle()}`}
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
      {slug.includes("brokerages") && (
        <div>
          <ul className={`customScroll ${styles.fundHousesLeftNavWrap}`}>
            <li
              className={`${styles.fundHousesLeftNav} ${styles.allBrokeragesTab} ${activeApi == "recoByFH" ? styles.active : ""}`}
            >
              <Link
                href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["fundhousedetails"]}${urlFilterHandle()}`}
              >
                All Brokerages
              </Link>
            </li>
            {recosDetailResult?.recoData?.[0].data.map(
              (item: any, index: any) => (
                <FundNavAccordionItem
                  key={`fundHousesLeftNavWrap_key_${index}`}
                  getFundHouseInfo={getFundHouseInfo(item, slug)}
                  item={item}
                  slug={slug}
                  urlFilterHandle={urlFilterHandle}
                />
              ),
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default InnerLeftNav;
