import styles from "./styles.module.scss";
import Image from "next/image";
import React from "react";
import NotFoundImg from "../../../../public/img/notfoundicon.svg";

const NodataForTable = React.memo(({ title = "" }: any) => {
  return (
    <>
      <div className={styles.nodata}>
        <Image
          src={NotFoundImg}
          alt={`not found icon`}
          priority={true}
          quality={100}
        />
        <p className={styles.erroTxtFound}>
          {title !== ""
            ? title
            : `No Recommendations Found! Change the filters & try again.`}
        </p>
      </div>
    </>
  );
});
NodataForTable.displayName = "NodataForTable";
export default NodataForTable;
