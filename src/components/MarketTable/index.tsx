import React, { useEffect, useState } from 'react';
import styles from './MarketTable.module.scss';
import { getStockUrl } from '@/utils/utility';

const MarketTable = ({ data }: any) => {
  const [tableDataList, setTableDataList] = useState(data);
  const [filters, setFilters] = useState<any>({});

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

  console.log('@@--->', tableDataList);
  return (
    <div className={styles.tableWrapper}>
      {tableDataList && tableDataList?.length > 0 ? (
        <table className={styles.wathcListTable}>
          <thead>
            <tr>
              {tableDataList[0]?.data?.map((thead: any) => (
                <th key={thead.keyId}>{thead.keyText}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tableDataList[0]?.data?.map((tdData: any) => (
                <td className={styles.inputWrapper} key={tdData.keyId}>
                  <input
                    className={styles.filterInput}
                    type="text"
                    name={tdData.keyId}
                    onChange={handleFilterChange}
                    placeholder={
                      tdData.keyId == 'name' ? 'Search Values' : '> #'
                    }
                  ></input>
                </td>
              ))}
            </tr>
            {tableDataList.map((item: any, index: number) => (
              <tr key={item.assetId}>
                {item.data.map((tdData: any) =>
                  tdData.keyId == 'name' ? (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        'No Data Found'
      )}
    </div>
  );
};
export default MarketTable;
