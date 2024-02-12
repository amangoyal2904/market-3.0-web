import { useState, useEffect, useRef } from 'react';
import styles from './StockAdd.module.scss';
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
import { getCookie } from "../../utils/index";
import { getStockUrl } from "../../utils/utility";
const AddStockComponent = ({moduelClose}:any)=>{
    const [viewStocks, setViewStocks]:any = useState([]);
    const [searchNode, setSearchNode] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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
                const filterData = res.length > 0 ? res.filter((stock:any)=> stock.subType!== 'NonList') : []
                setViewStocks(filterData)
              })
              .catch((err) => {
                console.log(err);
              });
        }
    }
    const addCompanyWatchlistHandler = (companyData:any)=>{
        // ===
        console.log('companyData',companyData)
        const action = 1;
        const companytType = companyData.entityType === 'company' && !companyData.subType ? 'equity' : companyData.subType ? companyData.subType : "";
        const tagName = companyData.tagName;
        const companyId = companyData.tagId

        const stockDetails = {companyName: tagName, companyType: companytType, companyId: companyId}
        const type = 11;
        // https://marketservices.indiatimes.com/marketservices/companyshortdata?companyid=12799&companytype=equity
        saveFollowDetailsHandler(action, stockDetails, (msg:any)=>{
            if(msg && msg.status && msg.status==='success'){
                // updateFollowedStocks({id: compId, companyType: compType}, action===0 ? 'UNFOLLOW': 'FOLLOW');
                console.log('reload', msg)
            }   
        }, type)
    }
    const saveFollowDetailsHandler = async (action:any, data:any, callback:any, type:any)=>{
        if(action == 1){
            const apiRes = await fetch(`https://marketservices.indiatimes.com/marketservices/companyshortdata?companyid=${data.companyId}&companytype=${data.companyType}`)
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
            saveFollowDetailsV2Handler(action, data, callback, type);
        }else{
            saveFollowDetailsV2Handler(action, data, callback, type);
        }
    }
    const saveFollowDetailsV2Handler = async (action:any, data:any, callback:any, type:any)=>{
        const _authorization = getCookie('peuuid') ? getCookie('peuuid') : data.peuuid ? data.peuuid : '1135320605';
        //const _authorization = "1135320605";
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
        // https://etusersqc2.economictimes.indiatimes.com/et/savesettings/json
        // https://etup.economictimes.indiatimes.com/et/savesettings/json
        const apiRes = await fetch(`https://etusersqc2.economictimes.indiatimes.com/et/savesettings/json`,{
            method: "POST",
            headers: {"Authorization": _authorization, "Content-Type": "application/json"},
            body: JSON.stringify(followData),
            mode: 'cors',
          })
        const jsonResGetAPI = await apiRes.json();
        console.log('jsonResGetAPI',jsonResGetAPI)
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
                            viewStocks.length > 0 ? <ul className={styles.lsitItem}>{viewStocks.map((item:any)=>{
                                
                                return <li key={item.tagId} onClick={()=>addCompanyWatchlistHandler(item)}>
                                    <span data-linkCompany={getStockUrl(
                                        item.tagId,
                                        item.tagSeoName,
                                        item.subType || item.entityType,
                                        )}
                                        title={item.tagName}>
                                        {item.tagName}
                                    </span>
                                    <span className={styles.addRemove}></span>
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