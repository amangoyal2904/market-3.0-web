import React, { useEffect, useState } from 'react';
import styles from './MarketTable.module.scss';
import { getStockUrl } from '@/utils/utility';

const MarketTable = ({ data }: any) => {
  const [tableDataList, setTableDataList] = useState(data);
  const [filters, setFilters] = useState({} as any);

  function checkIfValidExpression(value: string) {
    return /^[<>=]\d+$/.test(value);
  }

  function handleFilterChange(e: any) {
    const { name, value } = e.target;
    if (name != 'name' && checkIfValidExpression(value)) {
      setFilters({ ...filters, [name]: value });
    } else if (name === 'name') {
      setFilters({ ...filters, [name]: value });
    } else if (value == '') {
      delete filters[name];
      setFilters({ ...filters });
    }
  }

  function filterTableData() {
    let filterData = data;
    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((keyId) => {
        filterData = filterData.filter((item: any) => {
          const cellValue = filters[keyId].trim();
          if (keyId == 'name') {
            return (
              item &&
              item.data.some(
                (x: { keyId: string; filterFormatValue: string }) =>
                  x.keyId == keyId &&
                  x.filterFormatValue
                    .toLowerCase()
                    .includes(cellValue.toLowerCase())
              )
            );
          } else {
            const [operator, comparisonValue] = cellValue
              .match(/([><=]+)(\d+)/)
              .slice(1);
            switch (operator) {
              case '>':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) >
                        parseFloat(comparisonValue)
                  )
                );
              case '<':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) <
                        parseFloat(comparisonValue)
                  )
                );
              case '=':
                return (
                  item &&
                  item.data.some(
                    (x: { keyId: string; filterFormatValue: any }) =>
                      x.keyId == keyId &&
                      parseFloat(x.filterFormatValue) ==
                        parseFloat(comparisonValue)
                  )
                );
              default:
                return true;
            }
          }
        });
        if (!!filterData) {
          console.log('@@Filter Data: ' + JSON.stringify(filterData));
          setTableDataList(filterData);
        }
      });
    } else {
      setTableDataList(data);
    }
  }

  useEffect(() => {
    setTableDataList(data);
  }, [data]);

  useEffect(() => {
    console.log({ filters });
    filterTableData();
  }, [filters]);

  const scrollRightPos = () => {
    const leftScroll:any = document.getElementById("fixedTable");
    const rightScroll:any = document.getElementById("scrollableTable");
    const rightScrollPos = rightScroll?.scrollTop;
    leftScroll.scrollTop = rightScrollPos;
  }
  const scrollLeftPos = () => {
    const leftScroll:any = document.getElementById("fixedTable");
    const rightScroll:any = document.getElementById("scrollableTable");
    const leftScrollPos = leftScroll.scrollTop;
    rightScroll.scrollTop = leftScrollPos;
  }

  console.log('@@--->', tableDataList);
  const tableHeaderData = tableDataList && tableDataList.length && tableDataList[0] && tableDataList[0].data || [];
  return (
 <div className={styles.tableWrapper}>
      {tableDataList.length > 0 && tableHeaderData.length > 0 ? 
      <>
        <div id="fixedTable" className={styles.fixedWrapper} onScroll={scrollLeftPos}>
            <table className={styles.watchListTable} >
            <thead>
              <tr className={styles.leftThWrapper}>
                {tableHeaderData.map((thead: any, index :number) => (
                  index <= 2 && <th key={thead.keyText}>{thead.keyText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {tableHeaderData.map((tdData: any, index : number) => (
                 index <= 2 && <td className={styles.inputWrapper}>
                      <input className={`${styles.filterInput} ${tdData.keyId == "name" ? styles.filterInputFirst : ""}`} type='text' name={tdData.keyId}  onChange={handleFilterChange} placeholder={tdData.keyId == "name" ? 'Search Value' : '> #'}></input>
                  </td>
                ))}
              </tr>
              {tableDataList.map((item: any, index: number) => (
                <tr key={item.assetId}>
                  {item.data.map((tdData: any, index: number) => (
                    index <= 2 && (tdData.keyId == 'name' ? (
                      <td key={tdData.keyId}>
                        <a
                          href={getStockUrl(
                            item.assetId,
                            item.assetName,
                            item.assetType
                          )}
                          target="_blank"
                          title={tdData.value}
                        >
                          {tdData.value}
                        </a>
                      </td>
                    ) : (
                      <td className={tdData.trend} key={tdData.keyId}>
                        {tdData.value.replaceAll(' ', '')}
                      </td>
                    )
                  )
                    
                    // <td className={styles.fixedTD} key={tdData.keyText}>{tdData.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="scrollableTable"  className={styles.scrollableWrapper}  onScroll={scrollRightPos}>
        <table className={styles.watchListTable} >
            <thead>
              <tr>
                {tableHeaderData.map((thead: any, index :number) => (
                  index >2 && <th key={thead.keyText}>{thead.keyText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {tableHeaderData.map((tdData: any, index : number) => (
                 index > 2 && <td className={styles.inputWrapper}>
                    <input className={styles.filterInput} type='text' name={tdData.keyId} onChange={handleFilterChange} placeholder='> #'></input>
                  </td>
                ))}
              </tr>
              {tableDataList.map((item: any, index: number) => (
                <tr key={item.assetId}>
                  {item.data.map((tdData: any, index: number) => (
                    index > 2 &&
                      <td className={tdData.trend} key={tdData.keyId}>
                        {tdData.value.replaceAll(' ', '')}
                      </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </>
     : "No Data Found"
  }
    </div>
  );
};
export default MarketTable;
