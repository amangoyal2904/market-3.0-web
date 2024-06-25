import React from "react";
import styles from "./Shimmer.module.scss";

const ShimmerMenu = React.memo(() => {
  const menuItems = [
    { label: "Menu 1" },
    { label: "Menu 2" },
    { label: "Menu 3" },
  ];
  return (
    <ul className={styles.menu}>
      {menuItems.map((item, index) => (
        <li className={styles.menuItem} key={index}>
          <div className={styles.shimmer}></div>
        </li>
      ))}
    </ul>
  );
});
ShimmerMenu.displayName = "ShimmerMenu";
export default ShimmerMenu;
