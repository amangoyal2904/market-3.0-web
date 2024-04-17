import styles from "./styles.module.scss";

const BigBullTabs = ({ data, activeTab, tabHandlerClick }: any) => {
  return (
    <>
      <div className={styles.tabSec}>
        <ul className={styles.bbtabs}>
          {data.map((tab: any, index: any) => {
            return (
              <li
                onClick={() => tabHandlerClick(tab.id)}
                className={`${activeTab === tab.id ? styles.active : ""}`}
                key={`${index}-`}
              >
                <span>{tab.title}</span>
              </li>
            );
          })}
        </ul>
        <ul className={styles.rigthTab}>
          <li className={styles.active}>
            <span>Individual</span>
          </li>
          <li>
            <span>Institutional</span>
          </li>
        </ul>
      </div>
    </>
  );
};
export default BigBullTabs;
