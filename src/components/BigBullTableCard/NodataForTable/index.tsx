import styles from "./styles.module.scss";
import React from "react";

const NodataForTable = React.memo(({ title = "" }: any) => {
  return (
    <>
      <div className={styles.nodata}>
        <img
          src={`https://img.etimg.com/photo/msid-114377317/notfoundicon.jpg`}
          alt={`not found icon`}
          width={164}
          height={137}
          fetchPriority="high"
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
