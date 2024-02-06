import React, { useState } from 'react'
import styles from './Search.module.scss'
import { formatDate, makeBold } from '@/utils';
import { getStockUrl } from '@/utils/utility';

interface Props {
    item:any;
    entity:string;
    count:number;
    query:string;
}

const SearchDataLi:React.FC<Props> = ({item,entity,count,query}) => {
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
                    <a href={getStockUrl(item.tagId,item.tagSeoName,item.entityType)} target="_blank">
                        <div className={styles.st_row} >
                            {entity == "NPS" ? <div className={styles.st_col} dangerouslySetInnerHTML={{ __html: sanitizeData(`${item.tagName} - ${item.SchemeName1} -${item.SchemeName2}`) }}></div>: <div className={styles.st_col} dangerouslySetInnerHTML={{ __html: makeBold(query,item.tagName) }}></div>}
                            {item.lastTradedPrice &&  <div className={`${styles.st_col} ${styles.cSprite_b} ${styles.st_change} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.lastTradedPrice}</div>}
                            {item.NetChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}` }>{item.NetChange}</div>}
                        </div>
                        {item.percentChange &&
                            <div className={`${styles.st_row} ${styles.st_last}`}>
                            {item.DateTime && <div className={styles.st_col}>{formatDate(item.DateTime)}</div>}
                            {item.volume && <div className={styles.st_col}>Vol. {parseFloat((Number(item.volume)/1000).toFixed(2))}k</div>}
                            {item.percentChange && <div className={`${styles.st_col} ${Number(item.NetChange) > 0 ? styles.green : styles.red}`}>{item.percentChange}%</div>}       
                            </div>
                        }
                    </a>
                    {entity == "Companies" && 
                        <div className={styles.st_options} data-url={getStockUrl(item.tagId,item.tagSeoName,item.entityType)}>
                            <span data-scrollsection="stockOverviewOffset">Overview</span>
                            <span data-scrollsection="technicalInsightsOffset">Technicals</span>
                            <span data-scrollsection="researchOffset">Analysis</span>
                            <span data-scrollsection="forecastOffset">Forecast</span>
                            <span data-scrollsection="recommendationsOffset">Recos</span>
                            <span data-scrollsection="peerComparisonOffset">Peers</span>
                            <span data-scrollsection="financialsOffset">Financials</span>
                            <span data-scrollsection="newsAnalysisOffset">News &amp; Annoucnements</span>
                            <span data-scrollsection="shareholdingPatternOffset">Shareholding</span>
                            <span data-scrollsection="corporateActionsOffset">Corp Action</span>
                            <span data-scrollsection="stocksAboutOffset">About</span>
                        </div>
                    }
                    
                </li>
            )
        }
        
    </>
  )
}

export default SearchDataLi;