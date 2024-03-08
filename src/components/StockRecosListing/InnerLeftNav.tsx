"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

const InnerLeftNav = (props: any) => {
  const { recosNavResult, recosDetailResult, activeApi, slug } = props;
  console.log("slug?.[1]====", slug?.[1]);
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
      {slug.includes("fundhousedetails") && recosDetailResult}
    </>
  );
};

export default InnerLeftNav;
