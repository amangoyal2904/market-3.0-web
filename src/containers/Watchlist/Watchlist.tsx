'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Watchlist.module.scss';
import MarketTabs from '../../components/MarketTabs';
import MarketTable from '../../components/MarketTable';
import { fetchTabsData, fetchTableData } from '@/utils/utility';
import { useStateContext } from '../../store/StateContext';
import Blocker from '../../components/Blocker';
import Loader from '@/components/Loader';

const Watchlist = () => {
  const [wathcListTab, setWatchListTab] = useState([]);
  const [activeViewId, setActiveViewId] = useState(0);
  const [showBlocker, setShowBlocker] = useState(false);
  const [apiSuccess, setAPISuccess] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const { state } = useStateContext();
  const { isLogin, userInfo } = state.login;

  const tabsViewIdUpdate = (viewId: any) => {
    if (viewId != activeViewId) {
      setActiveViewId(viewId);
      fetchWatchListTableAPI(viewId);
    }
  };

  const fetchWatchListData = async (activeViewId:any = "") => {
    const res = await fetchTabsData();
    const viewId = activeViewId || res[0].viewId;
    setActiveViewId(viewId);
    if(res.length){
      setWatchListTab(res);
    }
    fetchWatchListTableAPI(viewId);
  };

  const fetchWatchListTableAPI = async (viewId: any) => {
    const res = await fetchTableData(viewId);
    if(res.message == "success"){
      setTableData(res.dataList);   
      setAPISuccess(true);
    } 
  }

  const filterChangeHandler = (e: { target: { name: string; value: any; }; }) => {
    const { name, value } = e.target;
    let filterArr = tableData.filter((item: any)=>{
        return item && item.data.some((x: { keyId: string; filterFormatValue: number; }) => x.keyId == name && x.filterFormatValue > value)
    })
    setTableData(filterArr);
  }
  const tabsAndTableDataChangeHandler = (tabIdActive:any)=>{
    fetchWatchListData(tabIdActive)
  }
  useEffect(() => {
    if (isLogin === true) {
      fetchWatchListData();
      setShowBlocker(false);
    }else if(isLogin === false){
      setShowBlocker(true);
    }
  }, [isLogin]);
  const tableHeaderData =
    (tableData &&
      tableData.length &&
      tableData[0] &&
      tableData[0]?.data) ||
    [];
  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Watchlist</h1>
      {showBlocker ? <Blocker type="loginBlocker"/> : <>
        <MarketTabs data={wathcListTab} activeViewId={activeViewId} tabsViewIdUpdate={tabsViewIdUpdate} tabsUpdateHandler={tabsAndTableDataChangeHandler} />
        <MarketTable data={tableData} tableHeaders={tableHeaderData} apiSuccess={apiSuccess} onFilterChange={filterChangeHandler} />
      </>
      }
    </div>
  );
};

export default Watchlist;
