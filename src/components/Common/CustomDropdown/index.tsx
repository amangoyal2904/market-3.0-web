import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomDropdown.module.scss";

// Define types for the props
interface FilterOption {
  [key: string]: any; // Allows dynamic keys for the filter object
}

interface CustomDropdownProps {
  selectedFilter?: FilterOption;
  filterOptions: FilterOption[]; // Required filter options
  onFilterChange: (key: string, label: string) => void; // Expects key and label
  filterKey?: string;
  filterLabelKey?: string;
  fetchOptions?: () => Promise<FilterOption[]>; // Function to fetch filter options (optional)
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  selectedFilter,
  filterOptions,
  onFilterChange,
  filterKey = "key",
  filterLabelKey = "label",
  fetchOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>(
    selectedFilter || filterOptions[0],
  );
  const [options, setOptions] = useState<FilterOption[]>(filterOptions); // Initialize with required options
  const [hasFetched, setHasFetched] = useState(false); // Track if options have been fetched
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown when clicking outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleItemClick = (item: FilterOption) => {
    setCurrentFilter(item); // Set the selected filter
    onFilterChange(item[filterKey], item[filterLabelKey]); // Pass key and label
    setIsOpen(false); // Close the dropdown
  };

  const toggleCustomDropdown = async () => {
    if (!isOpen) {
      // If dropdown is opening
      if (fetchOptions && !hasFetched) {
        // Fetch options only if not fetched yet
        try {
          const data = await fetchOptions();
          setOptions(data); // Update options with fetched data
          setHasFetched(true); // Mark as fetched
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      }
    }
    setIsOpen((prev) => !prev); // Toggle dropdown state
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={`${styles.filterBtn} ${isOpen ? styles.active : ""}`}
        onClick={toggleCustomDropdown}
      >
        <span>{currentFilter[filterLabelKey]}</span>
        <i className="eticon_caret_down"></i>
      </div>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((item) => (
            <li
              key={item[filterKey]}
              className={`${styles.dropdownItem} ${
                item[filterKey] === currentFilter[filterKey]
                  ? styles.active
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item[filterLabelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
