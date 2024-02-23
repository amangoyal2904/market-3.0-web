import styles from "./style.module.scss";

const TabsMenuComponents = ({ data, activeMenu }: any) => {
  const tabClick = (id: any) => {
    console.log("click", id);
  };
  return (
    <>
      <ul className={styles.tabsList}>
        {data.map((item: any, index: number) => {
          return (
            <li
              key={item.id}
              onClick={() => tabClick(item.viewId)}
              className={activeMenu === item.viewId ? styles.active : ""}
            >
              {item.name}
            </li>
          );
        })}
        {/* {hiddenTabs && hiddenTabs.length > 0 ? (
            <li className={styles.moreTabsListData}>
              <div className={styles.moreTabWrap}>
                <div className={styles.moreSec}>
                  More{" "}
                  <span
                    className={`eticon_caret_down ${styles.moreCaretDown}`}
                  ></span>
                </div>
                <ul className={styles.moreListItem}>
                  {hiddenTabs.map((item: any, index: number) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => tabClick(item.viewId)}
                        className={
                          activeViewId === item.viewId ? styles.active : ""
                        }
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ) : null} */}
      </ul>
    </>
  );
};
export default TabsMenuComponents;
