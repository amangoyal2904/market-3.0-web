import APIS_CONFIG from "../../../network/api_config.json";
import styles from "./style.module.scss";
import Service from "@/network/service";
import { APP_ENV } from "../../../utils/index";
import BigBullClientPage from "./clients";

const BigBullPage = async () => {
  const bigBullData = {
    tabs: [
      { title: "Overview", id: "overview", url: "" },
      { title: "All Investors", id: "allInvestors", url: "" },
      { title: "Qtr. Changes", id: "qtrChanges", url: "" },
      { title: "Recent Transactions", id: "recentTransactions", url: "" },
      { title: "Best Picks", id: "bestPicks", url: "" },
      { title: "Most Held", id: "mostHeld", url: "" },
    ],
  };
  return (
    <div className={styles.wraper}>
      <div className={styles.topSec}>
        <h1 className={`heading ${styles.head}`}>
          <span className={styles.etprimeLogo}>ETPrime</span>
          <span className={styles.bigLogo}>Big</span>
          <span className={styles.bullTxt}>Bull Portfolio</span>
        </h1>
        <p className={styles.desc}>
          Get to know where the market gurus invest to grow your portfolio.
        </p>
      </div>

      <div className={styles.container}>
        <BigBullClientPage data={bigBullData} />
      </div>
    </div>
  );
};

export default BigBullPage;
