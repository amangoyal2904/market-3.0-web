import React from 'react';
import styles from './MarketTable.module.scss';

const onFilterChange = (e: { target: { name: any; value: any; }; }) => {
  const { name, value } = e.target;
  console.log("@@@onFilterChange", name, value)
}

const MarketTable = ({ data }: any) => {
  const tableDataList = data.dataList;
  console.log("@@--->", tableDataList);
  return (
    <div className={styles.tableWrapper}>
      {
        tableDataList && tableDataList.length > 0 ? <table className={styles.wathcListTable}>
          <thead>
            <tr>
              <th>Stock Name</th>
              {tableDataList[0].data.map((thead: any) => (
                <th key={thead.keyText}>{thead.keyText}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.inputWrapper}>
                <input className={`${styles.filterInput} ${styles.filterInputfirst}`} name='Stock Name' onChange={onFilterChange} placeholder="Search values"></input>
              </td>
              {tableDataList[0].data.map((tdData: any) => (
                <td className={styles.inputWrapper}>
                  <input className={styles.filterInput} type='number' name={tdData.keyId} onChange={onFilterChange} placeholder='> #'></input>
                </td>
              ))}
            </tr>
            {tableDataList.map((item: any, index: number) => (
              <tr key={item.assetId}>
                <td>{item.assetName}</td>
                {item.data.map((tdData: any) => (
                  <td key={tdData.keyText}>{tdData.value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> : "No Data Found"
      }

    </div>
  )
}
export default MarketTable;

