import styles from "./Eticons.module.scss";

const Eticons = () => {
  const icons = [
    "eticon_add",
    "eticon_benefits",
    "eticon_big_bull",
    "eticon_bookmark",
    "eticon_caret_down",
    "eticon_caret_left",
    "eticon_caret_right",
    "eticon_caret_up",
    "eticon_chart_view",
    "eticon_cross",
    "eticon_edit",
    "eticon_epaper_icon",
    "eticon_export_line",
    "eticon_filter",
    "eticon_grid_view",
    "eticon_ideas",
    "eticon_list_view",
    "eticon_logout",
    "eticon_market",
    "eticon_marketmood",
    "eticon_move",
    "eticon_news",
    "eticon_newsletters",
    "eticon_next",
    "eticon_personalise",
    "eticon_preferences",
    "eticon_prev",
    "eticon_recos",
    "eticon_up_arrow",
    "eticon_down_arrow",
    "eticon_redeem_benefits",
    "eticon_screeners",
    "eticon_search",
    "eticon_srplus",
    "eticon_subscription",
    "eticon_table_view",
    "eticon_watchlist",
    "eticon_wealth",
  ];
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.heading}>
          Font Name: <span>eticons</span>
        </h1>
      </div>
      <div className={styles.pageContainter}>
        {icons.map((item, index) => (
          <div className={styles.glyphLeft} key={index}>
            <div className={styles.container}>
              <span className={item}></span>
              <span className={styles.mls}> {item}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Eticons;
