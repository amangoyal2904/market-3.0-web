import React, { useState } from 'react'
import styles from './Search.module.scss'
import { formatDate } from '@/utils';

interface Props {
    index:number;
    item:any;
    entityType:string;
}

const SearchDataLi:React.FC<Props> = ({index,item,entityType}) => {
  return (
    <>  
        <li className={styles.head}>{entityType}</li> 
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
    </>
  )
}

export default SearchDataLi;