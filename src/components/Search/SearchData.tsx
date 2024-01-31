import React, { useEffect } from 'react';
import styles from './Search.module.scss'

interface Props {
    data:any;
}

const SearchData:React.FC<Props> = ({data}) => {
    console.log("data>>",data)
  return (
    <div className = {styles.searchResult}>
        <div className={styles.searchListed}>
            <ul>
                
                {   
                    data && Array.isArray(data) ? (
                        data.map((item:any,index:number)=>
                            <li key={index} className={styles.searchliComp}>{item.tagName}</li>
                        )
                    ) : (
                       data && data.searchresult && 
                        data.searchresult.map((item:any,index:number)=>
                            <li key={index} className={styles.searchliMost}>
                                {item.companyShortName}
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
