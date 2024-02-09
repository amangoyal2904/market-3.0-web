import styles from './CreateNewView.module.scss';

const NameViewComponent = ({createViewNameHandler,screenerName,setScreenerName}:any)=>{
    const  createViewHandler = ()=>{
        if(screenerName && screenerName !== ''){
            createViewNameHandler(screenerName.trim())
        }else{
            alert('Plase fill your screener name');
        }
    }
    return (
        <>
            <div className={styles.wraperSmall}>
                <div className={`${styles.perWrap}`}>
                    <div className={styles.header}>
                        Name your custom view
                    </div>
                    <div className={styles.body}>
                        <div className={styles.createFormGoup}>
                            <input type="text" value={screenerName} onChange={(e:any)=>setScreenerName(e.target.value)} placeholder="Enter a name..." />
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <span className={`refRemoveList ${styles.updateBtn}`} onClick={createViewHandler}>
                            Create view
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NameViewComponent;