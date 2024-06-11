import styles from "./styles.module.scss";
import Image from "next/image";
import React from "react";

const NodataForTable = React.memo(({ title = "" }: any) => {
  return (
    <>
      <div className={styles.nodata}>
        <Image
          src={`/marketsweb/img/notfoundicon.svg`}
          alt={`not found icon`}
          width={164}
          height={137}
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
