import React from 'react';
import styles from './MarketTable.module.scss';
import { getStockUrl } from '@/utils/utility';

const MarketTable = ({ data, onFilterChange }: any) => {
  const tableDataList = data;
  console.log("@@--->", tableDataList);
  return (
    <div className={styles.tableWrapper}>
      {
        tableDataList && tableDataList.length > 0 ? <table className={styles.wathcListTable}>
          <thead>
            <tr>
              {tableDataList[0].data.map((thead: any) => (
                <th key={thead.keyId}>{thead.keyText}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tableDataList[0].data.map((tdData: any) => (
                <td className={styles.inputWrapper}>
                  <input className={styles.filterInput} type='text' name={tdData.keyId} onChange={onFilterChange} placeholder={tdData.keyId == 'name' ? 'Search Values' : '> #'}></input>
                </td>
              ))}
            </tr>
            {tableDataList.map((item: any, index: number) => (
              <tr key={item.keyId}>
                {item.data.map((tdData: any) => (
                  tdData.keyId == 'name' ? <td key={tdData.keyId}><a href={getStockUrl(item.assetId, item.assetName, item.assetType)} target='_blank' title={tdData.value}>{tdData.value}</a></td> : <td className={tdData.trend} key={tdData.keyId}>{(tdData.value).replaceAll(' ', '')}</td>               
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

