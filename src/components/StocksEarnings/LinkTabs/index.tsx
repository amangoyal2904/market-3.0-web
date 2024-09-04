import Link from "next/link";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";

const tabsLinkData = [
  { url: "/markets/stocks/earnings", title: "Summary" },
  { url: "/markets/stocks/upcoming-results", title: "Upcoming Results" },
  { url: "/markets/stocks/declared-results", title: "Declared Results" },
  { url: "/markets/stocks/sector-aggregates", title: "Sector Aggregates" },
];

const LinkTabs = () => {
  const pathName = usePathname();
  return (
    <>
      <div className={styles.linkTabWrap}>
        <ul>
          {tabsLinkData.map((item: any, index: number) => {
            return (
              <li
                key={`${index}-${item.title}`}
                className={`${item.url === pathName ? styles.active : ""}`}
              >
                <Link href={`${item.url}`}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LinkTabs;
