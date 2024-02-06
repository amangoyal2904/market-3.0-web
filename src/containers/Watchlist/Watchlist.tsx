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
  const [activeViewId, setActiveViewId] = useState(0);
  const [showBlocker, setShowBlocker] = useState(false);
  const [tableData, setTableData] = useState([]);
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
          <MarketTable data={tableData} />
        </>
      )}
    </div>
  );
};

export default Watchlist;
