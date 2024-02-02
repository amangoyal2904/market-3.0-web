import React, { useState } from 'react'
import styles from './Search.module.scss'
import { formatDate, makeBold } from '@/utils';

interface Props {
    item:any;
    entity:string;
    count:number;
    query:string;
}

const SearchDataLi1:React.FC<Props> = ({item,entity,count,query}) => {
    const sanitizeData = (str:string) => {
       return makeBold(query,str);
    }
  return (
    <>  
        <li className={styles.head}>{entity}</li> 
        {
            item.map((item:any,index:number)=>
                index < count-1 && 
                <li key={index} className={styles.searchliComp}>
                    <a href="#" target="_blank">
                        <div className={styles.st_row} >
                            {entity == "NPS" ? <div className={styles.st_col} dangerouslySetInnerHTML={{ __html: sanitizeData(`${item.tagName} - ${item.SchemeName1} -${item.SchemeName2}`) }}></div>: <div className={styles.st_col} dangerouslySetInnerHTML={{ __html: makeBold(query,item.tagName) }}></div>}
                            {item.lastTradedPrice &&  <div className={`${styles.st_col} ${styles.cSprite_b} ${styles.st_change} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.lastTradedPrice}</div>}
                            {item.NetChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}` }>{item.NetChange}</div>}
                        </div>
                        {item.percentChange &&
                            <div className={styles.st_row}>
                            {item.DateTime && <div className={styles.st_col}>{formatDate(item.DateTime)}</div>}
                            {item.volume && <div className={styles.st_col}>Vol. {(Number(item.volume)/1000).toFixed(2)}k</div>}
                            {item.percentChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.percentChange}%</div>}       
                            </div>
                        }
                    </a>
                </li>
            )
        }
        
    </>
  )
}

export default SearchDataLi1;