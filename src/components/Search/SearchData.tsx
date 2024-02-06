import React, { useEffect, useState } from 'react';
import styles from './Search.module.scss'
import { formatDate,filterData } from '@/utils';
import SearchDataLi from './SearchDataLi';
import { getStockUrl } from '@/utils/utility';

interface Props {
    data:any;
    query:string;
}


const SearchData:React.FC<Props> = ({data,query}) => {
    const [companyListed,setCompanyListed] = useState<any>([]);
    const [companyNonListed,setCompanyNonListed] = useState<any>([]);
    const [mf,setMf] = useState<any>([]);
    const [nps,setNps] = useState<any>([]);
    const [etf,setEtf] = useState<any>([]);
    const [crypto,setCrypto] = useState<any>([]);
    const [forex,setForex] = useState<any>([]);
    const [commodity,setCommodity] = useState<any>([]);
    const [index,setIndex] = useState<any>([]);
    const records = {
        compcount : 6,
        coincount: 2,
        mfcount: 2,
        npscount: 2,
        cmdtcount : 2,
        inetcount : 2,
        defcount : 2,
        forexcount : 2,
        indicescount : 2,
        etfcount: 2,
        nonlistcount:3
    }
            	
    useEffect(() => {
        if(data && Array.isArray(data)){
            const filteredListed = data.filter(item => (item.entityType.toLowerCase() === "company" && item?.subType != "NonList") || item.entityType == "dvr" || item.entityType == "pp" || item.entityType == "idr" || item.entityType == "dvr" );
            setCompanyListed(filteredListed);
            console.log("Companies",filteredListed);
            const filteredNonListed = data.filter(item => item.entityType.toLowerCase() === "company" && item.subType && item.subType.toLowerCase() === "nonlist");
            setCompanyNonListed(filteredNonListed);
            setMf(filterData(data,"MutualFund"));
            setNps(filterData(data,"NPS"));
            setEtf(filterData(data,"ETF"));
            setCrypto(filterData(data,"crypto"));
            setForex(filterData(data,"forex"));
            setCommodity(filterData(data,"commodity"));
            setIndex(filterData(data,"index"));
        }
    }, [data])
    

  return (
    <div className = {styles.searchResult}>
        <div className={styles.searchListed}>
            <ul>
                {   
                    data && Array.isArray(data) ? (
                        <>
                            {companyListed.length > 0 && <SearchDataLi item={companyListed} entity={"Companies"} count={records.compcount} query={query}/>}
                            {companyNonListed.length > 0 && <SearchDataLi item={companyNonListed} entity={"Non Listed Companies"} count={records.nonlistcount} query={query}/>}
                            {mf.length > 0 && <SearchDataLi item={mf} entity={"Mutual Funds"} count={records.nonlistcount} query={query}/>}
                            {nps.length > 0 && <SearchDataLi item={nps} entity={"NPS"} count={records.nonlistcount} query={query}/>}
                            {etf.length > 0 && <SearchDataLi item={etf} entity={"ETF"} count={records.nonlistcount} query={query}/>}
                            {crypto.length > 0 && <SearchDataLi item={crypto} entity={"CRYPTOCURRENCY"} count={records.coincount} query={query}/>}
                            {forex.length > 0 && <SearchDataLi item={forex} entity={"FOREX"} count={records.forexcount} query={query}/>}
                            {commodity.length > 0 && <SearchDataLi item={commodity} entity={"COMMODITY"} count={records.cmdtcount} query={query}/>}
                            {index.length > 0 && <SearchDataLi item={index} entity={"INDEX"} count={records.inetcount} query={query}/>}
                            {companyListed.length == 0 && companyNonListed.length == 0 && mf.length == 0 && etf.length == 0 && crypto.length == 0 && forex.length == 0 && commodity.length == 0 && index.length == 0 && <p className={styles.noRecord}>No Record Found!!</p>}
                        </>
                    ) : (
                        <>
                            <li className={styles.head}>MOST POPULAR STOCKS</li> 
                            {data && data.searchresult && 
                                data.searchresult.map((item:any,index:number)=>
                            <li key={index} className={styles.searchliMost}>
                                <a href={getStockUrl(item.companyid,item.seoname,item.companytype)} target="_blank">
                                    <div className={styles.st_row}>
                                        <div className={styles.st_col}>{item.companyname}</div>
                                        <div className={`${styles.st_col} ${styles.cSprite_b} ${styles.st_change} ${Number(item.absolutechange) > 0 ? styles.green : styles.red}`}>{item.current}</div>
                                        <div className={`${styles.st_col} ${Number(item.absolutechange) > 0 ? styles.green : styles.red}` }>{item.absolutechange}</div>
                                    </div>
                                    <div className={styles.st_row}>
                                        <div className={styles.st_col}>{item.updateddatetime}</div>
                                        <div className={styles.st_col}>Vol. {item.volumeInThousand}k</div>
                                        <div className={`${styles.st_col} ${Number(item.absolutechange) > 0 ? styles.green : styles.red}`}>{item.percentagechange}%</div>
                                    </div>
                                </a>
                            </li>
                        )}
                        </>
                    )
                }
            </ul>
        </div>
    </div>
  )
}

export default SearchData;
