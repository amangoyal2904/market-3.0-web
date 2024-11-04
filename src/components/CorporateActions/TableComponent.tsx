import WatchlistAddition from "../WatchlistAddition";
import ETPagination from "../Pagination/Pagination";
import Blocker from "@/components/Blocker";
import styles from "./styles.module.scss";
import Loader from "@/components/Loader";
import { dateFormat } from "@/utils";

interface TableProps {
  processingLoader: boolean;
  header: TableHeader[];
  handlePageChange: any;
  pagesummary: any;
  tableData: any;
}

interface TableHeader {
  watchlist: boolean;
  keyText: string;
  sort?: boolean;
  keyId?: string;
  type?: string;
}

const TableComponent: React.FC<TableProps> = ({
  handlePageChange,
  processingLoader,
  pagesummary,
  tableData,
  header,
}) => {
  return (
    <>
      {processingLoader ? (
        <div className={styles.loaderBox}>
          <Loader loaderType="container" />
        </div>
      ) : tableData?.length ? (
        <div className={styles.customTable}>
          <table>
            <thead>
              <tr>
                {header.map((ele) => (
                  <th key={ele?.keyId}>
                    {ele?.keyText}
                    {/* {ele.sort && (
                  <span className={`${styles.sortIcons}`}>
                      <span className={`eticon_up_arrow`}></span>
                      <span className={`eticon_down_arrow`}></span>
                  </span>
                  )} */}
                  </th>
                ))}
              </tr>
              {tableData.map((ele: any) => (
                <tr key={ele?.id}>
                  {header.map((cellVal) => (
                    <td key={`td_${cellVal?.keyId}`}>
                      <div className={styles.flex}>
                        {cellVal?.watchlist && (
                          <div className={styles.wlIcon}>
                            <WatchlistAddition
                              companyName={ele?.companyName}
                              companyId={ele?.compid || ele?.companyId}
                              companyType={ele?.companyType}
                              customStyle={{
                                width: "18px",
                                height: "18px",
                              }}
                            />
                          </div>
                        )}
                        {cellVal?.type === "date"
                          ? dateFormat(
                              cellVal?.keyId && ele[cellVal?.keyId],
                              "%d %MMM' %y",
                            )
                          : cellVal?.keyId && ele[cellVal?.keyId]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
          {pagesummary?.totalRecords > 10 && (
            <ETPagination
              pageSummary={pagesummary}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <Blocker
          type={"noDataFound"}
          customMessage={`No record found for the selected filters.<span class="desc">Try choosing a different filter to explore more.</span>`}
        />
      )}
    </>
  );
};

export default TableComponent;
