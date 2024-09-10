import styels from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import leftL3Nav from "../../../DataJson/earningL3Nav.json";

const L3DeclareNav = () => {
  const pathname = usePathname();
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
