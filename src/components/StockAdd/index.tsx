import { useState, useEffect, useRef } from 'react';
import styles from './StockAdd.module.scss';
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import {fetchAllWatchListData, saveStockInWatchList} from "../../utils/utility";
const AddStockComponent = ({moduelClose}:any)=>{
    const [viewStocks, setViewStocks]:any = useState([]);
    const [searchNode, setSearchNode] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [watchlistStock, setWatchlistStock] = useState([]);
    const viewWraperRef = useRef<HTMLDivElement>(null);
    const addStockModuleHandler = ()=>{
        moduelClose(false)
    }
    
    const handleInputChange = (e:any) => {
        setSearchNode(e.target.value);
        if(e.target.value === ''){
            setViewStocks([]);
        }
    };
    const FetchDataSearchView = ()=>{
        if (searchNode !== '') {
            const API_URL = (APIS_CONFIG as any)?.stockSearch[APP_ENV];
            fetch(`${API_URL}${searchNode}`)
              .then((response) => response.json())
              .then((res) => {
                const filterData = res.length > 0 ? res.filter((stock:any)=> stock.subType!== 'NonList') : [];
                const addFollowFlag = filterData.map((stock:any)=>{
                    const followData = watchlistStock.find((wathcList:any)=> wathcList.prefDataVal === stock.tagId)
                    const data = followData ? {...stock, follow:"yes"} : {...stock, follow:"no"}
                    return data
                })
                
                setViewStocks(addFollowFlag)
                console.log('followData',addFollowFlag)
              })
              .catch((err) => {
                console.log(err);
              });
        }
    }
    const addStockInWatchlistHandler = (companyData:any, action:any)=>{
        // ===
        console.log('companyData',companyData)
        const companytType = companyData.entityType === 'company' && !companyData.subType ? 'equity' : companyData.subType ? companyData.subType : "";
        const tagName = companyData.tagName;
        const companyId = companyData.tagId

        const stockDetails = {companyName: tagName, companyType: companytType, companyId: companyId}
        const type = 11;
        getMoreDetailsStockWathList(action, stockDetails, type)
    }
    const getMoreDetailsStockWathList = async (action:any, data:any, type:any)=>{
        const API_URL = (APIS_CONFIG as any)?.GETCompanyShortData[APP_ENV];
        const ApiFullURL = `${API_URL}?companyid=${data.companyId}&companytype=${data.companyType}`
        if(action == 1){
            const apiRes = await fetch(ApiFullURL)
            const jsonRes = await apiRes.json();
            let ltp, exch;
            if(typeof jsonRes.nse != 'undefined' && !!jsonRes.nse && !!jsonRes.nse.current){
                ltp = jsonRes.nse.current, exch = 50;
            }else if(typeof jsonRes.bse != 'undefined' && !!jsonRes.bse && !!jsonRes.bse.current) {
                ltp = jsonRes.bse.current, exch = 47;   
            } else {
                ltp = '', exch = '';
            }
            data.ltp = ltp;
        	data.exchange = exch;
            console.log('jsonRes',jsonRes, data)
            saveStockInWathListHanlder(action, data, type);
        }else{
            saveStockInWathListHanlder(action, data,type);
        }
    }
    const saveStockInWathListHanlder = async (action:any, data:any, type:any)=>{
        var type = !!type ? type : "11"
        var followData:any = {
            "action": action,
            "applicationname": 1,
            "articletype": type,
            "position": 0,
            "source": 0,
            "stype": 2 
        };
        if (!!type && (type == '22' || type == '23') ) {
            followData.msid = data.id
        } else {
            followData["companytype"] = data.companyType;
            followData["msid"] = data.companyId;
        }
        
        if (type == '11' && action == 1) {
            followData["propertiesList"] = [{
                "key": "companyName",
                "value": data.companyName
            },{
                "key": "priceOnDate",
                "value": data.ltp
            },{
                "key": "updatedPrice",
                "value": data.ltp
            },{
                "key": "exchange",
                "value": data.exchange
            }]
        }
        const addWathlistResAPI = await saveStockInWatchList(followData)
        //console.log('---save addWathlistResAPI',addWathlistResAPI, data.companyId)
        if(addWathlistResAPI?.status === 'success'){
            //alert(addWathlistResAPI.meessage);
        }else if(addWathlistResAPI?.status === 'failure'){
            alert(addWathlistResAPI.meessage)
        }
        const companyId = data.companyId;
        if(action == '1'){
            const addFollowFlag = viewStocks.map((stock:any)=>{
                const followData:any = companyId === stock.tagId
                const data = followData ? {...stock, follow:"yes"} : {...stock}
                return data
            })
            setViewStocks(addFollowFlag)
        }else if(action == '0'){
            const addFollowFlag = viewStocks.map((stock:any)=>{
                const followData:any = companyId === stock.tagId
                const data = followData ? {...stock, follow:"no"} : {...stock}
                return data
            })
            setViewStocks(addFollowFlag)
        }

    }
    const fetchWatchListStocks = async ()=>{
        const data = await fetchAllWatchListData('Follow',11)
        if(data?.resData?.length > 0){
            setWatchlistStock(data.resData)
        }else if(data?.length > 0){
            setWatchlistStock(data)
        }
    }
    useEffect(() => {
        const handleClickOutsidePopup = (e:any) => {
            if (viewWraperRef.current && !viewWraperRef.current.contains(e.target) && e.target.classList[0] !== 'refRemoveList') {
                moduelClose(false)
            }
        };
        document.addEventListener('click', handleClickOutsidePopup);
        return () => {
          document.removeEventListener('click', handleClickOutsidePopup);
        };
    }, [viewWraperRef, moduelClose]);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          setDebouncedSearchTerm(searchNode);
        }, 500);
    
        return () => {
          clearTimeout(delayDebounceFn);
        };
      }, [searchNode]);
      useEffect(() => {
        if (debouncedSearchTerm !== '') {
          FetchDataSearchView();
        }
      }, [debouncedSearchTerm]);
    useEffect(()=>{
        fetchWatchListStocks()
    },[])
    return (
        <>
            <div className={styles.addStockWrap}>
                <div className={styles.stockSec} ref={viewWraperRef}>
                    <div className={styles.header}>
                        <div className={styles.formGroup}>
                            <span className={`eticon_search ${styles.searchIcon}`}></span>
                            <input type="text" value={searchNode} onChange={(e)=>handleInputChange(e)} placeholder='Search & Add Stocks' />
                        </div>
                    </div>
                    <div className={styles.bodySec}>
                        
                        {
                            viewStocks.length > 0 ? <ul className={styles.lsitItem}>{viewStocks.map((item:any,index:any)=>{
                                
                                return <li key={`${item.tagId}--${index}`} onClick={()=>addStockInWatchlistHandler(item, item?.follow == "yes" ? 0 : 1)}>
                                    <span>
                                        {item.tagName}
                                    </span>
                                    {
                                        item?.follow === 'yes' ? <span className={styles.removeRemove}></span> : <span className={styles.addRemove}></span>
                                    }
                                    
                                </li>
                            })}</ul> : <div className={styles.noData}>Company not found! Please refine your search</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddStockComponent;