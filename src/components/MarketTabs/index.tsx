"use client";
import { useState } from 'react';

import styles from './MarketTabs.module.scss';




const MarketTabs = ({data, activeViewId, tabsViewIdUpdate}:any) => {
    const [stockModel, setStockModel] = useState(false);
    console.log('data',data)
    const tabClick = (viewId:any)=>{
        tabsViewIdUpdate(viewId)
    }
    return (
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
            {
                data.map((item:any, index:number)=>{
                    return (
                        <li key={item.id} onClick={()=>tabClick(item.viewId)} className={ activeViewId === item.viewId ? styles.active : ""}>
                            {item.name}
                        </li>
                    )
                })
            }
        </ul>
        <div className={styles.rightSide}>
            <span className={`${styles.btnStock} ${styles.stockBtn}`}>+ Add Stocks</span>
            <span className={`${styles.btnStock} ${styles.stockModifyBtn}`}>Edit</span>
            <span className={`${styles.roundBtn} ${styles.editBtnPencil}`}>Personalise</span>
            <span className={`${styles.roundBtn} ${styles.exportIcon}`}>Export</span>
        </div>
      </div>
    )
  }
  
  export default MarketTabs;

