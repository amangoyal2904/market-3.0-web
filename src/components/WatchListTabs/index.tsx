import styles from './WatchListTabs.module.scss';




const WatchListTabs = ({data}:any) => {
    return (
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
            {
                data.map((item:any)=>{
                    return (
                        <li key={item.name} className={ item.active ? styles.active : ""}>
                            {item.name}
                        </li>
                    )
                })
            }
        </ul>
        <div className={styles.rightSide}>
            <span className={styles.btnStock}>Add Stocks</span>
            <span className={styles.btnStock}>Edit</span>
            <span className={styles.roundBtn}>Personalise</span>
            <span className={styles.roundBtn}>Export</span>
        </div>
      </div>
    )
  }
  
  export default WatchListTabs;

