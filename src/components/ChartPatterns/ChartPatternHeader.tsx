import { renderIconPaths } from "@/utils/iconUtils";
import styles from "./ChartPatternHeader.module.scss";
interface ChartPatternHeaderProps {
  description?: string;
}

const ChartPatternHeader = ({ description }: ChartPatternHeaderProps) => {
  const defaultDesc =
    "AI Chart Pattern detects real-time chart formations and provides actionable investment ideas. It highlights bullish patterns like Ascending Triangles,  Falling Wedges and more helping traders make informed decisions for better investments";

  const desc = description || defaultDesc;

  return (
    <>
      <div className={styles.wrapper}>
        <div className="dflex align-items-center">
          <div className={styles.logo}>
            <div className={styles.prime}>ETPrime</div>
            <h1 className={styles.heading}>
              <i className="eticon_chart_pattern"></i> AI Chart
              <span>Patterns</span>
            </h1>
          </div>
        </div>

        <div className={styles.desc}>
          <p dangerouslySetInnerHTML={{ __html: desc }} />
        </div>
      </div>
    </>
  );
};

export default ChartPatternHeader;
