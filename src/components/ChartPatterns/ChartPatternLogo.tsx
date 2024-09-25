import styles from "./ChartPatternLogo.module.scss";

interface ChartPatternLogoProps {
  primeLogo?: boolean;
}

const ChartPatternLogo: React.FC<ChartPatternLogoProps> = ({
  primeLogo = true,
}) => {
  return (
    <div className={styles.logo}>
      {primeLogo && <div className={styles.prime}>ETPrime</div>}
      <h1 className={styles.heading}>
        <i className="eticon_chart_pattern"></i> AI Chart
        <span> Patterns</span>
      </h1>
    </div>
  );
};

export default ChartPatternLogo;
