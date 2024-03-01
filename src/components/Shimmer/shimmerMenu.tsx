import styles from "./Shimmer.module.scss";

const ShimmerMenu = () => {
  const menuItems = [
    { label: "Menu 1" },
    { label: "Menu 2" },
    { label: "Menu 3" },
    { label: "Menu 4" },
    { label: "Menu 5" },
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
};

export default ShimmerMenu;
