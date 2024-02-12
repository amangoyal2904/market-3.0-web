"use client";
import { useState,useRef, useEffect } from 'react';

import styles from './MarketTabs.module.scss';

import PersonaliseModel from "../PersonaliseModel/index";
import CreateNewViewComponent from "../CreateNewView/index";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import AddStockComponent from "../../components/StockAdd/index";

const MarketTabs = ({data, activeViewId, tabsViewIdUpdate, tabsUpdateHandler}:any) => {
    const personaliseDataListItem = data && data.length > 0 ? data.filter((item:any)=> item.viewId !== 239) : [];
    const tabDataFilter = data && data.length > 0 ? data.filter((item:any)=> item.selectedFlag) : [];
    const [openPersonaliseModal, setOpenPersonaliseModal] = useState(false);
    const [addStockShow, setAddStockShow] = useState(false);
    const [openPersonaliseCreateModal, setOpenPersonaliseCreateModal] = useState(false);
    const [editMode, setEditMode] = useState({mode:false,viewId:""});
    const tabsListRef = useRef<HTMLUListElement>(null);
    const [visibleTabs, setVisibleTabs] = useState<any[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<any[]>([]);
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
        const API_URL = (APIS_CONFIG as any)?.PERSONALISE_VIEW.updateTabs[APP_ENV];
       // const apiUrl = 'https://qcbselivefeeds.indiatimes.com/screener/saveOrderViewWatch';
        const bodyPost = {
            "ssoId":ssoid,
            "views":updatedOrder
        }
        const res = await fetch(`${API_URL}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ssoid: ssoid
            },
            body: JSON.stringify(bodyPost)
        })
        const resData = await res.json();
        console.log('resdata', resData)
        if(resData && resData.responseCode === 200){
            setOpenPersonaliseModal(false)
            //alert(resData.response);
            tabsUpdateHandler()
        }else{
            alert("some error please check api or code")
        }
    }
    const tabDataFitlerBaseOnWidth = ()=>{
        const tabsListWidth = tabsListRef.current?.offsetWidth;
        if (tabsListWidth != null) {
            let currentWidth = 0;
            const filterData = data.length > 0 ?  data.filter((item:any)=> item.selectedFlag) : [];
            const newVisibleTabs: any[] = [];
            const newHiddenTabs: any[] = [];
            for (const tab of filterData) {
                const tabWidth = tab.name.length * 10; // Adjust the width calculation as per your requirement
                if (currentWidth + tabWidth < tabsListWidth) {
                    newVisibleTabs.push(tab);
                    currentWidth += tabWidth;
                } else {
                    newHiddenTabs.push(tab);
                }
            }
            setVisibleTabs(newVisibleTabs);
            setHiddenTabs(newHiddenTabs);
        }
    }
    const addStockHandler = ()=>{
        setAddStockShow(true)
    }
    useEffect(() => {
        const handleResize = () => {
            const tabsListWidth = tabsListRef.current?.offsetWidth;
            if (tabsListWidth != null) {
                const actualTabListWith = tabsListWidth-400;
                const visibleTabsWidth = visibleTabs.reduce((totalWidth, tab) => {
                    return totalWidth + tab.offsetWidth;
                }, 0);
                const hiddenTabsWidth = hiddenTabs.reduce((totalWidth, tab) => {
                    return totalWidth + tab.offsetWidth;
                }, 0);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [visibleTabs, hiddenTabs]);
    useEffect(() => {
        tabDataFitlerBaseOnWidth()
    }, [data]);
    console.log('visibleTabs',visibleTabs)
    console.log('hiddenTabs',hiddenTabs)
    return (
        <>
        <div className={styles.tabsWrap}>
            <ul className={styles.tabsList} ref={tabsListRef}>
                {
                    visibleTabs.map((item:any, index:number)=>{
                        return (
                            <li key={item.id} onClick={()=>tabClick(item.viewId)} className={ activeViewId === item.viewId ? styles.active : ""}>
                                {item.name}
                            </li>
                        )
                    })
                }
                {hiddenTabs && hiddenTabs.length > 0 ? <li className={styles.moreTabsListData}>
                    <div className={styles.moreTabWrap}>
                        <div className={styles.moreSec}>More <span className={`eticon_caret_down ${styles.moreCaretDown}`}></span></div>
                        <ul className={styles.moreListItem}>
                            {
                                hiddenTabs.map((item:any, index:number)=>{
                                    return (
                                        <li key={item.id} onClick={()=>tabClick(item.viewId)} className={ activeViewId === item.viewId ? styles.active : ""}>
                                            {item.name}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </li> : null}
            </ul>
            <div className={styles.rightSide}>
                <span className={`${styles.btnStock} ${styles.stockBtn}`} onClick={addStockHandler}>+ Add Stocks</span>
                <span className={`${styles.btnStock} ${styles.stockModifyBtn}`}>Edit</span>
                <span className={`${styles.roundBtn} ${styles.editBtnPencil}`} onClick={()=>userPersonaliseHandle()}>Personalise</span>
                <span className={`${styles.roundBtn} ${styles.exportIcon}`}>Export</span>
            </div> 
        </div>
        {
            openPersonaliseModal ? <PersonaliseModel editmode={setEditMode} openPersonaliseModal={openPersonaliseModal} data={personaliseDataListItem} setOpenPersonaliseModal={setOpenPersonaliseModal} updateTabsListDataHandler={updateTabsListDataHandler} createNewViewHandler={setOpenPersonaliseCreateModal}/> : ""
        }
        {
            openPersonaliseCreateModal ? <CreateNewViewComponent closePopCreateView={setOpenPersonaliseCreateModal} tabsUpdateHandler={tabsUpdateHandler} editmode={editMode} /> : ""
        }
        {
            addStockShow ? <AddStockComponent moduelClose={setAddStockShow} /> : null
        }
      </>
    )
  }
  
  export default MarketTabs;

