'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Watchlist.module.scss';
import MarketTabs from '../../components/MarketTabs';
import MarketTable from '../../components/MarketTable';
import { fetchTabsData, fetchTableData } from '@/utils/utility';
import { useStateContext } from '../../store/StateContext';
import Blocker from '../../components/Blocker';

const Watchlist = () => {
  const [wathcListTab, setWatchListTab] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeViewId, setActiveViewId] = useState(0);
  const [showBlocker, setShowBlocker] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterTableData, setFilterTableData] = useState([]);
  const { state } = useStateContext();
  const { isLogin, userInfo } = state.login;

  const tabsViewIdUpdate = (viewId: any) => {
    if (viewId != activeViewId) {
      setActiveViewId(viewId);
      fetchWatchListTableAPI(viewId);
    }
  };

  const fetchWatchListData = async () => {
    const res = await fetchTabsData();
    const viewId = res[0].viewId;
    setActiveViewId(viewId);
    setWatchListTab(res);
    fetchWatchListTableAPI(viewId);
  };

  const fetchWatchListTableAPI = async (viewId: any) => {
    const res = await fetchTableData(viewId);
    setTableData(res.dataList);
    setFilterTableData(res.dataList);
  };

  const checkIfValidExpression = (value: string) => {
    return /^[<>]=?\d+$/.test(value);
  };

  const filterChangeHandler = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    if (name != 'name' && checkIfValidExpression(value)) {
      setFilters({ ...filters, [name]: value });
    } else if (name === 'name') {
      setFilters({ ...filters, [name]: value });
    } else {
      delete filters[name];
      setFilters({ ...filters });
    }

    console.log('@@Filter: ' + JSON.stringify(filters));
    let filterData = tableData;
    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((keyId) => {
        filterData = filterData.filter((item: any) => {
          const cellValue = filters[keyId].trim();
          if (keyId == 'name') {
            return (
              item &&
              item.data.some(
                (x: { keyId: string; filterFormatValue: string }) =>
                  x.keyId == keyId && x.filterFormatValue.includes(cellValue)
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
          setFilterTableData(filterData);
        }
      });
    } else {
      setFilterTableData(tableData);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchWatchListData();
      setShowBlocker(false);
    } else {
      setShowBlocker(true);
    }
  }, [isLogin]);

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Watchlist</h1>
      {showBlocker ? (
        <Blocker text="Please login here for Watchlist" cta="Login" />
      ) : (
        <>
          <MarketTabs
            data={wathcListTab}
            activeViewId={activeViewId}
            tabsViewIdUpdate={tabsViewIdUpdate}
          />
          <MarketTable
            data={filterTableData}
            onFilterChange={filterChangeHandler}
          />
        </>
      )}
    </div>
  );
};

export default Watchlist;
