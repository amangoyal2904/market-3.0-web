"use client";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BigBullTabs = ({
  data,
  individualFilter,
  aciveFilter,
  fitlerHandler,
}: any) => {
  const pathname = usePathname();
  const isActive = (path: any) => path === pathname;
  return (
    <>
      <div className={styles.tabSec}>
        <ul className={styles.bbtabs}>
          {data.map((tab: any, index: any) => {
            return (
              <li
                className={`${isActive(tab.url) ? styles.active : ""}`}
                key={`${index}-`}
              >
                <Link href={`${tab.url}`}>
                  <span>{tab.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className={styles.rigthTab}>
          {individualFilter.map((filter: any, index: number) => {
            return (
              <li
                onClick={() => {
                  fitlerHandler(filter.value);
                }}
                className={`${aciveFilter === filter.value ? styles.active : ""}`}
                key={`${index}-${filter.id}`}
              >
                <span>{filter.lable}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default BigBullTabs;
