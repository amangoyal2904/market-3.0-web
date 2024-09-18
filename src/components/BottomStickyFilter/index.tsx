import styles from "./BottomFilter.module.scss";
import { trackingEvent } from "@/utils/ga";

// Updated interface to support dynamic key-value pairs
interface FilterOption {
  [key: string]: string;
}

interface BottomStickyFilterProps {
  onClose: () => void;
  heading: string;
  desc?: string;
  widgetType?: string;
  // selectedFilter is now dynamic, based on the filter key provided
  selectedFilter: { [key: string]: string };
  filterOptions: FilterOption[];
  // onFilterChange should handle dynamic key-value pairs
  onFilterChange: (key: string, value: string) => void;
  // Adding props to allow users to pass dynamic keys for filtering and label display
  filterKey: string; // Key for filter (e.g., "id" or "key")
  filterLabelKey: string; // Key for label display (e.g., "label", "value")
}

const BottomStickyFilter = ({
  onClose,
  heading,
  desc,
  widgetType,
  selectedFilter,
  filterOptions,
  onFilterChange,
  filterKey, // Dynamic key for selection
  filterLabelKey, // Dynamic key for label display
}: BottomStickyFilterProps) => {
  const handleClose = () => {
    onClose();
  };

  // Updated to handle dynamic key-value pairs
  const handleFilterChange = (key: string, value: string) => {
    if (widgetType) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: `${widgetType}_filter_applied`,
        event_label: value,
      });
    }
    onFilterChange(key, value); // Pass the dynamic key and value
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <p className={styles.heading}>{heading}</p>
          {desc && <p className={styles.desc}>{desc}</p>}
          <span className={styles.modalClose} onClick={handleClose}>
            <i className="eticon_cross"></i>
          </span>
        </div>
        <div className={styles.modalBody}>
          <ul className={styles.listWrapper}>
            {filterOptions.map((item, index) => (
              <li
                className={styles.listItem}
                key={index}
                // Pass dynamic key and value to the handler
                onClick={() =>
                  handleFilterChange(item[filterKey], item[filterLabelKey])
                }
              >
                <input
                  id={`radio_${index}`}
                  type="radio"
                  // Check if selected filter matches dynamically based on the key
                  defaultChecked={selectedFilter[filterKey] === item[filterKey]}
                  name="filterRadio"
                  value={item[filterKey]}
                />
                {/* Display dynamic label */}
                <label htmlFor={`radio_${index}`}>{item[filterLabelKey]}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.modalOverlay} onClick={handleClose}></div>
    </>
  );
};

export default BottomStickyFilter;
