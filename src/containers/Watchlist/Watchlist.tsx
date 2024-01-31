"use client";

import { useState, useEffect } from 'react';
import styles from './Watchlist.module.scss';
import WatchListTabs from "../../components/WatchListTabs";
import WatchListTable from "../../components/WatchListTable";

const Watchlist = () => {
  const [wathcListTab, setWatchListTab] = useState([]);
  const [tableData, setTableData] = useState([]);

  const FetchWatchListTabAPI = async ()=>{
      const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
      const data = await fetch(`https://qcbselivefeeds.indiatimes.com/screener/getwatchlistview?ssoid=${ssoid}`);
      const res = await data.json();
      setWatchListTab(res)
      const viewId = res[0].viewId;
      FetchWatchListTableAPI(viewId);
  }
  const FetchWatchListTableAPI = async (viewId:any)=>{
    const ssoid = "a9s3kgugi5gkscfupjzhxxx2y"
    const data = await fetch(`https://qcbselivefeeds.indiatimes.com/screener/watchlistData`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ssoid:ssoid
      },
      body: JSON.stringify({"pageno":1,"pagesize":15,"sort":[],"type":"STOCK","viewId":viewId,"deviceId":"web"})
    });
    const res = await data.json();
    setTableData(res);
    console.log('tabledata',res)
}
  useEffect(()=>{
    FetchWatchListTabAPI();
  },[])
  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Watchlist</h1>
      <WatchListTabs data={wathcListTab}/>
      <WatchListTable data={tableData}/>
    </div>
  )
}

export default Watchlist;
