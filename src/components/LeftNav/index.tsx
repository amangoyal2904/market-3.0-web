import { useState } from "react";
import styles from "./styles.module.scss";

const LeftNav = (props: any) => {
  console.log("props-----", props.leftNavResult);
  const { leftNavResult } = props;
  const { markets, markets_pro } = leftNavResult;
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.navWrap} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div onClick={toggleMenu}>
        <span className={"eticon_next"}></span>
        {isExpanded ? "Collapse" : "Expand"}
      </div>
      <div>
        <ul>
          {markets?.nav.map((value: any, index: any) => {
            return (
              <li key={index}>
                <span className={value.icon}>{value.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div></div>
    </div>
  );
};

export default LeftNav;
