import React from "react";
import styles from "./Search.module.scss";
import { makeBold } from "@/utils";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils";

interface Props {
  item: any;
  entity: string;
  count: number;
  query: string;
}
const SearchNews: React.FC<Props> = ({ item, entity, count, query }) => {
  //console.log("item", entity, item.length);
  return (
    <>
      <li className={styles.head} key={entity}>
        {entity}
      </li>
      {item.map((item: any, index: number) =>
        index < count - 1 && entity == "PEOPLE" ? (
          <>
            <li key={index} className={styles.searchliComp}>
              <a
                href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}${item.seo}`}
                target="_blank"
                title={item.name}
              >
                <div className={styles.st_row}>
                  <div
                    className={`${styles.st_col} ${styles.news_col}`}
                    dangerouslySetInnerHTML={{
                      __html: makeBold(query, item.name),
                    }}
                  ></div>
                </div>
              </a>
            </li>
          </>
        ) : (
          !(item?.link).includes("/prime/") && (
            <li key={index} className={styles.searchliComp}>
              <a
                href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}${item.link}`}
                target="_blank"
                title={item.title}
              >
                <div className={styles.st_row}>
                  <div
                    className={`${styles.st_col} ${styles.news_col}`}
                    dangerouslySetInnerHTML={{
                      __html: makeBold(query, item.title),
                    }}
                  ></div>
                </div>
              </a>
            </li>
          )
        ),
      )}
    </>
  );
};
export default SearchNews;
