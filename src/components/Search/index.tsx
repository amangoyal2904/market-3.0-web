import { useState, useRef, useCallback, useEffect } from 'react';
import { APP_ENV } from "../../utils";
import APIS_CONFIG from "../../network/api_config.json"
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
    const [val,setVal] =useState("");
    const [searchEnable,setSearchEnable] = useState(false);
    const [newsData,setNewsData] = useState([])
    const [definitionData,setDefinitionData] = useState()
    const [reportData,setReportData] = useState()
    const ref = useRef<any>(null);

    const handleFocus = (query:string) => {
        
        if(!query){
            const API_URL="./popularStock.json";
            //const API_URL="https://json.bselivefeeds.indiatimes.com/ET_Community/multicompanyobject?varname=searchresult&exchange=50&order=true&pagsize=15&companytype=equity&companies=12934,13554,23479,10960,13215";
            fetch(API_URL)
            .then((response) => response.json())
            .then((res) => {
                console.log("???",res);
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
            let requests = [];
            if(query){
                const API_URL = (APIS_CONFIG as any)?.SEARCH.main[APP_ENV]+"&ticker="+query; 
                const NEWS_URL = (APIS_CONFIG as any)?.SEARCH.news["production"]+"?query="+query;
                const DEFINITION_URL = (APIS_CONFIG as any)?.SEARCH.definition["production"]+"?q="+query;
                const REPORT_URL = (APIS_CONFIG as any)?.SEARCH.report["production"]+"?keyword="+query;
                requests = [API_URL, NEWS_URL,DEFINITION_URL,REPORT_URL].map((url) =>
                    fetch(url, {
                        method: "GET"
                    })
                );
            }else{
                const API_URL="./popularStock.json";
                requests = [API_URL].map((url) =>
                    fetch(url, {
                        method: "GET"
                    })
                );
            }
            
        Promise.all(requests)
        .then((responses) =>
        responses.forEach((response, i) => {
            response
              .json()
              .then((result) => {
                if (i === 0) {
                  setData(result);
                } else if (i === 1) {
                    setNewsData(result);
                    console.log("NewsData>>",newsData);
                }else if (i === 2) {
                    setDefinitionData(result);
                    console.log("definitionData>>",definitionData);
                }else if (i === 3) {
                    setReportData(result);
                    console.log("reportData>>",reportData);
                }
                if(query){
                    setVal(query);
                }
                setSearchEnable(true);
              })
              .catch((error) => {
                console.error(`Data Fetch Error Inner: ${error}`);
              });
          })
          
        )
        .catch((error) => {
          console.error(`Data Fetch Error Outer: ${error}`);
        })
        .then(() => {
          
        });





            // fetch(API_URL)
            // .then((response) => response.json())
            // .then((res) => {
            //     setData(res);
            //     if(query){
            //         setVal(query);
            //     }
            //     setSearchEnable(true);
            // })
            // .catch((err) => {
            //     console.log(err);
            // })
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
        <SearchData data={data} query={val}/>
        </>
        }
        
    </div>
  )
}
export default Search;
