import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Search.module.scss'
import SearchData from './SearchData';

const debounce = <T extends any[]>(
    func: (...args: T) => void,
    wait: number
    ): ((...args: T) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const Search = () => {
    const [data, setData] = useState([]);
    const [searchEnable,setSearchEnable] = useState(false);
    const ref = useRef<any>(null);

    const handleFocus = (query:string) => {
        console.log("???",query);
        if(!query){
            const API_URL="./popularStock.json";
            fetch(API_URL)
            .then((response) => response.json())
            .then((res) => {
                setData(res);
                setSearchEnable(true);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
    const fetchNameResults = (query:string) => {
        console.log(">>>",query);
        try {
            let API_URL = "";
            if(query){
                API_URL = "https://etsearch.indiatimes.com/etspeeds/etsearchMdata.ep?matchCompanyName=true&dvr=true&idr=true&nonList=true&pagesize=6&outputtype=json&ticker="+query; 
            }else{
                API_URL="./popularStock.json";
            }
            fetch(API_URL)
            .then((response) => response.json())
            .then((res) => {
                setData(res);
                setSearchEnable(true);
            })
            .catch((err) => {
                console.log(err);
            })
        } catch (e) {
            console.error(e);
        }
    }
    const handleSearch = useCallback(debounce(inputVal => fetchNameResults(inputVal), 500), []);
    const handleClose = () => {
        ref.current.value='';
        setSearchEnable(false);
    }
  return (
    <div className="dflex" id={styles.searchBar}>
        <input autoComplete="off" name="ticker_newsearch" className={styles.inputBox} placeholder="Search Stocks, News, Mutual Funds, Crypto etc..." type="text" 
        onChange={(e) => handleSearch(e.target.value)} 
        onFocus={(e)=> {handleFocus(e.target.value)}}
        ref={ref}
        />
        
        {searchEnable && 
        <>
        <div className={`${styles.right_icon} ${styles.close_search}`} onClick={handleClose}>X</div>
        <SearchData data={data}/>
        </>
        }
        
    </div>
  )
}
export default Search;
