import styles from './MarketTable.module.scss';




const MarketTable = ({data}:any) => {
  const tableDataList = data.dataList;
    return (
      <div className={styles.tableWraper}>
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
          {tableDataList.map((item: any) => (
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

