import React, { useEffect, useState } from 'react';
import styles from './Search.module.scss'
import { formatDate,filterData } from '@/utils';
import SearchDataLi from './SearchDataLi';

interface Props {
    data:any;
}


const SearchData:React.FC<Props> = ({data}) => {
    const [companyListed,setCompanyListed] = useState<any>([]);
    const [companyNonListed,setCompanyNonListed] = useState<any>([]);
    const [mf,setMf] = useState<any>([]);
    const [nps,setNps] = useState<any>([]);

    useEffect(() => {
        if(data && Array.isArray(data)){
            const filteredListed = data.filter(item => item.entityType.toLowerCase() === "company" && item.subType.toLowerCase() === "nonlist");
            setCompanyListed(filteredListed);
            const filteredNonListed = data.filter(item => item.entityType.toLowerCase() === "company" && item.subType.toLowerCase() === "nonlist");
            setCompanyNonListed(filteredNonListed);
        }
    }, [])
    

  return (
    <div className = {styles.searchResult}>
        <div className={styles.searchListed}>
            <ul>
                {   
                    data && Array.isArray(data) ? (
                        data.map((item:any,index:number)=>
                        // companyListed.map((item:any,index:number)=>
                        //     <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        // )
                        // companyNonListed.map((item:any,index:number)=>
                        //     <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        // )
                        
                        // data.map((item:any,index:number)=>
                        // (() => {
                        //     if (item.entityType == "company" && item.subType != "NonList") {
                        //       return (
                        //         <>
                        //             <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        //         </>
                        //       );
                        //     } else if (item.entityType == "company" && item.subType == "NonList") {
                        //         return (
                        //           <>
                        //               <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        //           </>
                        //         );
                        //       } else if (item.entityType == "NPS") {
                        //       return (
                        //         <>
                        //           <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        //         </>
                        //       );
                        //     }else if (item.entityType == "MutualFund") {
                        //         return (
                        //           <>
                        //             <SearchDataLi index={index} item={item} entityType={item.entityType}/>
                        //           </>
                        //         );
                        //     }
                        //   })()

                            // <SearchDataLi index={index} item={item}/>
                            <li key={index} className={styles.searchliComp}>
                                <a href="#" target="_blank">
                                    <div className={styles.st_row}>
                                        <div className={styles.st_col}>{item.tagName}</div>
                                        {item.lastTradedPrice &&  <div className={`${styles.st_col} ${styles.cSprite_b} ${styles.st_change} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.lastTradedPrice}</div>}
                                        {item.NetChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}` }>{item.NetChange}</div>}
                                    </div>
                                    <div className={styles.st_row}>
                                    {item.DateTime && <div className={styles.st_col}>{formatDate(item.DateTime)}</div>}
                                    {item.volume && <div className={styles.st_col}>Vol. {item.volume}k</div>}
                                    {item.percentChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.percentChange}%</div>}       
                                    </div>
                                </a>
                            </li>
                        )
                    ) : (
                       data && data.searchresult && 
                        data.searchresult.map((item:any,index:number)=>
                            <li key={index} className={styles.searchliMost}>
                                <a href="#" target="_blank">
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
                        )
                    )
                }
            </ul>
        </div>
    </div>
  )
}

export default SearchData;
