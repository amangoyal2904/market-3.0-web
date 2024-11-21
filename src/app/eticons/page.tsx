import { renderIconPaths } from "@/utils/iconUtils";
import styles from "./Eticons.module.scss";

const Eticons = () => {
  const iconsClasses = [
    "eticon_smartalerts",
    "eticon_learning_hub_icon",
    "eticon_chart_pattern",
    "eticon_accordion_down",
    "eticon_accordion_up",
    "eticon_ai_badge",
    "eticon_home",
    "eticon_lock_filled",
    "eticon_pattern_down_red",
    "eticon_pattern_up_green",
    "eticon_switch_to_et",
    "eticon_technical_signals",
    "eticon_marketmood",
    "eticon_news",
    "eticon_add",
    "eticon_arrow_left",
    "eticon_arrow_right",
    "eticon_benefits",
    "eticon_big_bull",
    "eticon_bookmark",
    "eticon_candlestick",
    "eticon_caret_down",
    "eticon_caret_left",
    "eticon_caret_right",
    "eticon_caret_up",
    "eticon_chart_view",
    "eticon_chevron_left",
    "eticon_chevron_right",
    "eticon_cross",
    "eticon_delete",
    "eticon_down_arrow",
    "eticon_download",
    "eticon_edit",
    "eticon_epaper_icon",
    "eticon_export_line",
    "eticon_filter",
    "eticon_graph_chart",
    "eticon_grid_view",
    "eticon_hamburger",
    "eticon_help",
    "eticon_hyphen",
    "eticon_ideas",
    "eticon_info",
    "eticon_list_view",
    "eticon_live_chat",
    "eticon_lock",
    "eticon_logout",
    "eticon_market",
    "eticon_menu_dots",
    "eticon_move",
    "eticon_newsletters",
    "eticon_next",
    "eticon_pdf",
    "eticon_personalise",
    "eticon_preferences",
    "eticon_prev",
    "eticon_prime_logo",
    "eticon_redeem_benefits",
    "eticon_retry",
    "eticon_rupee",
    "eticon_save",
    "eticon_screeners",
    "eticon_search",
    "eticon_share",
    "eticon_sort_asc",
    "eticon_sort_desc",
    "eticon_srplus",
    "eticon_star",
    "eticon_subscription",
    "eticon_thumbs_down",
    "eticon_thumbs_up",
    "eticon_tick",
    "eticon_up_arrow",
    "eticon_user_profile",
    "eticon_visible_eye",
    "eticon_visible_eye_off",
    "eticon_watchlist",
    "eticon_wealth",
    "eticon_table_view",
    "eticon_recos",
    "eticon_analyzer_colored",
    "eticon_discount_icon",
    "eticon_epaper_colored",
    "eticon_exclusives_colored",
    "eticon_investment_colored",
    "eticon_srplus_colored",
    "eticon_market_mood_colored",
  ];
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.heading}>
          Font Name: <span>eticons</span>
        </h1>
      </div>
      <div className={styles.pageContainter}>
        {iconsClasses.map((item, index) => (
          <div className={styles.glyphLeft} key={index}>
            <div className={styles.container}>
              <span className={item}>{renderIconPaths(item)}</span>
              <span className={styles.mls}> {item}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Eticons;
