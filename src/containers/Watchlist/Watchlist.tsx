"use client";

import { useState, useEffect } from 'react';
import styles from './Watchlist.module.scss';
import MarketTabs from "../../components/MarketTabs";
import MarketTable from "../../components/MarketTable";
import APIS_CONFIG from "../../network/config.json";
import { APP_ENV } from "../../utils";
import { fetchTabsData, fetchTableData } from '@/utils/utility';


const Watchlist = () => {
  const [wathcListTab, setWatchListTab] = useState([]);
  const [activeViewId, setActiveViewId] = useState(0);
  const [tableData, setTableData] = useState([]);

  const tabsViewIdUpdate = (viewId:any)=>{
    if(viewId != activeViewId){
      setActiveViewId(viewId);
      fetchWatchListTableAPI(viewId);
    }
  }

  const fetchWatchListData = async () => {
    const res = await fetchTabsData();
    const viewId = res[0].viewId;
    setActiveViewId(viewId);
    setWatchListTab(res)
    fetchWatchListTableAPI(viewId);
  }

  const fetchWatchListTableAPI = async (viewId:any)=>{
    const res = await fetchTableData(viewId);
    setTableData(res);
}

  useEffect(()=>{
    fetchWatchListData();
  },[])

  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Watchlist</h1>
      <MarketTabs data={wathcListTab} activeViewId={activeViewId} tabsViewIdUpdate={tabsViewIdUpdate}/>
      <MarketTable data={tableData}/>
    </div>
  )
}

export default Watchlist;
