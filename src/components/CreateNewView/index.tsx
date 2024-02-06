import styles from './CreateNewView.module.scss';
import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const CreateNewViewComponent = ({closePopCreateView}:any)=>{
    const [viewData, setViewData]:any = useState([]);
    const [screenerName, setScreenerName]:any = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [searchNode, setSearchNode] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchListItems, setSearchListItems] = useState([]);
    const [selectedView, setSelectedView]:any = useState([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const viewWraperRef = useRef<HTMLDivElement>(null);
    //console.log('searchNode', searchNode)
    const ViewDataAPICall = async ()=>{
        const data = await fetch(`https://screener.indiatimes.com//screener/getScreenerSelectCategoryFieldMapping`)
        const resData = await data.json();
        const viewDataSet = resData && resData.datainfo && resData.datainfo.screenerCategoryLevelZero && resData.datainfo.screenerCategoryLevelZero.screenerCategoryLevelOne ? resData.datainfo.screenerCategoryLevelZero.screenerCategoryLevelOne : [];
        setViewData(viewDataSet)
    }
    
    const saveUserPersonalise = async ()=>{
        console.log('save user view personalize ', selectedView)
        const ssoid = window.objUser?.ssoid;
        const updatedOrder:any[] = [];
        selectedView.map((item:any)=>{
            return (
                updatedOrder.push(item.sourceFieldName)
            )
        })
        const apiUrl = 'https://qcbselivefeeds.indiatimes.com/screener/saveViewName';
        const bodyPost = {
            "fields":updatedOrder,
            "name":screenerName,
            "selectedFlag":1,
            "ssoId":ssoid,
            "viewType":"USER"
        }
        const res = await fetch(`${apiUrl}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ssoid: ssoid
            },
            body: JSON.stringify(bodyPost)
        })
        const resData = await res.json();
        console.log('resdata', resData)
        if(resData && resData.responseCode === 200){
            closePopCreateView(false)
            alert(resData.response)
        }else{
            alert("some error please check api or code")
        }
    }
    const handleTabClick = (index:number) => {
        setActiveTab(index);
    };
    const handleInputChange = (e:any) => {
        setSearchNode(e.target.value);
        if(e.target.value === ''){
            setSearchListItems([]);
        }
    };
    const FetchDataSearchView = async ()=>{
        const data = await fetch(`https://screener.indiatimes.com/screener/getScreenerDBCategoryFieldMapping?searchtext=${searchNode}`);
        const res = await data.json();
        const searchlistItemData = res && res.datainfo && res.datainfo.screenerDBCategoryFieldsList && res.datainfo.screenerDBCategoryFieldsList.length > 0 ? res.datainfo.screenerDBCategoryFieldsList : []
        setSearchListItems(searchlistItemData);
    }
    const highlightMatch = (text:string) => {
        const regex = new RegExp(`(${debouncedSearchTerm})`, 'gi');
        return text.replace(regex, (match, group) => `<strong>${group}</strong>`);
    };
    const handleClickOutside = (e:any) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setSearchListItems([]);
            setSearchNode("")
        }
    };
    const handleClickOutsidePopup = (e:any) => {
        if (viewWraperRef.current && !viewWraperRef.current.contains(e.target)) {
            closePopCreateView(false)
        }
    };
    const viewCheckHandler = (e:any, addData:any)=>{
        const isChecked = e.target.checked;
        if(isChecked){
            let viewAllDataforSelected:any = [...selectedView];
            const userSelectViewData = {
                "categoryMasterID":addData.categoryMasterID,
                 "displayName":addData.displayName,
                 "sourceFieldName":addData.sourceFieldName
            }
            viewAllDataforSelected.push(userSelectViewData);
            setSelectedView(viewAllDataforSelected)
        }else{
            let viewAllDataforSelected:any = [...selectedView];
            let updatedViewData = viewAllDataforSelected.filter((item:any) => item.categoryMasterID !== addData.categoryMasterID);
            setSelectedView(updatedViewData);
        }
    }
    const handleOnDragEnd = (result:any) => {
        //console.log('result',result)
        if (!result.destination) return; // Dropped outside the list
    
        const updatedListData = [...selectedView];
        const [movedItem] = updatedListData.splice(result.source.index, 1);
        updatedListData.splice(result.destination.index, 0, movedItem);
    
        // Update order IDs
        updatedListData.forEach((item, index) => {
          item.order = index + 1;
        });
        //console.log(updatedListData);
        setSelectedView(updatedListData);
    };
    useEffect(() => {
        
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [searchRef]);
    useEffect(() => {
        
        document.addEventListener('click', handleClickOutsidePopup);
        return () => {
          document.removeEventListener('click', handleClickOutsidePopup);
        };
    }, [viewWraperRef]);
    useEffect(()=>{
        ViewDataAPICall()
    },[])
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
        <div className={styles.wraper}>
            <div className={styles.perWrap} ref={viewWraperRef}>
                <div className={styles.header}>
                    <span>Create New View</span>
                    <div className={styles.formGroup}>
                        <input type="text" placeholder="Please enter screener name" value={screenerName} onChange={(e:any)=>setScreenerName(e.target.value)} />
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.bodySec}>
                        <div className={styles.filterSec}>
                            <div className={styles.leftSec}>
                                <h2>Selected Metrics</h2>
                                {/* <ul className={styles.viewList}>
                                    {
                                        selectedView.length > 0 ? selectedView.map((viewItem:any)=>{
                                            return (
                                                <li key={viewItem.categoryMasterID}>
                                                    <div className={styles.listItem}>
                                                        <span>{viewItem.displayName}</span>
                                                    </div>
                                                </li>
                                            )
                                        }) : ""
                                    }
                                </ul> */}
                                {
                            selectedView.length > 0 ? <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="list" type="group" key={selectedView.length}>
                                {(provided:any= {}, snapshot:any = {}) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef} className={styles.viewList}>
                                    {selectedView.map((list:any, index:any) => {
                                      return (
                                        <Draggable key={`${list.categoryMasterID}-${index}`} draggableId={`${list.categoryMasterID}-${index}`}  index={index}>
                                            {(provided:any) => {
                                              return (
                                                <li
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
                                                    {...provided.dragHandleProps}
                                                    >
                                                    <div className={styles.listItem}>
                                                      <span className={styles.itemTxt}>{list.displayName}</span>
                                                    </div>
                                                </li>
                                              )
                                            }}
                                        </Draggable>
                                      )
                                    })}
                                    {provided.placeholder}
                                </ul>
                                )}
                            </Droppable>
                        </DragDropContext> : ""
                        }
                            </div>
                            <div className={styles.rightSec}>
                                <div className={styles.topSearchSec}>
                                    <div className={styles.formGorup} ref={searchRef}>
                                        <span className={styles.searchIcon}></span>
                                        <input type="text" placeholder='Search for a Metrics...' className={styles.serchInput} value={searchNode} onChange={handleInputChange} />
                                        {
                                            searchListItems.length > 0 ? <ul className={styles.searchItemList}>{searchListItems.map((item:any)=>{
                                                return (
                                                    <li key={item.categoryFieldMasterID}>
                                                        <div className={styles.formGroup}>
                                                            <input 
                                                                type="checkbox" 
                                                                value={item.categoryMasterID} 
                                                                id={`${item.categoryMasterID}-search`}
                                                                checked={selectedView.some((viewItem:any) => viewItem.categoryMasterID === item.categoryMasterID)}
                                                                onChange={(e)=>viewCheckHandler(e, item)} />
                                                            <label htmlFor={`${item.categoryMasterID}-search`}  dangerouslySetInnerHTML={{ __html: highlightMatch(item.displayName) }}>
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })}</ul> : ""
                                        }
                                    </div>
                                </div>
                                <div className={styles.resultSec}>
                                <ul className={styles.topLevelList}>
                                    {viewData.length > 0 ? (
                                        viewData.map((item: any, index: number) => (
                                            <li key={item.categoryMappingID} className={index === activeTab ? styles.active : ""}  onClick={() => handleTabClick(index)}>
                                                <div className={styles.catHead}>{item.displayName}</div>
                                            </li>
                                        ))
                                    ) : (
                                        <div>No data found</div>
                                    )}
                                </ul>

                                {viewData.length > 0 && (
                                    <ul className={`${styles.innerListContainer} ${
                                        activeTab < viewData.length &&
                                        viewData[activeTab].screenerCategoryLevelTwo &&
                                        viewData[activeTab].screenerCategoryLevelTwo.length > 0
                                            ? styles.active
                                            : ''
                                    }`}>
                                        {activeTab < viewData.length && viewData[activeTab].screenerCategoryLevelTwo && viewData[activeTab].screenerCategoryLevelTwo.length > 0 ? (
                                            viewData[activeTab].screenerCategoryLevelTwo.map((subItem: any) => (
                                                <li key={subItem.categoryFieldMasterID}>
                                                    <div className={styles.subHeadName}>{subItem.displayName}</div>
                                                    {subItem.screenerCategoryFields && subItem.screenerCategoryFields.length > 0 && (
                                                        <ul className={styles.innerList}>
                                                            {subItem.screenerCategoryFields.map((childSubItem: any) => (
                                                                <li key={childSubItem.categoryFieldMasterID}>
                                                                    <div className={styles.forGroup}>
                                                                        <input type="checkbox" 
                                                                        id={childSubItem.categoryMasterID} 
                                                                        value={childSubItem.categoryMasterID} 
                                                                        className={styles.checkBoxSec} 
                                                                        onChange={(e)=>viewCheckHandler(e, childSubItem)}
                                                                        checked={selectedView.some((item:any) => item.categoryMasterID === childSubItem.categoryMasterID)} />
                                                                        <label htmlFor={childSubItem.categoryMasterID}>{childSubItem.displayName}</label>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <div>No inner data found</div>
                                        )}
                                    </ul>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <span className={styles.updateBtn} onClick={saveUserPersonalise}>Save Changes</span>
                </div>
            </div>
        </div>
    )
}

export default CreateNewViewComponent;