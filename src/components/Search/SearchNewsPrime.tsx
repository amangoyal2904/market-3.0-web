import React, { useEffect, useState } from 'react'
import styles from './Search.module.scss'
import { makeBold } from '@/utils';
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils";

interface Props {
    item:any;
    entity:string;
    count:number;
    query:string;
}
const SearchNewsPrime:React.FC<Props> = ({item,entity,count,query}) => {
    return (
    <>
        <li className={styles.head}>{entity}</li> 
                {   
                    item.map((item:any,index:number)=>
                        index < count-1 && (
                            <li key={index} className={styles.searchliComp}>
                                <a href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}${item.link}`} target="_blank">
                                    <div className={styles.st_row}>
                                        <div className={`${styles.st_col} ${styles.news_col}`} dangerouslySetInnerHTML={{ __html: makeBold(query,item.title) }}></div>
                                    </div>
                                </a>
                            </li>
                        )
                    )
                }
    </>
  )
}
export default SearchNewsPrime;
