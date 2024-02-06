"use client";
import { useState } from 'react';

import styles from './MarketTabs.module.scss';

import PersonaliseModel from "../PersonaliseModel/index";
import CreateNewViewComponent from "../CreateNewView/index";


const MarketTabs = ({data, activeViewId, tabsViewIdUpdate}:any) => {
    const personaliseDataListItem = data && data.length > 0 ? data.filter((item:any)=> item.viewId !== 239) : [];
    const tabDataFilter = data && data.length > 0 ? data : [];
    const [openPersonaliseModal, setOpenPersonaliseModal] = useState(false);
    const [openPersonaliseCreateModal, setOpenPersonaliseCreateModal] = useState(false);
    const tabClick = (viewId:any)=>{
        tabsViewIdUpdate(viewId)
    }
    const userPersonaliseHandle = ()=>{
        setOpenPersonaliseModal(true)
    }
    const updateTabsListDataHandler = async (updateData:any)=>{
        //console.log('update data', updateData);
        const updatedOrder:any[] = [];
        updateData.map((item:any)=>{
            return (
                updatedOrder.push({"selectedFlag":item.selectedFlag, "viewId":item.viewId})
            )
        })
        const ssoid = window.objUser?.ssoid;
        const apiUrl = 'https://qcbselivefeeds.indiatimes.com/screener/saveOrderViewWatch';
        const bodyPost = {
            "ssoId":ssoid,
            "views":updatedOrder
        }
        const res = await fetch(`${apiUrl}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ssoid: ssoid
            },
            body: JSON.stringify(bodyPost)
        })
    }
    return (
        <>
        <div className={styles.tabsWrap}>
            <ul className={styles.tabsList}>
                {
                    tabDataFilter.map((item:any, index:number)=>{
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
                <span className={`${styles.roundBtn} ${styles.editBtnPencil}`} onClick={()=>userPersonaliseHandle()}>Personalise</span>
                <span className={`${styles.roundBtn} ${styles.exportIcon}`}>Export</span>
            </div> 
        </div>
        {
            openPersonaliseModal ? <PersonaliseModel  openPersonaliseModal={openPersonaliseModal} data={personaliseDataListItem} setOpenPersonaliseModal={setOpenPersonaliseModal} updateTabsListDataHandler={updateTabsListDataHandler} createNewViewHandler={setOpenPersonaliseCreateModal}/> : ""
        }
        {
            openPersonaliseCreateModal ? <CreateNewViewComponent closePopCreateView={setOpenPersonaliseCreateModal} /> : ""
        }
      </>
    )
  }
  
  export default MarketTabs;

