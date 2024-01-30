import styles from './Watchlist.module.scss';
import WatchListTabs from "../../components/WatchListTabs";
import WatchListTable from "../../components/WatchListTable";

const TabData = [
  {
    name:"Overview",
    active:"active"
  },
  {
    name:"Key Metrics",
  },
  {
    name:"Returns",
  },
  {
    name:"Volatility",
  },
  {
    name:"Technicals",
  },
  {
    name:"Margins More",
  },
  {
    name:"More",
  }
]

const Watchlist = () => {
  return (
    <div className={styles.wraper}>
      <h1 className={styles.heading1}>Watchlist</h1>
      <WatchListTabs data={TabData}/>
      <WatchListTable />
    </div>
  )
}

export default Watchlist;
