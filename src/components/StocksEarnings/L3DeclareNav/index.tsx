import styels from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import leftL3Nav from "../../../DataJson/earningL3Nav.json";
import { trackingEvent } from "@/utils/ga";

const L3DeclareNav = () => {
  const pathname = usePathname();
  const clickHandler = (item: any) => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_HomePage",
      event_action: "lhsmenu_click",
      event_category: "mercury_engagement",
      event_label: `Earnings ${item}`,
      feature_name: "HomePage",
      product_name: "Mercury_HomePage",
      selected_category: "Earnings",
    });
  };
  //console.log("___", pathname);
  return (
    <>
      <ul className={styels.leftNavList}>
        {leftL3Nav && leftL3Nav.length > 0
          ? leftL3Nav.map((item: any, index: number) => {
              return (
                <li
                  className={`${pathname === item.link ? styels.active : ""}`}
                  key={`${index}-${item.link}`}
                  onClick={() => clickHandler(item.title)}
                >
                  <Link href={`${item.link}`}>{item.title}</Link>
                </li>
              );
            })
          : ""}
      </ul>
    </>
  );
};

export default L3DeclareNav;
