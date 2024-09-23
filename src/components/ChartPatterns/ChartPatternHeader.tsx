import styles from "./ChartPatternHeader.module.scss";
import ChartPatternLogo from "./ChartPatternLogo";
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
          <ChartPatternLogo />
        </div>
        <div className={styles.desc}>
          <p dangerouslySetInnerHTML={{ __html: desc }} />
        </div>
      </div>
    </>
  );
};

export default ChartPatternHeader;
